

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearNotificationCount,
//   removeNotification,
// } from "../features/notificationSlice";
// import Header from "../components/dashboardComp/Header";
// import { FaStar } from "react-icons/fa";
// import AgentSidebar from "../components/dashboardComp/AgentSidebar";
// import Sidebar from "../components/dashboardComp/Sidebar";
// import AdminSidebar from "../components/dashboardComp/AdminSidebar";
// import { RxCross2 } from "react-icons/rx";
// import socketServiceInstance from "../services/socket";
// import { Link } from "react-router-dom";

// const NotificationPage = () => {
//   const dispatch = useDispatch();
//   const role = localStorage.getItem("role");

//   const [deletingNotification, setDeletingNotification] = useState(null);
//   const { notifications } = useSelector((state) => state.notifications);

//   const handleNotificationClick = (notification) => {
//     if (!notification.isRead) {
//       let byAdmin = false;
//       if (role === "0" || role === "1") {
//         byAdmin = true;
//       }
//       socketServiceInstance.socket?.emit("NOTIFICATION_IS_READ", {
//         _id: notification._id,
//         byAdmin,
//       });
//     }
//   };
//   const handleDeleteNotification = (notificationId) => {
//     if (socketServiceInstance.socket) {
//       socketServiceInstance.socket?.emit("DELETE_NOTIFICATION", notificationId);
//       socketServiceInstance.socket?.on("DELETE_NOTIFICATION", (response) => {
//         setDeletingNotification(notificationId);
//         setTimeout(() => {
//           dispatch(removeNotification(notificationId)); // Remove from Redux state
//         }, 300);
//       });
//     }
//   };

//   useEffect(() => {
//     if (role === "0" || role === "1") {
//       socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_ADMIN", {});
//     } else {
//       socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_USER", {});
//     }
//     dispatch(clearNotificationCount());
//   }, [dispatch, socketServiceInstance]);

//   const renderNotifications = (notifications) => {
//     return notifications.map((notification) => (
//       <div
//         onClick={() => handleNotificationClick(notification)}
//         key={notification._id}
//         className={`ml-[19.5%] mr-9 mt-4 px-3 py-5 relative rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1 ${
//           notification.isRead ? "bg-white" : "bg-[#F9DEDC]"
//         }     ${
//           deletingNotification === notification._id ? "slide-out-right" : ""
//         }`}
//       >
//         <span
//           onClick={() => handleDeleteNotification(notification._id)}
//           className="absolute right-5 text-[22px] text-body cursor-pointer top-3"
//         >
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
//           <span>{new Date(notification.createdAt).toLocaleString()}</span>
//         </div>
         
//          {
//           notification.pathData ? 
//           <Link
//               onClick={() => handleNotificationClick(notification)}
//               to={notification.routePath}
//               state={notification.pathData}
//               className="text-primary hover:underline text-sm mt-2"
//             >
//               Click to view
//             </Link> :
         
//             <a
//               onClick={() => handleNotificationClick(notification)}
//               href={notification.routePath}
//               target="_blank"
//               className="text-primary hover:underline text-sm mt-2"
//             >
//               Click to view
//             </a>
//          }
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
//             {/* <span
//               onClick={handleMarkAllAsSeen}
//               className="text-body bg-[#F2F5F7] px-6 py-2 rounded-md cursor-pointer"
//             >
//               Mark All as Seen
//             </span> */}
//           </span>
//           {role === "0" && notifications.length > 0 && (
//             <>{renderNotifications(notifications)}</>
//           )}
//           {role !== "0" && notifications.length > 0 && (
//             <>{renderNotifications(notifications)}</>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationPage;
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNotificationCount,
  removeNotification,
  addAllNotifications,
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
  const [isLoading, setIsLoading] = useState(false);

  const {
    notifications,
    currentPage,
    nextPage,
    totalNotification,
    totalPage,
  } = useSelector((state) => state.notifications);

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

  const fetchNotifications = useCallback(() => {
    if (isLoading || !nextPage) return;

    setIsLoading(true);
    const eventName =
      role === "0" || role === "1"
        ? "GET_NOTIFICATIONS_FOR_ADMIN"
        : "GET_NOTIFICATIONS_FOR_USER";

    socketServiceInstance.socket?.emit(eventName, { page: nextPage, limit: 10 });
    socketServiceInstance.socket?.on(eventName, (data) => {
      dispatch(addAllNotifications(data));
      setIsLoading(false);
    });
  }, [dispatch, isLoading, nextPage, role]);

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 200;

    if (bottom && !isLoading) {
      fetchNotifications();
    }
  }, [fetchNotifications, isLoading]);

  useEffect(() => {
    if (role === "0" || role === "1") {
      socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_ADMIN", {});
    } else {
      socketServiceInstance.socket?.emit("NOTIFICATION_SEEN_BY_USER", {});
    }
    dispatch(clearNotificationCount());
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, handleScroll, role]);

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
        {notification.pathData ? (
          <Link
            onClick={() => handleNotificationClick(notification)}
            to={notification.routePath}
            state={notification.pathData}
            className="text-primary hover:underline text-sm mt-2"
          >
            Click to view
          </Link>
        ) : (
          <a
            onClick={() => handleNotificationClick(notification)}
            href={notification.routePath}
            target="_blank"
            className="text-primary hover:underline text-sm mt-2"
          >
            Click to view
          </a>
        )}
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
          {notifications.length > 0 && <>{renderNotifications(notifications)}</>}
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
