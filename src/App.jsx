import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCountryOption,
  getCourses,
  getPrefCountryOption,
} from "./features/generalSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "./routes/Route";
import { agentInformation } from "./features/agentSlice";
import { studentInfo } from "./features/studentSlice";
import { getAdminConnectionDetails, getConnectionDetails } from "./features/getConnectionDetails";
import socketServiceInstance from "./services/socket";
import { adminProfileData } from "./features/adminSlice";

function App() {
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("student")
  const dispatch = useDispatch();
  const { prefCountryOption, courses, countryOption } = useSelector(
    (state) => state.general
  );

  useEffect(() => {
    let socket;
  
    const initializeSocketConnection = async () => {
      try {
        let data;
  
        if (role === "0") {
          data = await getAdminConnectionDetails();
        } else {
          data = await getConnectionDetails();
        }
  
        await socketServiceInstance.connectToSocket("http://localhost:8080", data);
      } catch (error) {
        console.error("Error initializing socket connection:", error);
      }
    };
  
    initializeSocketConnection();
  
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [role, socketServiceInstance]);
  

  useEffect(() => {
    if (!countryOption || countryOption.length === 0) {
      dispatch(getCountryOption());
    }
    if (!prefCountryOption || prefCountryOption.length === 0) {
      dispatch(getPrefCountryOption());
    }
    if ((!courses || courses.length === 0) && (role === "2" || role === "3")) {
      dispatch(getCourses());
    }
    
    if (role === "2") {
      dispatch(agentInformation());
    }
    if (role==="3"){
      dispatch(studentInfo(studentId))
    }
    if(role === "0"){
      dispatch(adminProfileData())
    }

    // Interval to check every 3 seconds
    const intervalId = setInterval(() => {
      if (countryOption.length === 0) {
        dispatch(getCountryOption());
      }
      if (prefCountryOption.length === 0) {
        dispatch(getPrefCountryOption());
      }
      if ((courses.length === 0) && (role === "2" || role === "3" || role === "0")) {
        dispatch(getCourses());
      }
      
    }, 3000);

    return () => clearInterval(intervalId);
  }, [dispatch, countryOption, prefCountryOption, courses]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
      <div className="overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
