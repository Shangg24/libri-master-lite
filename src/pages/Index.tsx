import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import BookManagement from "@/components/BookManagement";
import BorrowBook from "@/components/BorrowBook";
import ReturnBook from "@/components/ReturnBook";
import { Book, BorrowRecord } from "@/types";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Literature",
      isbn: "978-0-7432-7356-5",
      publishedYear: 1925,
      status: "available",
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Literature",
      isbn: "978-0-06-112008-4",
      publishedYear: 1960,
      status: "borrowed",
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      category: "Fiction",
      isbn: "978-0-452-28423-4",
      publishedYear: 1949,
      status: "available",
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Literature",
      isbn: "978-0-14-143951-8",
      publishedYear: 1813,
      status: "available",
    },
    {
      id: "5",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      category: "Literature",
      isbn: "978-0-316-76948-0",
      publishedYear: 1951,
      status: "borrowed",
    },
  ]);
  
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([
    {
      id: "1",
      bookId: "2",
      studentName: "Alice Johnson",
      studentId: "STU001",
      borrowDate: "2024-01-15T10:00:00Z",
      dueDate: "2024-01-29T10:00:00Z",
    },
    {
      id: "2",
      bookId: "5",
      studentName: "Bob Smith",
      studentId: "STU002",
      borrowDate: "2024-01-10T14:30:00Z",
      dueDate: "2024-01-24T14:30:00Z",
    },
  ]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            onSectionChange={setActiveSection}
            books={books}
            borrowRecords={borrowRecords}
          />
        );
      case "books":
        return (
          <BookManagement
            books={books}
            onUpdateBooks={setBooks}
          />
        );
      case "borrow":
        return (
          <BorrowBook
            books={books}
            borrowRecords={borrowRecords}
            onUpdateBorrowRecords={setBorrowRecords}
            onUpdateBooks={setBooks}
          />
        );
      case "return":
        return (
          <ReturnBook
            books={books}
            borrowRecords={borrowRecords}
            onUpdateBorrowRecords={setBorrowRecords}
            onUpdateBooks={setBooks}
          />
        );
      case "students":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Student Management</h2>
            <p className="text-muted-foreground">Student management features coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <p className="text-muted-foreground">Detailed reports and analytics coming soon...</p>
          </div>
        );
      default:
        return (
          <Dashboard
            onSectionChange={setActiveSection}
            books={books}
            borrowRecords={borrowRecords}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;
