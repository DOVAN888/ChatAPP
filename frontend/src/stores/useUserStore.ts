import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>(() => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({ ...user, avatarUrl: data.avatarUrl });
        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Lỗi khi updateAvatarUrl", error);
      toast.error("アバターのアップロードに失敗しました");
    }
  },
  updateProfile: async (data) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const result = await userService.updateProfile(data);

      if (user) {
        setUser({ ...user, ...result.user });
      }
      toast.success("プロフィールを更新しました");
    } catch (error) {
      console.error("Lỗi khi updateProfile", error);
      toast.error("プロフィールの更新に失敗しました");
    }
  },
}));
