import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupInstructions() {
  return (
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
  );
}