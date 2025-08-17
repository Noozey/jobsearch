import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bell,
  Settings,
  Home as HomeIcon,
  User,
  Users,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-primary">JobSearch</h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 text-sm">
          <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <HomeIcon width={16} height={16} />
            <a href="/home">Home</a>
          </li>
          <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <Users size={16} />
            <a href="/friends">Firends</a>
          </li>
          <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <User size={16} />
            Profile
          </li>
        </ul>

        {/* Mobile Menu Button */}
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell size={16} />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings size={16} />
        </Button>
        <ThemeToggle />
      </div>

      {/* Mobile Right Side - Only Theme Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={16} />
        </Button>
        <ThemeToggle />
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border md:hidden">
          <div className="p-4">
            <ul className="flex flex-col gap-4 text-sm mb-4">
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <HomeIcon width={16} height={16} />
                <a href="/home">Home</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <Users size={16} />
                <a href="/friends">Firends</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <User size={16} />
                Profile
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export { NavBar };
