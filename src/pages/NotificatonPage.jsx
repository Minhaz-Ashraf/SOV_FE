// import React, { useEffect, useState } from "react";
// import Header from "../components/dashboardComp/Header";
// import { FaStar } from "react-icons/fa";
// import AgentSidebar from "../components/dashboardComp/AgentSidebar";
// import Sidebar from "../components/dashboardComp/Sidebar";
// import socketServiceInstance from "../services/socket";
// import AdminSidebar from "../components/dashboardComp/AdminSidebar";
// import { RxCross2 } from "react-icons/rx";

// const NotificationPage = () => {
//   const role = localStorage.getItem("role");
//   const [userNotifications, setUserNotifications] = useState([]);
//   const [adminNotifications, setAdminNotifications] = useState([]);
//   const socket = socketServiceInstance.socket;

//   const formatDateAndTime = (isoDate) => {
//     const date = new Date(isoDate);
//     return date.toLocaleString("en-US", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   useEffect(() => {
//     if (socket && socket.connected) {
//         socket.emit("GET_NOTIFICATIONS_FOR_USER");
//         socket.emit("GET_NOTIFICATIONS_FOR_ADMIN");

//       return () => {
//         socket.off("GET_NOTIFICATIONS_FOR_USER");
//         socket.off("GET_NOTIFICATIONS_FOR_ADMIN");
//       };
//     }
//   }, [socket, role]);

//   const handleNotificationClick = (notification) => {
//     if (!notification.isRead) {
//       socketServiceInstance.socket?.emit("NOTIFICATION_IS_READ", {
//         _id: notification._id,
//       });
//       setUserNotifications((prev) =>
//         prev.map((n) =>
//           n._id === notification._id ? { ...n, isRead: true } : n
//         )
//       );
//     }
//   };

//   const handleMarkAllAsSeen = () => {
//     if (role === "0") {
//       socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_ADMIN", {});
//       setAdminNotifications((prev) =>
//         prev.map((n) => ({ ...n, isSeen: true }))
//       );
//     } else {
//       socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_USER", {});
//       setUserNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
//     }
//   };

//   const renderNotifications = (notifications) => {
//     return notifications.map((notification) => (
//       <div
//         onClick={() => handleNotificationClick(notification)}
//         key={notification._id}
//         className={`ml-[19.5%] mr-9 mt-4 px-3 py-5 relative rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1 ${
//           notification.isRead ? "bg-white" : "bg-[#F9DEDC]"
//         }`}
//       >
//         <span className="absolute right-5 text-[22px] text-body cursor-pointer top-3">
//           <RxCross2 />
//         </span>
//         <p className="text-sidebar font-semibold">
//           {notification.title
//             .replace(/_/g, " ")
//             .replace(/\b(AGENT|STUDENT|ADMIN)\b/g, "")
//             .trim() || "Notification Title"}
//         </p>
//         <p className="text-body mt-2">
//           {notification.message || "No message provided"}
//         </p>
//         <div className="flex justify-between mt-3 text-sm text-gray-500">
//           <span>{formatDateAndTime(notification.createdAt)}</span>
//         </div>
//         {notification.routePath &&
//           notification.routePath.split("/").length > 2 && (
//             <a
//               onClick={() => handleNotificationClick(notification)}
//               href={notification.routePath}
//               className="text-primary hover:underline text-sm mt-2"
//             >
//               Click to view
//             </a>
//           )}
//       </div>
//     ));
//   };

//   return (
//     <>
//       <Header
//         icon={location.pathname === "/student/shortlist" ? <FaStar /> : null}
//       />
//       <div className="font-poppins">
//         <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
//           {role === "3" ? (
//             <Sidebar />
//           ) : role === "2" ? (
//             <AgentSidebar />
//           ) : role === "0" ? (
//             <AdminSidebar />
//           ) : null}
//         </span>
//         <div className="ml-[17%] pt-16 pb-5 bg-white border-b-2 border-[#E8E8E8]">
//           <span className="flex items-center">
//             <p className="text-[28px] font-semibold text-sidebar mt-5 md:ml-9 sm:ml-20">
//               Notifications Center
//             </p>
//           </span>
//           <p className="text-[16px] ml-[3%] text-body pr-52">
//             Stay updated on your applications, college statuses, visa progress,
//             and more. Check here regularly for notifications and pending tasks.
//           </p>
//         </div>

//         <div className="mb-20">
//           <span className="flex justify-end mr-9 mt-6">
//             <span
//               onClick={handleMarkAllAsSeen}
//               className="text-body bg-[#F2F5F7] px-6 py-2 rounded-md cursor-pointer"
//             >
//               Mark All as Seen
//             </span>
//           </span>
//           {role === "0" && adminNotifications.length > 0 && (
//             <>{renderNotifications(adminNotifications)}</>
//           )}
//           {role !== "0" && userNotifications.length > 0 && (
//             <>{renderNotifications(userNotifications)}</>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNotificationCount,
  removeNotification,
} from "../features/notificationSlice";
import Header from "../components/dashboardComp/Header";
import { FaStar } from "react-icons/fa";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Sidebar from "../components/dashboardComp/Sidebar";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { RxCross2 } from "react-icons/rx";
import socketServiceInstance from "../services/socket";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  const [deletingNotification, setDeletingNotification] = useState(null);
  const { notifications } = useSelector((state) => state.notifications);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      let byAdmin = false;
      if (role === "0" || role === "1") {
        byAdmin = true;
      }
      socketServiceInstance.socket?.emit("NOTIFICATION_IS_READ", {
        _id: notification._id,
        byAdmin,
      });
    }
  };
  const handleDeleteNotification = (notificationId) => {
    if (socketServiceInstance.socket) {
      socketServiceInstance.socket?.emit("DELETE_NOTIFICATION", notificationId);
      socketServiceInstance.socket?.on("DELETE_NOTIFICATION", (response) => {
        setDeletingNotification(notificationId);
        setTimeout(() => {
          dispatch(removeNotification(notificationId)); // Remove from Redux state
        }, 300);
      });
    }
  };

  useEffect(() => {
    if (role === "0" || role === "1") {
      socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_ADMIN", {});
    } else {
      socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_USER", {});
    }
    dispatch(clearNotificationCount());
  }, [dispatch, socketServiceInstance]);

  const renderNotifications = (notifications) => {
    return notifications.map((notification) => (
      <div
        onClick={() => handleNotificationClick(notification)}
        key={notification._id}
        className={`ml-[19.5%] mr-9 mt-4 px-3 py-5 relative rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1 ${
          notification.isRead ? "bg-white" : "bg-[#F9DEDC]"
        }     ${
          deletingNotification === notification._id ? "slide-out-right" : ""
        }`}
      >
        <span
          onClick={() => handleDeleteNotification(notification._id)}
          className="absolute right-5 text-[22px] text-body cursor-pointer top-3"
        >
          <RxCross2 />
        </span>
        <p className="text-sidebar font-semibold">
          {notification.title
            .replace(/_/g, " ")
            .replace(/\b(AGENT|STUDENT|ADMIN)\b/g, "")
            .trim() || "Notification Title"}
        </p>
        <p className="text-body mt-2">
          {notification.message || "No message provided"}
        </p>
        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <span>{new Date(notification.createdAt).toLocaleString()}</span>
        </div>
         
         {
          notification.pathData ? 
          <Link
              onClick={() => handleNotificationClick(notification)}
              to={notification.routePath}
              state={notification.pathData}
              className="text-primary hover:underline text-sm mt-2"
            >
              Click to view
            </Link> :
         
            <a
              onClick={() => handleNotificationClick(notification)}
              href={notification.routePath}
              target="_blank"
              className="text-primary hover:underline text-sm mt-2"
            >
              Click to view
            </a>
         }
      </div>
    ));
  };

  return (
    <>
      <Header
        icon={location.pathname === "/student/shortlist" ? <FaStar /> : null}
      />
      <div className="font-poppins">
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          {role === "3" ? (
            <Sidebar />
          ) : role === "2" ? (
            <AgentSidebar />
          ) : role === "0" ? (
            <AdminSidebar />
          ) : null}
        </span>
        <div className="ml-[17%] pt-16 pb-5 bg-white border-b-2 border-[#E8E8E8]">
          <span className="flex items-center">
            <p className="text-[28px] font-semibold text-sidebar mt-5 md:ml-9 sm:ml-20">
              Notifications Center
            </p>
          </span>
          <p className="text-[16px] ml-[3%] text-body pr-52">
            Stay updated on your applications, college statuses, visa progress,
            and more. Check here regularly for notifications and pending tasks.
          </p>
        </div>
        <div className="mb-20">
          <span className="flex justify-end mr-9 mt-6">
            {/* <span
              onClick={handleMarkAllAsSeen}
              className="text-body bg-[#F2F5F7] px-6 py-2 rounded-md cursor-pointer"
            >
              Mark All as Seen
            </span> */}
          </span>
          {role === "0" && notifications.length > 0 && (
            <>{renderNotifications(notifications)}</>
          )}
          {role !== "0" && notifications.length > 0 && (
            <>{renderNotifications(notifications)}</>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
