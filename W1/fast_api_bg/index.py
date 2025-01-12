from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Book(BaseModel):
    title: str
    author: str
    availability: bool = True


class Member(BaseModel):
    name: str
    id: int

# Using List from "typing" to make sure that typed
books: List[Book] = []
members: List[Member] = []

# Adding a book
@app.post("/books/add")
async def add_book(book: Book):
    # If the book already exists:
    for existing_book in books:
        if existing_book.title == book.title:
            raise HTTPException(status_code=400, detail="The Book already exists in the library.")
    members.append(member)
    return {"message": f"Member '{member.name}' added successfully."}

# Borrowing a book
@app.post("/books/borrow")
async def borrow_book(book_title: str, member_id: int):
    # If the member already exists:
    member = next((m for m in members if m.id == member_id), None)
    if not member:
        raise HTTPException(status_code=400, detail="Member not found.")
    
    # Checking if the book is available to borrow
    book = next((b for b in books if b.title == book_title), None)
    if not book:
        raise HTTPException(status_code=400, detail="Book not found in the library.")
    if not book.availability:
        raise HTTPException(status_code=400, detail="The book is already borrowed by someone else.")

    # Borrowing a book
    book.availability = False
    return {"message": f"Book '{book_title}' was borrowed successfully by member '{member_name}'."}

@app.post("/books/return")
async def return_book(book_title: str, member_id: int):
    # If the member already exists:
    member = next((m for m in members if m.id == member_id), None)
    if not member:
        raise HTTPException(status_code=400, detail="The member does not exist.")
    
    # Checking if the book exists
    book = next((b for b in books if b.title == book.title), None)
    if not book:
        raise HTTPException(status_code=400, detail="The book is not in the library.")
    if book.availability:
        raise HTTPException(status_code=400, detail="The book is already available.")

    # To return a book
    book.availability = True
    return {"message": f"Book '{book_title}' was returned successfully by member '{member_name}'"}

# Listing all the books
@app.get("/books")
async def list_books():
    return books
