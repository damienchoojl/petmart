// Import all named exports attached to a usersAPI object
// This syntax can be helpful documenting where the methods come from
import * as usersAPI from "./users-api";
import sendRequest from "./send-request";
const BASE_URL = "/api/users";

export async function signUp(userData) {
  try {
    const response = await usersAPI.signUp(userData);
    const { token, user } = response;
    localStorage.setItem("token", token);
    console.log("Token stored in localStorage:", token);
    return user;
  } catch (error) {
    console.log("Sign-up error:", error);
    throw new Error("Sign Up Failed - Try Again");
  }
}

export async function login(credentials) {
  const token = await sendRequest(`${BASE_URL}/login`, "POST", credentials);
  const user = getToken() ? getToken().user : null;
  return { token, user };
}

export function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Clear user data from localStorage
}

export function getToken() {
  // getItem returns null if there's no string
  const token = localStorage.getItem("token");
  console.log("Parsed Token:", token); // Add this line

  if (!token) return null;

  try {
    // Obtain the payload of the token
    const payload = JSON.parse(atob(token.split(".")[1]));
    // A JWT's exp is expressed in seconds, not milliseconds, so convert
    if (payload.exp < Date.now() / 1000) {
      // Token has expired - remove it from localStorage
      localStorage.removeItem("token");
      return null;
    }
    return token;
  } catch (error) {
    // If there's an error in parsing or decoding the token, remove it from localStorage
    localStorage.removeItem("token");
    return null;
  }
}

export function getUser() {
  const token = getToken();

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        return null;
      }
      return payload.user; // Changed this line to return payload.user instead of token.user
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  }

  return null;
}

export function checkToken() {
  // Just so that you don't forget how to use .then
  return (
    usersAPI
      .checkToken()
      // checkToken returns a string, but let's
      // make it a Date object for more flexibility
      .then((dateStr) => new Date(dateStr))
  );
}
