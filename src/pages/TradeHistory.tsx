import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const mockTrades = [
  {
    id: "TXN001",
    timestamp: "2024-01-15 14:30:25",
    pair: "BTC/USDT",
    type: "LONG",
    strategy: "RSI Scalper",
    entry: 43250.50,
    exit: 44180.30,
    quantity: 0.1,
    pnl: 930.00,
    pnlPercent: 2.15,
    fee: 12.50,
    duration: "00:45:12"
  },
  {
    id: "TXN002", 
    timestamp: "2024-01-15 13:15:18",
    pair: "ETH/USDT",
    type: "SHORT",
    strategy: "Trend Rider", 
    entry: 2650.75,
    exit: 2615.20,
    quantity: 2.5,
    pnl: 175.00,
    pnlPercent: 1.32,
    fee: 8.75,
    duration: "01:12:45"
  },
  {
    id: "TXN003",
    timestamp: "2024-01-15 12:05:33",
    pair: "SOL/USDT", 
    type: "LONG",
    strategy: "AI Breakout",
    entry: 98.50,
    exit: 101.20,
    quantity: 25.0,
    pnl: 135.00,
    pnlPercent: 2.74,
    fee: 6.25,
    duration: "02:35:18"
  },
  {
    id: "TXN004",
    timestamp: "2024-01-15 10:22:41",
    pair: "ADA/USDT",
    type: "LONG", 
    strategy: "Grid Bot",
    entry: 0.485,
    exit: 0.467,
    quantity: 1000.0,
    pnl: -18.00,
    pnlPercent: -3.71,
    fee: 2.15,
    duration: "00:28:15"
  },
  {
    id: "TXN005",
    timestamp: "2024-01-15 09:45:12", 
    pair: "MATIC/USDT",
    type: "SHORT",
    strategy: "RSI Scalper",
    entry: 0.925,
    exit: 0.897,
    quantity: 500.0,
    pnl: 14.00,
    pnlPercent: 3.03,
    fee: 1.85,
    duration: "00:15:32"
  }
];

export default function TradeHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredTrades = mockTrades.filter(trade => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "profitable") return matchesSearch && trade.pnl > 0;
    if (selectedFilter === "losses") return matchesSearch && trade.pnl < 0;
    
    return matchesSearch;
  });

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const profitableTrades = filteredTrades.filter(trade => trade.pnl > 0).length;
  const totalTrades = filteredTrades.length;
  const winRate = totalTrades > 0 ? ((profitableTrades / totalTrades) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trade History</h1>
          <p className="text-muted-foreground">
            Review your automated trading performance and transactions
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{totalTrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-profit/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-profit" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{winRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by pair, strategy, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "profitable" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("profitable")}
              >
                Profitable
              </Button>
              <Button
                variant={selectedFilter === "losses" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("losses")}
              >
                Losses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrades.map((trade) => (
              <div key={trade.id} className="p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  {/* Trade Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {trade.type === "LONG" ? (
                          <TrendingUp className="w-4 h-4 text-profit" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-loss" />
                        )}
                        <Badge variant={trade.type === "LONG" ? "default" : "secondary"} className="text-xs">
                          {trade.type}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{trade.pair}</div>
                        <div className="text-sm text-muted-foreground">{trade.strategy}</div>
                      </div>
                    </div>
                  </div>

                  {/* Entry/Exit */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Entry → Exit</div>
                    <div className="font-medium">${trade.entry.toLocaleString()} → ${trade.exit.toLocaleString()}</div>
                  </div>

                  {/* Quantity */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium">{trade.quantity}</div>
                  </div>

                  {/* P&L */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">P&L</div>
                    <div className={`font-medium ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </div>
                    <div className={`text-sm ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ({trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{trade.duration}</div>
                    <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}