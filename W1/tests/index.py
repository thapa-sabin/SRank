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
