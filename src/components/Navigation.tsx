import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Settings, 
  History, 
  TrendingUp, 
  Key, 
  Crown,
  Menu, 
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: BarChart3,
    description: "Overview & Portfolio"
  },
  { 
    title: "Strategies", 
    url: "/strategies", 
    icon: TrendingUp,
    description: "AI Trading Strategies"
  },
  { 
    title: "Trade History", 
    url: "/history", 
    icon: History,
    description: "Transaction Log"
  },
  { 
    title: "API Keys", 
    url: "/api-keys", 
    icon: Key,
    description: "Exchange Setup"
  },
  { 
    title: "Subscription", 
    url: "/subscription", 
    icon: Crown,
    description: "Plans & Referrals"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings,
    description: "App Configuration"
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <h1 className="text-xl font-bold">TekWealth</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col z-40">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TekWealth</h1>
              <p className="text-sm text-muted-foreground">Crypto AutoTrader</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 rounded-lg">
            <div className="w-2 h-2 bg-profit rounded-full animate-pulse-glow"></div>
            <div className="text-sm">
              <div className="font-medium">Status: Active</div>
              <div className="text-xs text-muted-foreground">All systems operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col h-full pt-20 px-4">
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="w-6 h-6" />
                  <div>
                    <div className="font-medium text-lg">{item.title}</div>
                    <div className="text-sm opacity-70">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}