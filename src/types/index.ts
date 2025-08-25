export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publishedYear: number;
  status: "available" | "borrowed";
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  studentName: string;
  studentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
}