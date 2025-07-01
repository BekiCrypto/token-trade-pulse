import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Users, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Mock data for demonstration
const mockStats = {
  totalBalance: "$24,750.84",
  totalProfit: "+$3,248.92",
  winRate: "72.4%",
  activeTrades: "5",
  profitChange: "+12.4%",
  winRateChange: "+2.1%",
  activeTradesChange: "-1"
};

const mockTrades = [
  {
    id: 1,
    pair: "BTC/USDT",
    type: "LONG",
    entry: "$43,250",
    current: "$44,180",
    pnl: "+$930.00",
    pnlPercent: "+2.15%",
    status: "active"
  },
  {
    id: 2,
    pair: "ETH/USDT", 
    type: "SHORT",
    entry: "$2,650",
    current: "$2,615",
    pnl: "+$175.00",
    pnlPercent: "+1.32%",
    status: "active"
  },
  {
    id: 3,
    pair: "SOL/USDT",
    type: "LONG", 
    entry: "$98.50",
    current: "$101.20",
    pnl: "+$135.00",
    pnlPercent: "+2.74%",
    status: "active"
  }
];

const mockStrategies = [
  {
    name: "RSI Scalper",
    status: "active",
    trades: 12,
    profit: "+$1,247.50",
    winRate: "75%"
  },
  {
    name: "Trend Rider",
    status: "active", 
    trades: 8,
    profit: "+$890.32",
    winRate: "68%"
  },
  {
    name: "Grid Bot",
    status: "paused",
    trades: 15,
    profit: "+$1,111.10", 
    winRate: "73%"
  }
];

export default function Dashboard() {
  const [isTrading, setIsTrading] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your automated crypto trading performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isTrading ? "destructive" : "default"}
            size="lg"
            onClick={() => setIsTrading(!isTrading)}
            className="gap-2"
          >
            {isTrading ? (
              <>
                <Pause className="w-4 h-4" />
                Stop Trading
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Trading
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <Card className={`border-l-4 ${isTrading ? 'border-l-profit bg-profit/5' : 'border-l-warning bg-warning/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {isTrading ? (
              <CheckCircle className="w-5 h-5 text-profit" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning" />
            )}
            <div>
              <p className="font-medium">
                {isTrading ? "AutoTrader Active" : "AutoTrader Paused"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isTrading ? "All strategies running normally" : "Trading has been temporarily stopped"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={mockStats.totalBalance}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
        />
        <StatCard
          title="Total Profit"
          value={mockStats.totalProfit}
          change={mockStats.profitChange}
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-profit" />}
        />
        <StatCard
          title="Win Rate"
          value={mockStats.winRate}
          change={mockStats.winRateChange}
          changeType="positive"
          icon={<Activity className="w-5 h-5 text-info" />}
        />
        <StatCard
          title="Active Trades"
          value={mockStats.activeTrades}
          change={mockStats.activeTradesChange}
          changeType="negative"
          icon={<Users className="w-5 h-5 text-accent" />}
        />
      </div>

      {/* Active Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Active Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{trade.pair}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant={trade.type === "LONG" ? "default" : "secondary"} className="text-xs">
                        {trade.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-profit">{trade.pnl}</div>
                  <div className="text-sm text-muted-foreground">{trade.pnlPercent}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Strategy Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStrategies.map((strategy, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {strategy.trades} trades • Win rate: {strategy.winRate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium text-profit">{strategy.profit}</div>
                  </div>
                  <Badge variant={strategy.status === "active" ? "default" : "secondary"}>
                    {strategy.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}