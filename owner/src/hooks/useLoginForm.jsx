import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import axiosInstance from "./useAxiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Enter your email")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email"
    ),
  password: yup
    .string()
    .required("Enter your password")
    .min(6, "Password must be at least 6 characters long"),
});

const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/owner/auth/login",
        data
      );

      const result = response.data;

      // save token in redux
      dispatch(login({ token: result.token, role: result.role }));

      // set token to axios header
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.token}`;

      toast.success(result.message || "Login successful!");

      // redirect based on role
      if (result.role === "owner") {
        navigate("/owner");
      } else if (result.role === "admin") {
        navigate("/admin");
      } else {
        toast.error("Invalid role received");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Invalid credentials");
      } else if (error.request) {
        toast.error("Server not responding. Try again.");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
  };
};

export default useLoginForm;
