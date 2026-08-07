import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../services/api";

function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    github: "",
    linkedin: "",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      setUser(response.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile.");
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await updateProfile(user);

      setUser(response.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Header Card */}

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

          <div className="w-32 h-32 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white text-5xl font-bold shadow-md">

            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}

          </div>

          <h1 className="text-3xl font-bold mt-5">
            {user.name || "Your Name"}
          </h1>

          <p className="text-gray-500 mt-2">
            {user.email}
          </p>

          <p className="mt-4 text-gray-600 italic">
            {user.bio
              ? user.bio
              : "No bio added yet."}
          </p>

          <div className="flex justify-center gap-6 mt-6">

            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                🐙 GitHub
              </a>
            )}

            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                💼 LinkedIn
              </a>
            )}

          </div>

        </div>

        {/* Edit Profile */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

          <h2 className="text-2xl font-bold mb-6">
            Edit Profile
          </h2>

          <div className="space-y-5">

            <div>

              <label className="block font-semibold mb-2">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold mb-2">
                Bio
              </label>

              <textarea
                rows="4"
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold mb-2">
                GitHub
              </label>

              <input
                type="text"
                name="github"
                value={user.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div>

              <label className="block font-semibold mb-2">
                LinkedIn
              </label>

              <input
                type="text"
                name="linkedin"
                value={user.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div className="flex gap-4 pt-4">

              <button
                onClick={() => navigate("/home")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Back
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserProfile;