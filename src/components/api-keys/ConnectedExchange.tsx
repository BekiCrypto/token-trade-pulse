import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff } from "lucide-react";

interface ConnectedExchangeProps {
  exchangeName: string;
  apiKey: string;
  permissions: string[];
  showApiKey: boolean;
  onToggleVisibility: () => void;
  onEdit: () => void;
  onDisconnect: () => void;
}

export function ConnectedExchange({
  exchangeName,
  apiKey,
  permissions,
  showApiKey,
  onToggleVisibility,
  onEdit,
  onDisconnect
}: ConnectedExchangeProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">API Key</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            value={showApiKey ? apiKey : "••••••••••••••••"}
            readOnly
            className="font-mono text-sm"
          />
          <Button variant="outline" size="sm" onClick={onToggleVisibility}>
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {permissions.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Permissions</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {permissions.map(permission => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Key className="w-4 h-4 mr-2" />
          Update Keys
        </Button>
        <Button variant="destructive" size="sm" onClick={onDisconnect} className="flex-1">
          Disconnect
        </Button>
      </div>
    </div>
  );
}