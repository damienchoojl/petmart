import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../utilities/users-service";

export default function SignUpForm({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    error: "",
  });

  const handleChange = (evt) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [evt.target.name]: evt.target.value,
      error: "",
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const cleanedFormData = { ...formData };
      delete cleanedFormData.error;
      delete cleanedFormData.confirm;

      console.log("Sending sign-up request with data:", cleanedFormData);

      const user = await signUp(cleanedFormData);

      console.log("Sign-up response:", user);

      if (user) {
        setUser(user);
        navigate("/mainpage");
      } else {
        console.log("No user object returned from signup.");
        setFormData((prevFormData) => ({
          ...prevFormData,
          error: "Sign Up Failed - Try Again",
        }));
      }
    } catch (error) {
      console.log("Sign-up error:", error);

      setFormData((prevFormData) => ({
        ...prevFormData,
        error: "Sign Up Failed - Try Again",
      }));
    }
  };

  const disable = formData.password !== formData.confirm;

  return (
    <div>
      <div className="form-container">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Confirm</label>
          <input
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={disable}>
            SIGN UP
          </button>
        </form>
      </div>
      <p className="error-message">&nbsp;{formData.error}</p>
    </div>
  );
}
