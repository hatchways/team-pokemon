import axios from "axios";

// Update Profile
export const createRequest = async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post("/api/request/", payload, config);
  } catch (err) {
    console.log(err.message);
  }
};
