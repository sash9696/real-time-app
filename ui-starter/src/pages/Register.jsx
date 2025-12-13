import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { registerUser, loginUser } from "../apis/auth";
import { toast } from "react-toastify";

//this pattern removes redundancy 
//u only fix at one place
//reusability
//easier to maintain as well

const defaultRegisterData = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

const defaultLoginData = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const [formData, setFormData] = useState(
    isRegister ? defaultRegisterData : defaultLoginData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    console.log({ email, password });
    const isValid = email.includes("@") && password.length > 6;
    if (!isValid) {
      toast.warning("provide valid credentials");
      setFormData({ ...formData, password: "" });
      return setIsLoading(false);
    }
    try {
      setIsLoading(true);
      const apiCall = isRegister ? registerUser : loginUser;
      const { data } = await apiCall(formData);
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        navigate("/chats");
        toast.success(`Successfully ${isRegister ? "Registered" : "Logged In"}`)
      } else {
        toast.error(`Invalid credentials`)
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-10 relative">
        <div className="absolute -top-7 left-0">
          <h3 className="text-[25px] font-bold tracking-wider text-[#fff]">
            {isRegister ? "Register" : "Login"}
          </h3>
          <p className="text-[#fff] text-[12px] tracking-wider font-medium">
            Have Account ?{" "}
            <Link
              className="underline"
              to={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Login" : "Sign up"}
            </Link>{" "}
          </p>
        </div>
        <form
          className="!mt-[12%] flex flex-col gap-y-3"
          onSubmit={handleSubmit}
        >
          {isRegister && (
            <div className="flex gap-x-2 w-[100%]">
              <input
                className="bg-[#222222] h-[50px] !pl-3 text-[#fff] w-[49%] sm:w-[47%]"
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                required
                onChange={handleChange}
              />
              <input
                className="bg-[#222222] h-[50px] !pl-3 text-[#fff] w-[49%] sm:w-[47%]"
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                required
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <input
              className="bg-[#222222] h-[50px] !pl-3 text-[#fff] w-[100%] sm:w-[96%]"
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <input
              className="bg-[#222222] h-[50px] !pl-3 text-[#fff] w-[100%] sm:w-[96%]"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              className="text-[#fff] absolute top-0 right-4 sm:right-6 w-[30px] h-[25px] pointer"
              type="button"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <BsEmojiExpressionless className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]" />
              ) : (
                <BsEmojiLaughing className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]" />
              )}
            </button>
          </div>

          <button
            style={{
              background:
                "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)",
            }}
            className="w-[100%]  sm:w-[96.3%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative"
            type="submit"
          >
            <div
              style={{ display: isLoading ? "" : "none" }}
              className="absolute -top-[53px] left-[29.5%] sm:-top-[53px] sm:left-[87px]"
            >
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                background="transparent"
                speed="1"
                style={{ width: "200px", height: "160px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
            <p className="text-[#fff]">{isRegister ? 'Register' : 'Login'}</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;

