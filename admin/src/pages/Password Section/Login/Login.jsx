import React, { useEffect } from "react";
import "./Login.css";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import hoc from "../../../assets//hoc.jpg";

let schema = Yup.object().shape({
  email: Yup.string()
      .email("Email Should Be Valid")
      .required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });
  const authState = useSelector((state) => state);
  const { user, isLoading, isError, isSuccess, message } = authState.auth;

  useEffect(() => {
    if (isSuccess) {
      navigate("admin");
    } else {
      navigate("");
    }
  }, [navigate, user, isError, isSuccess, isLoading]);

  return (
      <div className="adminlogin-div-1">
        <div className="adminlogin-div-2">
          {/* Add your logo here */}
          <img src={hoc} alt="Logo" className="logo" />
          <h3 className="adminlogin-h3">Login</h3>
          <p className="adminlogin-p">Login to your account to continue.</p>
          <div className="error" style={{ textAlign: "center" }}>
            {message.message === "Rejected" ? "You are not an Admin" : ""}
          </div>
          <form action="" onSubmit={formik.handleSubmit}>
            <CustomInput
                type="text"
                name="email"
                label="Email Address"
                id="email"
                val={formik.values.email}
                onChng={formik.handleChange("email")}
            />
            <div className="error">{formik.touched.email && formik.errors.email}</div>
            <CustomInput
                type="password"
                name="password"
                label="Password"
                id="pass"
                val={formik.values.password}
                onChng={formik.handleChange("password")}
            />
            <div className="error">{formik.touched.password && formik.errors.password}</div>
            <button className="adminlogin-button-1" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
