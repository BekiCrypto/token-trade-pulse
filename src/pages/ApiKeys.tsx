import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SecurityNotice } from "@/components/api-keys/SecurityNotice";
import { ExchangeCard } from "@/components/api-keys/ExchangeCard";
import { SetupInstructions } from "@/components/api-keys/SetupInstructions";

const exchanges = [
  {
    name: "Binance",
    logo: "🔶",
    status: "connected",
    apiKey: "BNBX...7K2P",
    permissions: ["Spot Trading", "Futures", "Read-only"],
    testnet: false
  },
  {
    name: "Bybit", 
    logo: "⚡",
    status: "disconnected",
    apiKey: "",
    permissions: [],
    testnet: true
  }
];

export default function ApiKeys() {
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState(exchanges);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleApiKeyVisibility = (exchange: string) => {
    setShowApiKey(prev => ({ ...prev, [exchange]: !prev[exchange] }));
  };

  const handleSaveKeys = (exchangeName: string, apiKey: string, secretKey: string) => {
    if (!apiKey || !secretKey) {
      toast({
        title: "Error",
        description: "Please enter both API Key and Secret Key",
        variant: "destructive"
      });
      return;
    }

    setApiKeys(prev => prev.map(exchange => 
      exchange.name === exchangeName 
        ? { 
            ...exchange, 
            status: "connected",
            apiKey: apiKey.substring(0, 4) + "..." + apiKey.slice(-4),
            permissions: ["Spot Trading", "Read-only"]
          }
        : exchange
    ));

    setIsEditing(null);
    
    toast({
      title: "Success",
      description: `${exchangeName} API keys saved successfully`,
    });
  };

  const handleDisconnect = (exchangeName: string) => {
    setApiKeys(prev => prev.map(exchange => 
      exchange.name === exchangeName 
        ? { ...exchange, status: "disconnected", apiKey: "", permissions: [] }
        : exchange
    ));
    
    toast({
      title: "Disconnected",
      description: `${exchangeName} has been disconnected`,
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Connect your exchange accounts to enable automated trading
        </p>
      </div>

      <SecurityNotice />

      {/* Exchange Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apiKeys.map((exchange) => (
          <ExchangeCard
            key={exchange.name}
            exchange={exchange}
            isEditing={isEditing === exchange.name}
            showApiKey={showApiKey[exchange.name] || false}
            onToggleVisibility={() => toggleApiKeyVisibility(exchange.name)}
            onEdit={() => setIsEditing(exchange.name)}
            onSave={handleSaveKeys}
            onDisconnect={() => handleDisconnect(exchange.name)}
            onCancel={handleCancel}
          />
        ))}
      </div>

      <SetupInstructions />
    </div>
  );
}