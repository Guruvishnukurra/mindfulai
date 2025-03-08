import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Book, MessageSquare, Brain, Phone, BarChart, Music, Gamepad as GamepadIcon, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile"; // Fixed import path

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/journal", icon: Book, label: "Journal" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/meditation", icon: Brain, label: "Meditation" },
  { path: "/analytics", icon: BarChart, label: "Analytics" },
  { path: "/soundscape", icon: Music, label: "Soundscape" },
  { path: "/games", icon: GamepadIcon, label: "Games" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/emergency", icon: Phone, label: "Emergency" }
];

const MobileNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul>
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <Link href={path} className="block py-2 px-4 hover:bg-gray-700">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};


export const Navbar = () => {
  const isMobile = useIsMobile();
  const [location] = useLocation();

  if (isMobile) {
    return <MobileNavbar />;
  }

  const isActive = (path: string) => location === path;
  
  return (
    <nav className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              href={path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive(path) ? "text-primary font-medium" : "text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-0 left-0 w-full h-20 glass-card border-t border-white/20 md:top-0 md:h-screen md:w-72 md:border-r md:border-t-0"
    >
      <div className="h-full flex flex-row md:flex-col items-center justify-around md:justify-start md:gap-3 md:p-8">
        {navItems.map(({ path, icon: Icon, label }, index) => (
          <Link key={path} href={path}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Button
                variant={isActive(path) ? "default" : "ghost"}
                className={`w-full justify-start gap-3 transition-all duration-300 ${
                  isActive(path) 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'hover:bg-white/10 text-purple-200/90'
                }`}
              >
                <Icon size={24} className={`transition-transform duration-300 ${isActive(path) ? 'scale-110' : ''}`} />
                <span className="hidden md:inline font-medium">{label}</span>
              </Button>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}