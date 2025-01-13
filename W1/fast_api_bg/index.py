from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from jwt import encode, decode, PyJWTError
from datetime import datetime, timedelta
from typing import List

# App and Database Setup
app = FastAPI()
Base = declarative_base()
engine = create_engine("sqlite:///library.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# JWT Configurations
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Models
class Librarian(Base):
    __tablename__ = "librarians"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
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

class BorrowRequest(BaseModel):
    book_title: str
    member_id: int

class ReturnRequest(BaseModel):
    book_title: str
    member_id: int
    
books: List[Book] = []
members: List[Member] = []

# Utility Functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(db: Session, username: str, password: str):
    librarian = db.query(Librarian).filter(Librarian.username == username).first()
    if librarian and librarian.password == password:
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

# Routes
@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    librarian = authenticate_user(db, form_data.username, form_data.password)
    if not librarian:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": librarian.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_librarian(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    librarian = db.query(Librarian).filter(Librarian.username == username).first()
    if librarian is None:
        raise credentials_exception
    return librarian

@app.post("/books/add")
async def add_book(book: Book, librarian: Librarian = Depends(get_current_librarian)):
    for existing_book in books:
        if existing_book.title == book.title:
            raise HTTPException(status_code=400, detail="The book already exists in the library.")
    books.append(book)
    return {"message": f"Book '{book.title}' added successfully."}

@app.post("/members/add")
async def add_member(member: Member, librarian: Librarian = Depends(get_current_librarian)):
    for existing_member in members:
        if existing_member.id == member.id:
            raise HTTPException(status_code=400, detail="The member already exists in the library.")
    members.append(member)
    return {"message": f"Member '{member.name}' added successfully."}

@app.post("/books/borrow")
async def borrow_book(request: BorrowRequest, librarian: Librarian = Depends(get_current_librarian)):
    # Validate member existence
    member = next((m for m in members if m.id == request.member_id), None)
    if not member:
        raise HTTPException(status_code=400, detail="Member not found.")
    
    # Validate book existence
    book = next((b for b in books if b.title == request.book_title), None)
    if not book:
        raise HTTPException(status_code=400, detail="Book not found in the library.")
    
    # Check book availability
    if not book.availability:
        raise HTTPException(status_code=400, detail=f"The book '{request.book_title}' is already borrowed.")
    
    # Update availability and confirm borrowing
    book.availability = False
    return {"message": f"Book '{request.book_title}' was borrowed successfully by member '{member.name}'."}

@app.post("/books/return")
async def return_book(request: ReturnRequest, librarian: Librarian = Depends(get_current_librarian)):
    # Validate member existence
    member = next((m for m in members if m.id == request.member_id), None)
    if not member:
        raise HTTPException(status_code=400, detail="Member not found.")
    
    # Validate book existence
    book = next((b for b in books if b.title == request.book_title), None)
    if not book:
        raise HTTPException(status_code=400, detail="Book not found in the library.")
    
    # Check book availability
    if book.availability:
        raise HTTPException(status_code=400, detail="The book is already available.")
    
    # Updating availability and confirm returning
    book.availability = True
    return {"message": f"Book '{request.book_title}' was returned successfully by member '{member.name}'."}

@app.get("/books")
async def list_books(librarian: Librarian = Depends(get_current_librarian)):
    return books

@app.get("/members")
async def list_members(librarian: Librarian = Depends(get_current_librarian)):
    return members
