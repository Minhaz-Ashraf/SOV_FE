import apiurl from "../util";

export const getConnectionDetails = async () => {
    try {
      const response = await apiurl.get("/socket/get-connection-details");
      console.log(response.data, "hdgvcjhdsvchjdsvcjh")
      return response.data?.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error while submitting the form"
        );
      } else if (error.request) {
        throw new Error("No response from server. Please try again later.");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
};
export const getAdminConnectionDetails = async () => {
    try {
      const response = await apiurl.get("/socket/get-admin-connection-details");
      console.log(response.data, "hdgvcjhdsvchjdsvcjh")
      return response.data?.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error while submitting the form"
        );
      } else if (error.request) {
        throw new Error("No response from server. Please try again later.");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
};