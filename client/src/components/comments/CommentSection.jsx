import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

import {
  getComments,
  createComment,
  deleteComment,
} from "../../services/api";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load comments.");
    }
  };

  const handleAddComment = async () => {
    if (!content.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    try {
      setLoading(true);

      await createComment(postId, content);

      setContent("");

      toast.success("Comment added");

      fetchComments();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add comment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);

      toast.success("Comment deleted");

      fetchComments();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete comment."
      );
    }
  };

  return (
    <div className="mt-6 border-t pt-5">

      <h4 className="font-bold text-lg mb-5">
        💬 Comments ({comments.length})
      </h4>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                  <h5 className="font-semibold">
                    {comment.user.name}
                  </h5>

                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(
                      new Date(comment.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>

                </div>

              </div>

              {currentUser &&
                comment.user._id === currentUser.id && (
                  <button
                    onClick={() =>
                      handleDeleteComment(comment._id)
                    }
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    🗑 Delete
                  </button>
                )}

            </div>

            <p className="mt-3 text-gray-700 leading-6 whitespace-pre-wrap">
              {comment.content}
            </p>

          </div>
        ))
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">

          <div className="text-4xl mb-3">
            💬
          </div>

          <p className="text-gray-500">
            No comments yet.
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Start the conversation.
          </p>

        </div>
      )}

      <div className="mt-6">

        <textarea
          rows="3"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAddComment}
          disabled={loading}
          className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2 rounded-xl font-semibold transition"
        >
          {loading ? "Adding..." : "Add Comment"}
        </button>

      </div>

    </div>
  );
}

export default CommentSection;