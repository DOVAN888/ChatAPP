import api from "@/lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/users/uploadAvatar", formData);
    return res.data;
  },
  updateProfile: async (data: { displayName?: string; bio?: string; phone?: string }) => {
    const res = await api.put("/users/me", data);
    return res.data;
  },
};
