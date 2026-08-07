import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "../comments/CommentSection";

function PostCard({ post, onLike }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6 mb-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            {post.user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {post.user.name}
            </h3>

            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

        </div>

      </div>

      {/* Post Content */}
      <p className="mt-5 text-gray-700 leading-7 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Divider */}
      <div className="border-t my-5"></div>

      {/* Action Buttons */}
      <div className="flex items-center gap-8">

        <button
          onClick={() => onLike(post._id, post.isLiked)}
          className={`flex items-center gap-2 font-semibold transition ${
            post.isLiked
              ? "text-red-500 hover:text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          <span className="text-lg">
            {post.isLiked ? "❤️" : "🤍"}
          </span>

          <span>
            Like ({post.likeCount})
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="font-semibold text-gray-600 hover:text-green-600 transition"
        >
          {showComments
            ? `Hide Comments (${post.commentCount})`
            : `Comments (${post.commentCount})`}
        </button>

      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection postId={post._id} />
      )}

    </div>
  );
}

export default PostCard;