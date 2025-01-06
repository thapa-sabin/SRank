class Book:
    """Keeps track of borrowed books"""
    def __init__(self, title, author, availability=True):
        self.title = title
        self.author = author
        self.availability = availability

    def borrow(self):
        if self.availability:
            self.availability = False
            return f"{self.title} by {self.author} was borrowed successfully."
        else:
            return "Book unavailable."
    
    def return_book(self):
        self.availability = True
        return f"{self.title} by {self.author} was returned successfully."

class LibraryMember:
    """Identifies members based on their unique ID and books they have borrowed"""
    def __init__(self, name, uid):
       self.name = name
       self.uid = uid
       self.borrowed_books = [] # Keeping track of which books a member has borrowed
    
    def borrow_a_book(self, book, library):
        if book in self.borrowed_books:
            return f"You have already borrowed {book.title} by {book.author}. Please choose a different one."
        borrow_message = library.borrow_a_book(book)

        if "borrowed" in borrow_message:
            self.borrowed_books.append(book)
        return borrow_message
    
    def return_book(self, book, library):
        if book in self.borrowed_books:
            self.borrowed_books.remove(book)
            return library.return_book(book)
        else:
            return f"Someone else already has the book {book.title} by {book.title}."

class Library:
    def __init__(self):
        self.available_books = [] # Keeping track of books in the Library with a list
        self.member_list = [] # Keeping track of all members in the library

    def add_book(self, book):
        self.available_books.append(book)
    
    def add_member(self, member):
        self.member_list.append(member)
    
    def borrow_a_book(self, book):
        if book in self.available_books and book.availability:
            return book.borrow()
        else:
            return "Book unavailable."
        
    def return_book(self, book):
        book.return_book()
        return f"{book.title} by {book.author} has been returned to the library."

# Testing my updated code

# Adding some books (From Project Gutenberg) and members to the library
book1 = Book("Amelia", "Henry Fielding")
book2 = Book("Aesop's Fables - Volume 01", "Chesterton")
book3 = Book("Pride and Prejudice", "Jane Austen")
member1 = LibraryMember("Sabin Thapa", 123)
member2 = LibraryMember("Sushi Marasini", 456)

# Creating an instance of the class Library
library = Library()

# Adding sample books and members to the library
library.add_book(book1)
library.add_book(book2)
library.add_book(book3)
library.add_member(member1)
library.add_member(member2)

# Testing borrowing and returning features
print(member1.borrow_a_book(book1, library))  # Borrow book1
print(member1.borrow_a_book(book2, library))  # Borrow book2
print(member1.borrow_a_book(book1, library))  # Try borrowing the same book again

print(member1.return_book(book1, library))    # Return book1
print(member1.borrow_a_book(book1, library))  # Borrow book1 again after returning

print(member2.borrow_a_book(book3, library))  # Member2 borrows book3
print(member2.return_book(book3, library))    # Member2 returns book3
