// Using enums to track availability status of a book
var BookStatus;
(function (BookStatus) {
    BookStatus["Available"] = "Available";
    BookStatus["Borrowed"] = "Borrowed";
})(BookStatus || (BookStatus = {}));
var Book = /** @class */ (function () {
    function Book(title, author) {
        this.title = title;
        this.author = author;
        this.status = BookStatus.Available; // Making this the default option
    }
    Book.prototype.borrow = function () {
        if (this.status === BookStatus.Available) {
            this.status = BookStatus.Borrowed;
            return "Borrowed ".concat(this.title, " by ").concat(this.author, ".");
        }
        else {
            return "Book is unavailable.";
        }
    };
    Book.prototype.returnBook = function () {
        this.status = BookStatus.Available;
        return "Book {this.title} by {this.author} was successfully returned.";
    };
    return Book;
}());
var LibraryMember = /** @class */ (function () {
    function LibraryMember(name, ID) {
        this.name = name;
        this.ID = ID;
        this.borrowedBooks = [];
    }
    LibraryMember.prototype.borrowBook = function (book, library) {
        return library.borrowBook(this.ID, book);
    };
    LibraryMember.prototype.returnBook = function (book, library) {
        return library.returnBook(this.ID, book);
    };
    return LibraryMember;
}());
var Library = /** @class */ (function () {
    function Library() {
        this.books = {};
        this.members = {};
    }
    Library.prototype.addBook = function (title, author) {
        if (!this.books[title]) {
            this.books[title] = { title: title, author: author, status: BookStatus.Available };
        }
        else {
            console.log("The book '".concat(title, "' is already in the library."));
        }
    };
    Library.prototype.addMember = function (name, ID) {
        if (!this.members[ID]) {
            this.members[ID] = { name: name, borrowedBooks: [] };
        }
        else {
            console.log("Member ID ".concat(ID, " already exists."));
        }
    };
    Library.prototype.borrowBook = function (memberID, requestedBook) {
        if (!this.members[memberID]) {
            return "Member ID is invalid.";
        }
        if (!this.books[requestedBook.title]) {
            return "Could not find the book in the library.";
        }
        var book = this.books[requestedBook.title];
        var member = this.members[memberID];
        if (book.status === BookStatus.Borrowed) {
            return "The book ".concat(requestedBook.title, " is currently unavailable");
        }
        book.status = BookStatus.Borrowed;
        member.borrowedBooks.push(requestedBook.title);
        return "".concat(member.name, " borrowed '").concat(requestedBook.title, "'.");
    };
    Library.prototype.returnBook = function (memberID, returnedBook) {
        if (!this.members[memberID]) {
            return "Invalid member ID.";
        }
        if (!this.books[returnedBook.title]) {
            return "Book not found in the library.";
        }
        var book = this.books[returnedBook.title];
        var member = this.members[memberID];
        var bookIndex = member.borrowedBooks.indexOf(returnedBook.title);
        if (bookIndex === -1) {
            return "".concat(member.name, " has not borrwed '").concat(returnedBook.title, "'");
        }
        book.status = BookStatus.Available;
        member.borrowedBooks.splice(bookIndex, 1);
        return "".concat(member.name, " has returned '{returnedBook.title}'.");
    };
    Library.prototype.listBooks = function () {
        var _this = this;
        return Object.keys(this.books).map(function (title) {
            var book = _this.books[title];
            return "".concat(title, " by ").concat(book.author, " - ").concat(book.status);
        }).join('\n');
    };
    Library.prototype.listMemberBooks = function (memberID) {
        if (!this.members[memberID]) {
            return "Invalid member ID.";
        }
        var member = this.members[memberID];
        var borrowed = member.borrowedBooks;
        return "".concat(member.name, " has borrowed: ").concat(borrowed.length > 0 ? borrowed.join(', ') : 'No books.');
    };
    return Library;
}());
// Testing the TypeScript Code
var library = new Library();
// Adding books
library.addBook("Amelia — Complete", "Henry Fielding");
library.addBook("Aesop's Fables - Volume 01", "Chesterton");
library.addBook("Pride and Prejudice", "Jane Austen");
// Adding members
var member1 = new LibraryMember("Sabin Thapa", 123);
var member2 = new LibraryMember("Sushi Marasini", 456);
// Adding members to library
library.addMember("Sabin Thapa", 123);
library.addMember("Sushi Marasini", 456);
// Borrowing books
console.log(library.borrowBook(123, new Book("Amelia — Complete", "Henry Fielding"))); // Sabin borrows "Amelia"
console.log(library.borrowBook(123, new Book("Pride and Prejudice", "Jane Austen"))); // Sabin borrows "Pride"
console.log(library.borrowBook(456, new Book("Amelia — Complete", "Henry Fielding"))); // Sushi tries to borrow an unavailable book
// Listing books
console.log("\nLibrary Books:");
console.log(library.listBooks());
// Returning a book
console.log(library.returnBook(123, new Book("Amelia — Complete", "Henry Fielding"))); // Sabin returns "Amelia"
// Listing member books
console.log("\nMember Books:");
console.log(library.listMemberBooks(123)); // List books borrowed by Sabin
console.log(library.listMemberBooks(456)); // List books borrowed by Sushi
