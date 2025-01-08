class Book {
    title: string;
    author: string;
    availability: boolean;

    constructor(title: string, author: string, availability: boolean = true) {
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    borrow(): string {
        if (this.availability) {
            this.availability = false;
            return `Borrowed ${this.title} by ${this.author}.`;
        } else {
            return "Book unavailable.";
        }
    }

    returnBook(): string {
        this.availability = true;
        return `${this.title} by ${this.author} returned successfully.`;
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
    books: { [key: string]: { author: string, availability: boolean } };
    members: { [key: number]: { name: string, borrowedBooks: string[] } };

    constructor() {
        this.books = {};
        this.members = {};
    }

    addBook(title: string, author: string): void {
        if (!this.books[title]) {
            this.books[title] = { author, availability: true };
        } else {
            console.log(`The book '${title}' already exists in the library.`);
        }
    }

    addMember(name: string, ID: number): void {
        if (!this.members[ID]) {
            this.members[ID] = { name, borrowedBooks: [] };
        } else {
            console.log(`Member ID ${ID} already exists.`);
        }
    }

    borrowBook(memberID: number, requestedBook: Book): string {
        if (!this.members[memberID]) {
            return "Invalid member ID.";
        }
        if (!this.books[requestedBook.title]) {
            return "Book not found in the library.";
        }

        const book = this.books[requestedBook.title];
        const member = this.members[memberID];

        if (!book.availability) {
            return `The book '${requestedBook.title}' is currently unavailable.`;
        }

        book.availability = false;
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

        if (member.borrowedBooks.indexOf(returnedBook.title) === -1) {
            return `${member.name} has not borrowed '${returnedBook.title}'.`;
        }

        book.availability = true;
        const index = member.borrowedBooks.indexOf(returnedBook.title);
        member.borrowedBooks.splice(index, 1);
        return `${member.name} returned '${returnedBook.title}'.`;
    }

    listBooks(): string {
        return Object.keys(this.books).map(title => {
            const book = this.books[title];
            return `${title} by ${book.author} - ${book.availability ? 'Available' : 'Borrowed'}`;
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
