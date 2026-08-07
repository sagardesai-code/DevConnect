import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful 🎉");

      setTimeout(() => {
        navigate("/home");
      }, 800);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-blue-600">
            DevConnect
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back 👋
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-5">

            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;