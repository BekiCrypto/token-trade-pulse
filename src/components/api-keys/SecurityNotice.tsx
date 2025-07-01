import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function SecurityNotice() {
  return (
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
  );
}