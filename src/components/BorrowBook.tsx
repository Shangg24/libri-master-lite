import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, BookOpen, User, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

import { Book, BorrowRecord } from "@/types";

interface BorrowBookProps {
  books: Book[];
  borrowRecords: BorrowRecord[];
  onUpdateBorrowRecords: (records: BorrowRecord[]) => void;
  onUpdateBooks: (books: Book[]) => void;
}

const BorrowBook = ({ books, borrowRecords, onUpdateBorrowRecords, onUpdateBooks }: BorrowBookProps) => {
  const [selectedBookId, setSelectedBookId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const availableBooks = books.filter(book => book.status === "available");
  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrowBook = () => {
    if (!selectedBookId || !studentName || !studentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      bookId: selectedBookId,
      studentName,
      studentId,
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
    };

    // Update borrow records
    onUpdateBorrowRecords([...borrowRecords, newRecord]);

    // Update book status
    const updatedBooks = books.map(book =>
      book.id === selectedBookId ? { ...book, status: "borrowed" as const } : book
    );
    onUpdateBooks(updatedBooks);

    // Reset form
    setSelectedBookId("");
    setStudentName("");
    setStudentId("");
    setSearchTerm("");

    toast({
      title: "Success",
      description: `Book successfully borrowed to ${studentName}`,
    });
  };

  const selectedBook = books.find(book => book.id === selectedBookId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Borrow Book</h2>
        <p className="text-muted-foreground">Issue a book to a student</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrow Form */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Issue Book</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Student Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="student-name"
                  placeholder="Enter student name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID *</Label>
              <Input
                id="student-id"
                placeholder="Enter student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-search">Search Books</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="book-search"
                  placeholder="Search available books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-select">Select Book *</Label>
              <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book to borrow" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{book.title} - {book.author}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBook && (
              <Card className="p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Selected Book Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Title:</strong> {selectedBook.title}</p>
                  <p><strong>Author:</strong> {selectedBook.author}</p>
                  <p><strong>Category:</strong> {selectedBook.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button onClick={handleBorrowBook} className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Issue Book
            </Button>
          </div>
        </Card>

        {/* Available Books List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Available Books ({availableBooks.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No available books found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search</p>
                )}
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedBookId === book.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedBookId(book.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{book.title}</h4>
                      <p className="text-xs text-muted-foreground">by {book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          Available
                        </Badge>
                      </div>
                    </div>
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BorrowBook;