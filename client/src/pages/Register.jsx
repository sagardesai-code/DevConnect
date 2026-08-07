import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        name,
        email,
        password,
      });

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed"
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
            Create your account 🚀
          </p>

        </div>

        <form onSubmit={handleRegister}>

          <div className="mb-5">

            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;