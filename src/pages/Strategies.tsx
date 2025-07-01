import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  Bot, 
  Settings, 
  Play, 
  Pause,
  BarChart3,
  Zap,
  Target
} from "lucide-react";

const strategiesData = [
  {
    id: 1,
    name: "RSI Scalper",
    description: "Short-term scalping using RSI oversold/overbought signals",
    risk: "Medium",
    timeframe: "1m - 5m",
    winRate: "75.2%",
    avgProfit: "1.2%",
    active: true,
    profit24h: "+$247.50",
    trades24h: 18,
    icon: Zap
  },
  {
    id: 2,
    name: "Trend Rider",
    description: "Follow strong trends with EMA crossovers and momentum",
    risk: "Low",
    timeframe: "15m - 1h",
    winRate: "68.7%",
    avgProfit: "2.8%",
    active: true,
    profit24h: "+$456.80",
    trades24h: 12,
    icon: TrendingUp
  },
  {
    id: 3,
    name: "Grid Bot",
    description: "Range-bound trading with automated grid orders",
    risk: "Medium",
    timeframe: "5m - 30m",
    winRate: "73.1%",
    avgProfit: "0.8%",
    active: false,
    profit24h: "+$189.25",
    trades24h: 24,
    icon: BarChart3
  },
  {
    id: 4,
    name: "AI Breakout",
    description: "Machine learning powered breakout detection",
    risk: "High",
    timeframe: "1h - 4h",
    winRate: "82.4%",
    avgProfit: "4.2%",
    active: true,
    profit24h: "+$892.15",
    trades24h: 8,
    icon: Bot
  }
];

const riskSettings = {
  maxRiskPerTrade: [2],
  maxDailyLoss: [5],
  stopLoss: [3],
  takeProfit: [6]
};

export default function Strategies() {
  const [strategies, setStrategies] = useState(strategiesData);
  const [risk, setRisk] = useState(riskSettings);

  const toggleStrategy = (id: number) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, active: !strategy.active }
          : strategy
      )
    );
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-profit/10 text-profit";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "High":
        return "bg-loss/10 text-loss";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Strategies</h1>
          <p className="text-muted-foreground">
            Configure and monitor your AI-powered trading algorithms
          </p>
        </div>
      </div>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Max Risk Per Trade: {risk.maxRiskPerTrade[0]}%</label>
              <Slider
                value={risk.maxRiskPerTrade}
                onValueChange={(value) => setRisk(prev => ({ ...prev, maxRiskPerTrade: value }))}
                max={10}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Max Daily Loss: {risk.maxDailyLoss[0]}%</label>
              <Slider
                value={risk.maxDailyLoss}
                onValueChange={(value) => setRisk(prev => ({ ...prev, maxDailyLoss: value }))}
                max={20}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Stop Loss: {risk.stopLoss[0]}%</label>
              <Slider
                value={risk.stopLoss}
                onValueChange={(value) => setRisk(prev => ({ ...prev, stopLoss: value }))}
                max={10}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Take Profit: {risk.takeProfit[0]}%</label>
              <Slider
                value={risk.takeProfit}
                onValueChange={(value) => setRisk(prev => ({ ...prev, takeProfit: value }))}
                max={20}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => {
          const IconComponent = strategy.icon;
          return (
            <Card key={strategy.id} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={strategy.active}
                    onCheckedChange={() => toggleStrategy(strategy.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className={getRiskColor(strategy.risk)}>
                    {strategy.risk} Risk
                  </Badge>
                  <Badge variant="outline">
                    {strategy.timeframe}
                  </Badge>
                  <Badge variant="outline">
                    Win: {strategy.winRate}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">24h Profit</div>
                    <div className="font-semibold text-profit">{strategy.profit24h}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Trades</div>
                    <div className="font-semibold">{strategy.trades24h}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Profit</div>
                    <div className="font-semibold">{strategy.avgProfit}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Target className="w-4 h-4 mr-2" />
                    Backtest
                  </Button>
                </div>
              </CardContent>
              
              {/* Active indicator */}
              {strategy.active && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 bg-profit rounded-full animate-pulse-glow"></div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}