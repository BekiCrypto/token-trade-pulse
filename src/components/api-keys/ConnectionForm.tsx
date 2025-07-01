import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "lucide-react";

interface ConnectionFormProps {
  exchangeName: string;
  testnet: boolean;
  isEditing: boolean;
  onSave: (exchangeName: string, apiKey: string, secretKey: string) => void;
  onCancel: () => void;
}

export function ConnectionForm({ 
  exchangeName, 
  testnet, 
  isEditing, 
  onSave, 
  onCancel 
}: ConnectionFormProps) {
  const [formData, setFormData] = useState({ apiKey: "", secretKey: "" });

  const handleSubmit = () => {
    onSave(exchangeName, formData.apiKey, formData.secretKey);
    setFormData({ apiKey: "", secretKey: "" });
  };

  return (
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
        <Switch id="testnet" defaultChecked={testnet} />
        <Label htmlFor="testnet" className="text-sm">Use Testnet</Label>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSubmit} className="flex-1">
          <Link className="w-4 h-4 mr-2" />
          Connect
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}