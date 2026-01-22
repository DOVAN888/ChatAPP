import { Shield, Bell, ShieldBan } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PrivacySettings = () => (
  <Card className="glass-strong border-border/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        プライバシーとセキュリティ
      </CardTitle>
      <CardDescription>
        アカウントのプライバシー設定とセキュリティオプションを管理します
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start glass-light border-border/30 hover:text-warning"
        >
          <Shield className="h-4 w-4 mr-2" />
          パスワードを変更
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start glass-light border-border/30 hover:text-info"
        >
          <Bell className="h-4 w-4 mr-2" />
          通知設定
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start glass-light border-border/30 hover:text-destructive"
        >
          <ShieldBan className="size-4 mr-2" />
          ブロックリストの管理
        </Button>
      </div>

      <div className="pt-4 border-t border-border/30">
        <h4 className="font-medium mb-3 text-destructive">Khu vực nguy hiểm</h4>
        <Button
          variant="destructive"
          className="w-full"
        >
          アカウントを削除
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default PrivacySettings;
