import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Home, Plus, RotateCcw, FileText, Users } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "books", label: "Manage Books", icon: BookOpen },
    { id: "borrow", label: "Borrow Book", icon: Plus },
    { id: "return", label: "Return Book", icon: RotateCcw },
    { id: "students", label: "Students", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <Card className="h-screen w-64 rounded-none border-0 border-r bg-gradient-to-b from-primary/5 to-secondary/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Library</h2>
            <p className="text-sm text-muted-foreground">Management</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11 text-left",
                  activeSection === item.id && "shadow-lg bg-primary text-primary-foreground"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </Card>
  );
};

export default Sidebar;