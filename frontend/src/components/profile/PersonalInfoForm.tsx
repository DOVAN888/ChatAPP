import { Heart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

type Props = {
  userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
  const { updateProfile } = useUserStore();
  const [displayName, setDisplayName] = useState(userInfo?.displayName ?? "");
  const [phone, setPhone] = useState(userInfo?.phone ?? "");
  const [bio, setBio] = useState(userInfo?.bio ?? "");
  const [loading, setLoading] = useState(false);

  if (!userInfo) return null;

  const handleSubmit = async () => {
    setLoading(true);
    await updateProfile({ displayName, bio, phone });
    setLoading(false);
  };

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-5 text-primary" />
          プロフィール情報
        </CardTitle>
        <CardDescription>
          プロフィールの詳細情報を更新してください
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="glass-light border-border/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              value={userInfo.username}
              disabled
              className="glass-light border-border/30 opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              disabled
              className="glass-light border-border/30 opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="glass-light border-border/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">自己紹介</Label>
          <Textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="glass-light border-border/30 resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {loading ? "更新中..." : "プロフィールを更新"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
