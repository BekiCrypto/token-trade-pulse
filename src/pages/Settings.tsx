import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Mail,
  MessageSquare,
  DollarSign,
  Clock,
  Crown,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    telegramNotifications: false,
    tradeAlerts: true,
    profitAlerts: true,
    lossAlerts: true,
    dailySummary: true,
    
    // Trading
    autoStopLoss: 3,
    autoTakeProfit: 6,
    maxRiskPerTrade: 2,
    tradingHours: [7, 20], // 7 AM to 8 PM UTC
    
    // General
    timezone: "UTC",
    currency: "USD",
    theme: "dark",
    
    // Contact
    email: "user@example.com",
    telegramUsername: ""
  });

  const [currentPlan] = useState({
    name: "Pro",
    price: 50,
    status: "active",
    nextBilling: "2024-08-15",
    features: ["Advanced strategies", "2 exchange connections", "Priority support"]
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your trading preferences and notifications
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          Save Changes
        </Button>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Channels</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <Label>Push Notifications</Label>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <Label>Telegram Alerts</Label>
                </div>
                <Switch
                  checked={settings.telegramNotifications}
                  onCheckedChange={(checked) => updateSetting("telegramNotifications", checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Alert Types</h3>
              
              <div className="flex items-center justify-between">
                <Label>Trade Execution Alerts</Label>
                <Switch
                  checked={settings.tradeAlerts}
                  onCheckedChange={(checked) => updateSetting("tradeAlerts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Profit Alerts</Label>
                <Switch
                  checked={settings.profitAlerts}
                  onCheckedChange={(checked) => updateSetting("profitAlerts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Loss Alerts</Label>
                <Switch
                  checked={settings.lossAlerts}
                  onCheckedChange={(checked) => updateSetting("lossAlerts", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Daily Summary</Label>
                <Switch
                  checked={settings.dailySummary}
                  onCheckedChange={(checked) => updateSetting("dailySummary", checked)}
                />
              </div>
            </div>
          </div>
          
          {settings.telegramNotifications && (
            <div className="pt-4 border-t">
              <Label htmlFor="telegram">Telegram Username</Label>
              <Input
                id="telegram"
                placeholder="@yourusername"
                value={settings.telegramUsername}
                onChange={(e) => updateSetting("telegramUsername", e.target.value)}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Subscription */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                <Badge variant="default" className="text-xs">
                  {currentPlan.status}
                </Badge>
              </div>
              <p className="text-2xl font-bold">${currentPlan.price}/month</p>
              <p className="text-sm text-muted-foreground">
                Next billing: {currentPlan.nextBilling}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/subscription'}>
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Plan
            </Button>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Plan Features</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentPlan.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Trading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Auto Stop Loss: {settings.autoStopLoss}%
                </Label>
                <Slider
                  value={[settings.autoStopLoss]}
                  onValueChange={(value) => updateSetting("autoStopLoss", value[0])}
                  max={10}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Auto Take Profit: {settings.autoTakeProfit}%
                </Label>
                <Slider
                  value={[settings.autoTakeProfit]}
                  onValueChange={(value) => updateSetting("autoTakeProfit", value[0])}
                  max={20}
                  min={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Max Risk Per Trade: {settings.maxRiskPerTrade}%
                </Label>
                <Slider
                  value={[settings.maxRiskPerTrade]}
                  onValueChange={(value) => updateSetting("maxRiskPerTrade", value[0])}
                  max={5}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Trading Hours: {settings.tradingHours[0]}:00 - {settings.tradingHours[1]}:00 UTC
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.tradingHours[0]}
                    onChange={(e) => updateSetting("tradingHours", [parseInt(e.target.value), settings.tradingHours[1]])}
                    className="w-20"
                  />
                  <span className="self-center">to</span>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.tradingHours[1]}
                    onChange={(e) => updateSetting("tradingHours", [settings.tradingHours[0], parseInt(e.target.value)])}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                  <SelectItem value="CET">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency">Display Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="BTC">BTC (₿)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting("email", e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              Change Password
            </Button>
            <Button variant="outline" className="flex-1">
              Enable 2FA
            </Button>
            <Button variant="outline" className="flex-1">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}