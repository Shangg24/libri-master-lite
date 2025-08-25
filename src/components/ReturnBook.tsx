import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Clock, CheckCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Book, BorrowRecord } from "@/types";

interface ReturnBookProps {
  books: Book[];
  borrowRecords: BorrowRecord[];
  onUpdateBorrowRecords: (records: BorrowRecord[]) => void;
  onUpdateBooks: (books: Book[]) => void;
}

const ReturnBook = ({ books, borrowRecords, onUpdateBorrowRecords, onUpdateBooks }: ReturnBookProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const activeBorrowings = borrowRecords.filter(record => !record.returnDate);
  
  const filteredBorrowings = activeBorrowings.filter(record => {
    const book = books.find(b => b.id === record.bookId);
    return (
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleReturnBook = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const returnDate = new Date().toISOString();
    
    // Update borrow record with return date
    const updatedRecords = borrowRecords.map(r =>
      r.id === recordId ? { ...r, returnDate } : r
    );
    onUpdateBorrowRecords(updatedRecords);

    // Update book status to available
    const updatedBooks = books.map(book =>
      book.id === record.bookId ? { ...book, status: "available" as const } : book
    );
    onUpdateBooks(updatedBooks);

    const book = books.find(b => b.id === record.bookId);
    toast({
      title: "Success",
      description: `"${book?.title}" has been returned successfully`,
    });
  };

  const calculateDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateLateFee = (daysOverdue: number) => {
    return daysOverdue * 0.50; // $0.50 per day
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Return Book</h2>
        <p className="text-muted-foreground">Process book returns and manage late fees</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by student name, ID, book title, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Active Borrowings */}
      <div className="space-y-4">
        {filteredBorrowings.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeBorrowings.length === 0 ? "No Active Borrowings" : "No Results Found"}
            </h3>
            <p className="text-muted-foreground">
              {activeBorrowings.length === 0 
                ? "All books have been returned or no books are currently borrowed"
                : "Try adjusting your search criteria"
              }
            </p>
          </Card>
        ) : (
          filteredBorrowings.map((record) => {
            const book = books.find(b => b.id === record.bookId);
            const daysOverdue = calculateDaysOverdue(record.dueDate);
            const lateFee = calculateLateFee(daysOverdue);
            const isOverdue = daysOverdue > 0;

            return (
              <Card key={record.id} className={`p-6 ${isOverdue ? "border-destructive/50 bg-destructive/5" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-20 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{book?.title || "Unknown Book"}</h3>
                        <p className="text-muted-foreground">by {book?.author || "Unknown Author"}</p>
                        <Badge variant="outline" className="mt-1">
                          {book?.category || "Unknown"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{record.studentName}</p>
                            <p className="text-muted-foreground">ID: {record.studentId}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Borrowed</p>
                            <p className="text-muted-foreground">
                              {new Date(record.borrowDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className={`font-medium ${isOverdue ? "text-destructive" : ""}`}>
                              Due Date
                            </p>
                            <p className={`text-muted-foreground ${isOverdue ? "text-destructive" : ""}`}>
                              {new Date(record.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isOverdue && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-destructive">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                              Overdue by {daysOverdue} day{daysOverdue !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-sm text-destructive/80 mt-1">
                            Late fee: ${lateFee.toFixed(2)} (${0.50}/day)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Badge variant={isOverdue ? "destructive" : "default"}>
                      {isOverdue ? "Overdue" : "Active"}
                    </Badge>
                    <Button
                      onClick={() => handleReturnBook(record.id)}
                      className="bg-gradient-to-r from-success to-accent text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Return Book
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{activeBorrowings.length}</div>
          <div className="text-sm text-muted-foreground">Active Borrowings</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {activeBorrowings.filter(r => calculateDaysOverdue(r.dueDate) > 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Overdue Books</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">
            ${activeBorrowings
              .reduce((total, r) => total + calculateLateFee(calculateDaysOverdue(r.dueDate)), 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">Total Late Fees</div>
        </Card>
      </div>
    </div>
  );
};

export default ReturnBook;