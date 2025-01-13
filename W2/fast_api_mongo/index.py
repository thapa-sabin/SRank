from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from jwt import encode, decode, PyJWTError
from datetime import datetime, timedelta
from typing import List

# App and Database Setup
app = FastAPI()

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017")
db = client.library

# JWT Configurations
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class Book(BaseModel):
    title: str
    author: str
    availability: bool = True

class Member(BaseModel):
    name: str
    id: int

class Librarian(BaseModel):
    username: str
    password: str

class BorrowRequest(BaseModel):
    book_title: str
    member_id: int

class ReturnRequest(BaseModel):
    book_title: str
    member_id: int

books: List[Book] = []
members: List[Member] = []

# Utility Functions
def authenticate_user(username: str, password: str):
    librarian = db.librarians.find_one({"username": username})
    if librarian and librarian["password"] == password:
        return librarian
    return None

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_librarian(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    librarian = db.librarians.find_one({"username": username})
    if librarian is None:
        raise credentials_exception
    return librarian

# Routes
@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    librarian = authenticate_user(form_data.username, form_data.password)
    if not librarian:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": librarian["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/books/add")
async def add_book(book: Book, librarian: Librarian = Depends(get_current_librarian)):
    if db.books.find_one({"title": book.title}):
        raise HTTPException(status_code=400, detail="The book already exists in the library.")
    db.books.insert_one(book.dict())
    return {"message": f"Book '{book.title}' added successfully."}

@app.post("/members/add")
async def add_member(member: Member, librarian: Librarian = Depends(get_current_librarian)):
    if db.members.find_one({"id": member.id}):
        raise HTTPException(status_code=400, detail="The member already exists in the library.")
    db.members.insert_one(member.dict())
    return {"message": f"Member '{member.name}' added successfully."}

@app.post("/books/borrow")
async def borrow_book(request: BorrowRequest, librarian: Librarian = Depends(get_current_librarian)):
    member = db.members.find_one({"id": request.member_id})
    if not member:
        raise HTTPException(status_code=400, detail="Member not found.")

    book = db.books.find_one({"title": request.book_title})
    if not book:
        raise HTTPException(status_code=400, detail="Book not found in the library.")
    if not book["availability"]:
        raise HTTPException(status_code=400, detail=f"The book '{request.book_title}' is already borrowed.")

    db.books.update_one({"_id": book["_id"]}, {"$set": {"availability": False}})
    return {"message": f"Book '{request.book_title}' was borrowed successfully by member '{member['name']}'."}

@app.post("/books/return")
async def return_book(request: ReturnRequest, librarian: Librarian = Depends(get_current_librarian)):
    member = db.members.find_one({"id": request.member_id})
    if not member:
        raise HTTPException(status_code=400, detail="Member not found.")

    book = db.books.find_one({"title": request.book_title})
    if not book:
        raise HTTPException(status_code=400, detail="Book not found in the library.")
    if book["availability"]:
        raise HTTPException(status_code=400, detail="The book is already available.")

    db.books.update_one({"_id": book["_id"]}, {"$set": {"availability": True}})
    return {"message": f"Book '{request.book_title}' was returned successfully by member '{member['name']}'."}

@app.get("/books")
async def list_books(librarian: Librarian = Depends(get_current_librarian)):
    books = list(db.books.find({}, {"_id": 0}))
    return books

@app.get("/members")
async def list_members(librarian: Librarian = Depends(get_current_librarian)):
    members = list(db.members.find({}, {"_id": 0}))
    return members
