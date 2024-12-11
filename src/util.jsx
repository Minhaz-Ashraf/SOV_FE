import axios from "axios";
import { getToken } from "./utils/getToken";

const apiurl = axios.create({
  baseURL: import.meta.env.VITE_APP_DEV_BASE_URL,
});

apiurl.interceptors.request.use(
  (config) => {
    const tokenId = getToken();
    // console.log(tokenId);
    if (tokenId) {
      config.headers.Authorization = `Bearer${tokenId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiurl;



// import axios from "axios";

// const apiurl = axios.create({
//   baseURL: "http://localhost:8080/api/",

// });

// export default apiurl;





// if (role === "2") {
//   if (socketServiceInstance.isConnected()) {
//     //from agent to admin
//     const notificationData = {
//       title: " AGENT_SUBMITTED_OFFER_LETTER",
//       message: `${agentData?.companyDetails?.businessName} ${
//         agentData?.agId
//       } has submitted the offer letter application of ${
//         offerLater.preferences.institution
//       } ${offerLater.preferences.country} for the student ${
//         studentData?.studentInformation?.personalInformation?.firstName +
//         " " +
//         studentData?.studentInformation?.personalInformation?.lastName
//       } ${studentId}
// `,
//       agentId: agentData?._id,
//       agId: agentData?.agId,
//       path: "/admin/applications-review",
//       agentName: agentData?.companyDetails?.businessName,
//       studentId: studentId,
//       stId: "",
//       studentName:
//         studentData?.studentInformation?.personalInformation?.firstName +
//         " " +
//         studentData?.studentInformation?.personalInformation?.lastName,
//       countryName: offerLater.preferences.country,
//       collegeName: offerLater.preferences.institution,
//       pathData: studentData?.studentInformation?._id,
   
//       recieverId: agentData?._id,
//     };

//     socketServiceInstance.socket.emit(
//       "NOTIFICATION_AGENT_TO_ADMIN",
//       notificationData
//     );
//   } else {
//     console.error("Socket connection failed, cannot emit notification.");
//   }
// }
// if (role === "3") {
//   if (socketServiceInstance.isConnected()) {
//     //from student to admin
//     const notificationData = {
//       title: " STUDENT_SUBMITTED_OFFER_LETTER",
//       message: `${
//         studentInfoData?.data?.studentInformation?.personalInformation
//           ?.firstName +
//           " " +
//           studentInfoData?.data?.studentInformation?.personalInformation
//             ?.lastName || ""
//       } ${
//         studentInfoData?.data?.studentInformation?.stId || ""
//       } has submitted the offer letter application.`,
//       pathData: studentInfoData?.data?.studentInformation?._id,
//       recieverId: "",
//     };

//     socketServiceInstance.socket.emit(
//       "NOTIFICATION_STUDENT_TO_ADMIN",
//       notificationData
//     );
//   } else {
//     console.error("Socket connection failed, cannot emit notification.");
//   }
// }