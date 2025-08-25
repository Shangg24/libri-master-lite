import StatCard from "./StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, AlertTriangle, Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/library-hero.jpg";

interface DashboardProps {
  onSectionChange: (section: string) => void;
  books: any[];
  borrowRecords: any[];
}

const Dashboard = ({ onSectionChange, books, borrowRecords }: DashboardProps) => {
  const totalBooks = books.length;
  const borrowedBooks = borrowRecords.filter(record => !record.returnDate).length;
  const availableBooks = totalBooks - borrowedBooks;
  const overdueBooks = borrowRecords.filter(record => 
    !record.returnDate && new Date(record.dueDate) < new Date()
  ).length;

  const recentBorrowings = borrowRecords
    .filter(record => !record.returnDate)
    .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-primary to-accent"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(34, 197, 94, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-between p-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Library Management System</h1>
            <p className="text-white/90 text-lg">Welcome back! Manage your library efficiently.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onSectionChange('borrow')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Borrow Book
            </Button>
            <Button 
              size="lg"
              onClick={() => onSectionChange('return')}
              className="bg-white text-primary hover:bg-white/90"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Return Book
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={BookOpen}
          variant="default"
          description="In collection"
        />
        <StatCard
          title="Available Books"
          value={availableBooks}
          icon={BookOpen}
          variant="success"
          description="Ready to borrow"
        />
        <StatCard
          title="Borrowed Books"
          value={borrowedBooks}
          icon={Users}
          variant="warning"
          description="Currently out"
        />
        <StatCard
          title="Overdue Books"
          value={overdueBooks}
          icon={AlertTriangle}
          variant="destructive"
          description="Need attention"
        />
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Recent Borrowings</h3>
          <Button variant="outline" onClick={() => onSectionChange('reports')}>
            View All Reports
          </Button>
        </div>
        <div className="space-y-4">
          {recentBorrowings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent borrowings</p>
          ) : (
            recentBorrowings.map((record) => {
              const book = books.find(b => b.id === record.bookId);
              const isOverdue = new Date(record.dueDate) < new Date();
              return (
                <div key={record.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-primary/10 rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{book?.title || 'Unknown Book'}</h4>
                      <p className="text-sm text-muted-foreground">Borrowed by {record.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isOverdue ? "destructive" : "secondary"}>
                      {isOverdue ? "Overdue" : "Active"}
                    </Badge>
                    {isOverdue && <Clock className="w-4 h-4 text-destructive" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;