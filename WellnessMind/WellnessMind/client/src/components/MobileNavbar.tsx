
import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, Book, MessageSquare, Brain, 
  Phone, BarChart, Music, Trophy, Menu, X 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MobileNavbar = () => {
  const [location] = useLocation();
  const [open, setOpen] = React.useState(false);
  
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Brain, label: "Mindfulness", href: "/mindfulness" },
    { icon: BarChart, label: "Progress", href: "/progress" },
    { icon: Book, label: "Journal", href: "/journal" },
    { icon: MessageSquare, label: "Community", href: "/community" },
    { icon: Music, label: "Sounds", href: "/sounds" },
    { icon: Trophy, label: "Goals", href: "/goals" },
    { icon: Phone, label: "Support", href: "/support" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm z-50 px-4 py-2 border-b">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="font-semibold text-lg">MindfulAI</h1>
        </Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] p-0">
            <div className="flex flex-col p-4 h-full">
              <div className="flex items-center justify-between mb-6 pb-2 border-b">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
