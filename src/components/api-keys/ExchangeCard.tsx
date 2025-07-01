import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ConnectedExchange } from "./ConnectedExchange";
import { ConnectionForm } from "./ConnectionForm";

interface ExchangeData {
  name: string;
  logo: string;
  status: string;
  apiKey: string;
  permissions: string[];
  testnet: boolean;
}

interface ExchangeCardProps {
  exchange: ExchangeData;
  isEditing: boolean;
  showApiKey: boolean;
  onToggleVisibility: () => void;
  onEdit: () => void;
  onSave: (exchangeName: string, apiKey: string, secretKey: string) => void;
  onDisconnect: () => void;
  onCancel: () => void;
}

export function ExchangeCard({
  exchange,
  isEditing,
  showApiKey,
  onToggleVisibility,
  onEdit,
  onSave,
  onDisconnect,
  onCancel
}: ExchangeCardProps) {
  return (
    <Card className="relative">
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
          <ConnectedExchange
            exchangeName={exchange.name}
            apiKey={exchange.apiKey}
            permissions={exchange.permissions}
            showApiKey={showApiKey}
            onToggleVisibility={onToggleVisibility}
            onEdit={onEdit}
            onDisconnect={onDisconnect}
          />
        ) : (
          <ConnectionForm
            exchangeName={exchange.name}
            testnet={exchange.testnet}
            isEditing={isEditing}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}