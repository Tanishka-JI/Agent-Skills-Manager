"use client";

import { useState } from "react";
import { toggleLike } from "../../action/likes";

interface LikeButtonProps {
  skillId: number;
  likeCount: number;
  isLiked: boolean;
}

export default function LikeButton({
  skillId,
  likeCount,
  isLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    
try {
  const result = await toggleLike(skillId);

  if (!result.success) {
    alert(result.message);
    return;
  }

  setLiked(!liked);
  setCount(result.likeCount ?? count);

} finally {
  setIsPending(false);
}
  }

  return (
  <button
    onClick={handleClick}
    disabled={isPending}
    className={`btn btn-sm gap-2 rounded-full px-4 flex items-center justify-center ${
      liked
        ? "btn-error"
        : "btn-outline btn-ghost"
    }`}
  >
    <span className="flex items-center justify-center gap-2 leading-none">
  <span className="text-2xl leading-none">
    {liked ? "❤️" : "🤍"}
  </span>
  <span className="text-xs leading-none">{count}</span>
</span>
  </button>
);
}