import { useState } from "react";
import * as usersService from "../../utilities/users-service";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginForm.css";

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError("");
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const response = await usersService.login(credentials);
      console.log("Login response:", response);
      if (response.token) {
        localStorage.setItem("token", response.token);
        const user = await usersService.getUser();
        setUser(user);
        navigate("/mainpage");
      } else {
        setError("Log In Failed - Try Again");
      }
    } catch {
      setError("Log In Failed - Try Again");
    }
  }

  return (
    <div>
      <div className="form-container">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">LOG IN</button>
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
      <p className="sign-up-message">
        New to Pet Mart?{" "}
        <Link to="/signup" className="sign-up-link">
          Sign up now.
        </Link>
      </p>
    </div>
  );
}
