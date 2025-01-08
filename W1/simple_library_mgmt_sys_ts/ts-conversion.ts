// Using enums to track availability status of a book
enum BookStatus {
    Available = "Available",
    Borrowed = "Borrowed"
}

// Using interface for book and member details
interface BookDetails {
    title: string;
    author: string;
    status: BookStatus;
}

interface MemberDetails {
    name: string;
    borrowedBooks: string[];
}

class Book {
    title: string;
    author: string;
    status: BookStatus;

    constructor(title: string, author: string) {
        this.title = title;
        this.author = author;
        this.status = BookStatus.Available; // Making this the default option
    }

    borrow(): string{
        if (this.status === BookStatus.Available) {
            this.status = BookStatus.Borrowed;
            return `Borrowed ${this.title} by ${this.author}.`;
        } else {
            return "Book is unavailable.";
        }
    }

    returnBook(): string{
        this.status = BookStatus.Available;
        return `Book {this.title} by {this.author} was successfully returned.`
    }
}

class LibraryMember {
    name: string;
    ID: number;
    borrowedBooks: string[];

    constructor(name: string, ID: number) {
        this.name = name;
        this.ID = ID;
        this.borrowedBooks = [];
    }

    borrowBook(book: Book, library: Library): string {
        return library.borrowBook(this.ID, book);
    }

    returnBook(book: Book, library: Library): string {
        return library.returnBook(this.ID, book);
    }
}

class Library {
    books: { [key: string]: BookDetails };
    members: { [key: number]: MemberDetails };

    constructor() {
        this.books = {};
        this.members = {};
    }

    addBook(title: string, author: string): void {
        if (!this.books[title]) {
            this.books[title] = { title, author, status: BookStatus.Available};
        } else {
            console.log(`The book '${title}' is already in the library.`);
        }
    }

    addMember(name: string, ID: number): void {
        if (!this.members[ID]) {
            this.members[ID] = {name, borrowedBooks: []};
        } else {
            console.log(`Member ID ${ID} already exists.`);
        }
    }
    
    borrowBook(memberID: number, requestedBook: Book): string {
        if (!this.members[memberID]) {
            return "Member ID is invalid.";
        }
        if (!this.books[requestedBook.title]) {
            return "Could not find the book in the library.";
        }

        const book = this.books[requestedBook.title];
        const member = this.members[memberID];

        if (book.status === BookStatus.Borrowed) {
            return `The book ${requestedBook.title} is currently unavailable`;
        }

        book.status = BookStatus.Borrowed;
        member.borrowedBooks.push(requestedBook.title);
        return `${member.name} borrowed '${requestedBook.title}'.`;
    }

    returnBook(memberID: number, returnedBook: Book): string {
        if (!this.members[memberID]) {
            return "Invalid member ID.";
        }
        if (!this.books[returnedBook.title]) {
            return "Book not found in the library.";
        }

        const book = this.books[returnedBook.title];
        const member = this.members[memberID];

        const bookIndex = member.borrowedBooks.indexOf(returnedBook.title);
        if (bookIndex === -1) {
            return `${member.name} has not borrwed '${returnedBook.title}'`
        }

        book.status = BookStatus.Available;
        member.borrowedBooks.splice(bookIndex, 1);
        return `${member.name} has returned '{returnedBook.title}'.`
    }

    listBooks(): string {
        return Object.keys(this.books).map(title => {
            const book = this.books[title];
            return `${title} by ${book.author} - ${book.status}`;
        }).join('\n');
    }

    listMemberBooks(memberID: number): string {
        if (!this.members[memberID]) {
            return "Invalid member ID.";
        }

        const member = this.members[memberID];
        const borrowed = member.borrowedBooks;
        return `${member.name} has borrowed: ${borrowed.length > 0 ? borrowed.join(', ') : 'No books.'}`;
    }
}

// Testing the TypeScript Code
let library = new Library();

// Adding books
library.addBook("Amelia — Complete", "Henry Fielding");
library.addBook("Aesop's Fables - Volume 01", "Chesterton");
library.addBook("Pride and Prejudice", "Jane Austen");

// Adding members
let member1 = new LibraryMember("Sabin Thapa", 123);
let member2 = new LibraryMember("Sushi Marasini", 456);

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
console.log(library.listMemberBooks(123));  // List books borrowed by Sabin
console.log(library.listMemberBooks(456));  // List books borrowed by Sushi