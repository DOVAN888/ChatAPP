import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequests = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        送信した友達申請はありません。
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <>
        {sentList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={
              <p className="text-muted-foreground text-sm">返信を待っています...</p>
            }
          />
        ))}
      </>
    </div>
  );
};

export default SentRequests;
