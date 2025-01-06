class Book:
    # I think using triple quotes would be better here.
    """Keeps track of borrowed books"""
    def __init__(self, title, author, availability=True):
        self.title = title
        self.author = author
        self.availability = availability

    def borrow(self):
        if self.availability:
            self.availability = False
            return f"Borrowed {self.title} by {self.author}."
        else:
            return "Book unavailable."
    
    def return_book(self):
        self.availability = True
        return f"{self.title} by {self.author} returned successfully."

class LibraryMember:
    """Identifies members based on the ID and book they have borrrowed."""
    def __init__(self, name, ID):
        self.name = name
        self.ID = ID
    
    def borrow_a_book(self, book, library):
        return library.borrow_a_book(book)
    
    def return_book(self, book, library):
        return library.return_book(book)

class Library:
    def __init__(self):
        self.books_here = [] # Keeping track of books in the library
        self.members_here = [] # Record of all Library members
    
    def add_book(self, book):
        self.books_here.append(book)
    
    def add_member(self, member):
        self.members_here.append(member)

    def borrow_a_book(self, book):
        if book in self.books_here and book.availability:
            return book.borrow()
        else:
            return "Book not available."
    
    def return_book(self, book):
        book.return_book()
        return f"{book.title} by {book.author} has been returned to the library."
