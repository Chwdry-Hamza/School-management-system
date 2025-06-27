// app/library/page.tsx
'use client';
import React, { useState, useEffect } from 'react';

// Define interfaces for type safety
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface Book {
  book_id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'Available' | 'Borrowed';
}

interface BorrowRecord {
  borrow_id: string;
  book_id: string;
  student_id: string;
  borrow_date: string;
  return_date?: string;
}

interface NewBook {
  title: string;
  author: string;
  isbn: string;
}

export default function LibraryPage() {
  // Initialize state with proper types
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newBook, setNewBook] = useState<NewBook>({ title: '', author: '', isbn: '' });
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Available' | 'Borrowed'>('All');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load dummy data
  useEffect(() => {
    // Simulate API response for students
    const dummyStudents: Student[] = [
      { student_id: 'S001', first_name: 'John', last_name: 'Doe' },
      { student_id: 'S002', first_name: 'Jane', last_name: 'Smith' },
      { student_id: 'S003', first_name: 'Alice', last_name: 'Johnson' },
    ];
    setStudents(dummyStudents);

    // Simulate API response for books
    const dummyBooks: Book[] = [
      {
        book_id: 'B001',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        status: 'Available',
      },
      {
        book_id: 'B002',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0446310789',
        status: 'Borrowed',
      },
      {
        book_id: 'B003',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        status: 'Available',
      },
    ];
    setBooks(dummyBooks);

    // Simulate API response for borrow records
    const dummyBorrowRecords: BorrowRecord[] = [
      {
        borrow_id: 'BR001',
        book_id: 'B002',
        student_id: 'S001',
        borrow_date: '2025-06-10',
      },
    ];
    setBorrowRecords(dummyBorrowRecords);
  }, []);

  // Save book
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.isbn.trim()) {
      alert('All fields are required.');
      return;
    }
    try {
      if (editBook) {
        // Simulate updating book
        setBooks(
          books.map((book) =>
            book.book_id === editBook.book_id
              ? { ...newBook, book_id: editBook.book_id, status: editBook.status }
              : book,
          ),
        );
        setSuccessMessage('Book updated successfully!');
      } else {
        // Simulate creating book
        const newBookData: Book = {
          book_id: `B${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
          ...newBook,
          status: 'Available',
        };
        setBooks([...books, newBookData]);
        setSuccessMessage('Book added successfully!');
      }
      setShowForm(false);
      setEditBook(null);
      setNewBook({ title: '', author: '', isbn: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book.');
    }
  };

  // Delete book
  const handleDeleteBook = async (book_id: string) => {
    try {
      // Check if book is borrowed
      if (borrowRecords.some((record) => record.book_id === book_id && !record.return_date)) {
        alert('Cannot delete a borrowed book.');
        return;
      }
      setBooks(books.filter((book) => book.book_id !== book_id));
      setSuccessMessage('Book deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  // Borrow book
  const handleBorrowBook = async (book_id: string, student_id: string) => {
    if (!student_id) {
      alert('Please select a student.');
      return;
    }
    try {
      // Simulate creating borrow record
      const newBorrowRecord: BorrowRecord = {
        borrow_id: `BR${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
        book_id,
        student_id,
        borrow_date: new Date().toISOString().split('T')[0],
      };
      setBorrowRecords([...borrowRecords, newBorrowRecord]);
      setBooks(
        books.map((book) =>
          book.book_id === book_id ? { ...book, status: 'Borrowed' } : book,
        ),
      );
      setSuccessMessage('Book borrowed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow book.');
    }
  };

  // Return book
  const handleReturnBook = async (book_id: string) => {
    try {
      // Find the latest unreturned borrow record for the book
      const borrowRecord = borrowRecords.find(
        (record) => record.book_id === book_id && !record.return_date,
      );
      if (!borrowRecord) {
        alert('No active borrow record found.');
        return;
      }
      setBorrowRecords(
        borrowRecords.map((record) =>
          record.borrow_id === borrowRecord.borrow_id
            ? { ...record, return_date: new Date().toISOString().split('T')[0] }
            : record,
        ),
      );
      setBooks(
        books.map((book) =>
          book.book_id === book_id ? { ...book, status: 'Available' } : book,
        ),
      );
      setSuccessMessage('Book returned successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book.');
    }
  };

  const filteredBooks = books.filter(
    (book) => filterStatus === 'All' || book.status === filterStatus,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Library Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditBook(null);
            setNewBook({ title: '', author: '', isbn: '' });
          }}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add New Book'}
        </button>

        {/* Book Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editBook ? 'Edit Book' : 'Add Book'}
            </h2>
            <form onSubmit={handleSaveBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editBook ? 'Update Book' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Book List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Books</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as 'All' | 'Available' | 'Borrowed')
              }
              className="mt-1 w-40 p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.book_id}>
                    <td className="px-6 py-4 text-sm">{book.title}</td>
                    <td className="px-6 py-4 text-sm">{book.author}</td>
                    <td className="px-6 py-4 text-sm">{book.isbn}</td>
                    <td className="px-6 py-4 text-sm">{book.status}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setEditBook(book);
                          setNewBook({ title: book.title, author: book.author, isbn: book.isbn });
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.book_id)}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        Delete
                      </button>
                      {book.status === 'Available' ? (
                        <select
                          onChange={(e) => handleBorrowBook(book.book_id, e.target.value)}
                          className="p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Borrow to...</option>
                          {students.map((student) => (
                            <option key={student.student_id} value={student.student_id}>
                              {student.first_name} {student.last_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => handleReturnBook(book.book_id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}