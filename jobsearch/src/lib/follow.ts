import { toast } from "sonner";
import { api } from "./axios";

const followUser = async (currentUserId: string, targetUserId: string) => {
  await api
    .post("/users/follow", {
      userId: currentUserId,
      sendReqId: targetUserId,
    })
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((err) => {
      console.error("Error sending follow request:", err);
    });
};

export { followUser };
