import { jwtDecode } from "jwt-decode";

export const startTokenHeartbeat = () => {

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Consider the token expired if decoding fails
    }
  };

  const checkTokenStatus = () => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || isTokenExpired(token)) {
      handleExpiredToken();
    }
  };

  const handleExpiredToken = () => {
    // Clear localStorage and redirect
    localStorage.removeItem("role");
    localStorage.removeItem("student");
    localStorage.removeItem("form");
    localStorage.removeItem("userAuthToken");
    window.open("/login");
  };

  // Start the interval
  const intervalId = setInterval(checkTokenStatus, 5 * 60 * 1000); // Check every 5 minutes

  // Return a function to stop the heartbeat
  return () => clearInterval(intervalId);
};
