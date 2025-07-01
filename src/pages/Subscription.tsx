import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Crown, 
  Check, 
  Gift, 
  Users, 
  DollarSign,
  Copy,
  Share,
  TrendingUp,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 25,
    features: [
      "Basic trading strategies",
      "1 exchange connection", 
      "Email support",
      "Basic portfolio tracking"
    ],
    maxStrategies: 1,
    maxExchanges: 1,
    popular: false
  },
  {
    id: "pro", 
    name: "Pro",
    price: 50,
    features: [
      "Advanced strategies",
      "2 exchange connections",
      "Priority support", 
      "Risk management tools",
      "Advanced analytics",
      "Custom indicators"
    ],
    maxStrategies: 3,
    maxExchanges: 2,
    popular: true
  },
  {
    id: "elite",
    name: "Elite", 
    price: 100,
    features: [
      "All strategies",
      "Unlimited exchanges",
      "24/7 support",
      "Custom indicators",
      "Revenue sharing",
      "Advanced AI features",
      "Priority execution",
      "Custom integrations"
    ],
    maxStrategies: 999,
    maxExchanges: 999,
    popular: false
  }
];

const cryptoPaymentOptions = [
  { name: "Bitcoin", symbol: "BTC", icon: "₿" },
  { name: "Ethereum", symbol: "ETH", icon: "Ξ" },
  { name: "USDT", symbol: "USDT", icon: "₮" },
  { name: "USDC", symbol: "USDC", icon: "$" }
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [referralCode, setReferralCode] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalCommissions: 0,
    levelBreakdown: []
  });
  const { toast } = useToast();

  useEffect(() => {
    generateReferralCode();
    loadReferralStats();
  }, []);

  const generateReferralCode = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_referral_code');
      if (error) throw error;
      setUserReferralCode(data);
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const loadReferralStats = async () => {
    // Mock data for now - would load from Supabase
    setReferralStats({
      totalReferrals: 12,
      totalCommissions: 485.50,
      levelBreakdown: [
        { level: 1, count: 5, commission: 125.00 },
        { level: 2, count: 4, commission: 84.50 },
        { level: 3, count: 3, commission: 67.50 },
      ]
    });
  };

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    // This would integrate with NOWPayments or similar crypto gateway
    toast({
      title: "Payment Gateway",
      description: "Redirecting to crypto payment gateway...",
    });
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://tekwealth.app/ref/${userReferralCode}`);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join TekWealth Crypto AutoTrader',
        text: 'Start earning passive income with AI-powered crypto trading!',
        url: `https://tekwealth.app/ref/${userReferralCode}`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Unlock advanced trading features and start earning with our referral program
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-300 hover:shadow-lg ${
              plan.popular ? 'border-primary shadow-glow' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-profit text-primary-foreground px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="mb-3">
                {plan.name === "Elite" && <Crown className="w-8 h-8 mx-auto text-accent" />}
                {plan.name === "Pro" && <TrendingUp className="w-8 h-8 mx-auto text-primary" />}
                {plan.name === "Basic" && <Star className="w-8 h-8 mx-auto text-secondary-foreground" />}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${plan.popular ? 'bg-gradient-profit hover:opacity-90' : ''}`}
                variant={plan.popular ? "default" : "outline"}
              >
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Crypto Payment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cryptoPaymentOptions.map((crypto) => (
              <Button
                key={crypto.symbol}
                variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className="flex items-center gap-2 h-16"
              >
                <span className="text-2xl">{crypto.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{crypto.symbol}</div>
                  <div className="text-xs text-muted-foreground">{crypto.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Referral Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Referral Link</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={`https://tekwealth.app/ref/${userReferralCode}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="sm" onClick={copyReferralCode}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={shareReferral}>
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-crypto rounded-lg p-4">
              <h3 className="font-medium mb-2">Earn up to 20% Commission!</h3>
              <p className="text-sm text-muted-foreground">
                Invite friends and earn commissions on their subscriptions. 
                10-level deep referral system with decreasing commission rates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Referral Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-crypto rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {referralStats.totalReferrals}
                </div>
                <div className="text-sm text-muted-foreground">Total Referrals</div>
              </div>
              <div className="bg-gradient-crypto rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  ${referralStats.totalCommissions}
                </div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Level Breakdown</Label>
              <div className="space-y-2 mt-2">
                {referralStats.levelBreakdown.map((level, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>Level {level.level}</span>
                    <div className="flex gap-4">
                      <span>{level.count} users</span>
                      <span className="font-medium">${level.commission}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Use Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle>Have a Referral Code?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              onClick={() => {
                toast({
                  title: "Code Applied",
                  description: "Referral code has been applied to your account",
                });
              }}
            >
              Apply Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Sharing Info */}
      <Card className="border-l-4 border-l-accent bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-medium text-accent mb-1">Revenue Sharing Program</h3>
              <p className="text-sm text-muted-foreground">
                Elite members participate in our revenue sharing program. 25% of trading profits 
                are distributed back to the community through a 10-level token-based system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}