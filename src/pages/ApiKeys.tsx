import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  Link
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [formData, setFormData] = useState({ apiKey: "", secretKey: "" });
  const { toast } = useToast();

  const toggleApiKeyVisibility = (exchange: string) => {
    setShowApiKey(prev => ({ ...prev, [exchange]: !prev[exchange] }));
  };

  const handleSaveKeys = (exchangeName: string) => {
    if (!formData.apiKey || !formData.secretKey) {
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
            apiKey: formData.apiKey.substring(0, 4) + "..." + formData.apiKey.slice(-4),
            permissions: ["Spot Trading", "Read-only"]
          }
        : exchange
    ));

    setIsEditing(null);
    setFormData({ apiKey: "", secretKey: "" });
    
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Connect your exchange accounts to enable automated trading
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-l-4 border-l-warning bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-warning mb-1">Security Notice</h3>
              <p className="text-sm text-muted-foreground">
                Your API keys are encrypted and stored securely. Never share your secret keys. 
                We recommend using IP whitelist and enabling only necessary permissions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apiKeys.map((exchange) => (
          <Card key={exchange.name} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{exchange.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{exchange.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={exchange.status === "connected" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {exchange.status === "connected" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3 mr-1" /> Not Connected</>
                        )}
                      </Badge>
                      {exchange.testnet && (
                        <Badge variant="outline" className="text-xs">Testnet</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {exchange.status === "connected" && !isEditing ? (
                <>
                  {/* Connected State */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={showApiKey[exchange.name] ? exchange.apiKey : "••••••••••••••••"}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(exchange.name)}
                        >
                          {showApiKey[exchange.name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    {exchange.permissions.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Permissions</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exchange.permissions.map(permission => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(exchange.name)}
                      className="flex-1"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Update Keys
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnect(exchange.name)}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Connection/Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey" className="text-sm font-medium">API Key</Label>
                      <Input
                        id="apiKey"
                        placeholder="Enter your API key"
                        value={formData.apiKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="secretKey" className="text-sm font-medium">Secret Key</Label>
                      <Input
                        id="secretKey"
                        type="password"
                        placeholder="Enter your secret key"
                        value={formData.secretKey}
                        onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch id="testnet" defaultChecked={exchange.testnet} />
                      <Label htmlFor="testnet" className="text-sm">Use Testnet</Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleSaveKeys(exchange.name)}
                      className="flex-1"
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(null);
                          setFormData({ apiKey: "", secretKey: "" });
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Binance Setup</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Log into your Binance account</li>
                <li>Go to Account → API Management</li>
                <li>Create a new API key</li>
                <li>Enable "Enable Spot & Margin Trading"</li>
                <li>Set IP restrictions for security</li>
                <li>Copy API Key and Secret Key</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">Bybit Setup</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Log into your Bybit account</li>
                <li>Go to Account & Security → API</li>
                <li>Create a new API key</li>
                <li>Enable required permissions</li>
                <li>Add IP whitelist</li>
                <li>Copy API Key and Secret Key</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}