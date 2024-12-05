import apiurl from "../util";

export const loginUser = async (email, password, role) => {
  try {
    const response = await apiurl.post("/auth/login", {
      email,
      password,
      role,
    });
    localStorage.setItem("userAuthToken", response?.data?.data?.accessToken);
    localStorage.setItem("student", response?.data?.data?.user?._id);

    return response.data;
  } catch (error) {
    console.error("Error while logging in:", error);
    throw error.response?.data?.message || error.message || "Login failed";
  }
};

export const resetPassword = async (role, email, otp) => {
  try {
    const response = await apiurl.post("/auth/verify-otp", {
      email: email,
      type:role,
      otp:otp
    });
    return response.data;
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

export const getOtpToResetPassword = async (role, email) => {
  try {
    const response = await apiurl.post("/auth/password-reset-otp", {
      type: role,
      email: email,
      
    });
    return response.data;
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

export const changePassowrd = async (role, email, otp, newPassword) => {
  try {
    const response = await apiurl.post("/auth/reset-password", {
        newPassword: newPassword,
        type: role,
        email: email,
        otp: otp,
    });
    return response.data;
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




//agent Signup
export const newAgentReg = async (agentRegister) => {
  try {
    const response = await apiurl.post("/auth/sent-agentOtp", agentRegister);
    return response.data;
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


export const resendStudentOtp = async (email) => {
  try {
    const response = await apiurl.post(
      "/auth/resend-otp-student",
      {
        email:email,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Something went wrong"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const resendAgentOtp = async (email) => {
  try {
    const response = await apiurl.post(
      "/auth/resend-otp-agent",
      {
        email:email,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Something went wrong"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};



export const verifyAgentEmail = async(email, otp, password) =>{
  console.log(password)
  try{
  const res = apiurl.post('/auth/verify-agent',{
   email: email,
   otp: otp,
   password: password,
   type: "2",
 
  })
  return res
  }catch(error){
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
 }


 //student Signup 
 export const newStudentReg = async (studentRegister) => {
  try {
    const response = await apiurl.post(
      "/auth/sent-studentOtp",
      studentRegister
    );

    return response.data;
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