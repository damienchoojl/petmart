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
    // Prevent form from being submitted to the server
    evt.preventDefault();

    try {
      // We don't want to send the 'error' or 'confirm' property,
      // so let's make a copy of the state object, then delete them
      const cleanedFormData = { ...formData };
      delete cleanedFormData.error;
      delete cleanedFormData.confirm;

      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await signUp(cleanedFormData);
      setUser(user);
      navigate("/mainpage"); // Navigate to /mainpage after successful sign up
    } catch {
      // An error occurred
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
