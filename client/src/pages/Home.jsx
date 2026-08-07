import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PostCard from "../components/post/PostCard";
import {
  getAllPosts,
  createPost,
  likePost,
  unlikePost,
} from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load posts.");
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something.");
      return;
    }

    try {
      setPublishing(true);

      await createPost(content);

      setContent("");

      toast.success("Post published successfully 🚀");

      fetchPosts();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to publish post."
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      fetchPosts();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">

          <h1
            onClick={() => navigate("/home")}
            className="text-2xl md:text-3xl font-bold text-blue-600 cursor-pointer"
          >
            DevConnect
          </h1>

          <div className="flex items-center gap-3 md:gap-5">

            <button
              onClick={() => navigate("/profile")}
              className="font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              👤 Profile
            </button>

            <div className="hidden md:block">
              <p className="font-medium text-gray-700">
                Hi, {currentUser?.name} 👋
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Feed */}
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Create Post */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">

          <h2 className="text-2xl font-bold">
            Create a Post
          </h2>

          <p className="text-gray-500 mt-1 mb-5">
            Share your latest project, coding journey or achievement 🚀
          </p>

          <textarea
            rows="4"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreatePost}
            disabled={publishing}
            className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {publishing ? "Publishing..." : "Publish Post"}
          </button>

        </div>

        {/* Feed Header */}
        <div className="mb-6">

          <h2 className="text-3xl font-bold">
            Latest Posts
          </h2>

          <p className="text-gray-500 mt-1">
            See what developers are sharing today.
          </p>

        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <div className="text-6xl mb-4">
              📭
            </div>

            <h3 className="text-2xl font-bold">
              No posts yet
            </h3>

            <p className="text-gray-500 mt-2">
              Be the first developer to share something on DevConnect.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default Home;