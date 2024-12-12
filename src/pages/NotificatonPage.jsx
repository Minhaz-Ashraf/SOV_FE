import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNotificationCount,
  removeNotification,
  addAllNotifications,
  markAllAsSeen,
} from "../features/notificationSlice";
import Header from "../components/dashboardComp/Header";
import { FaBell, FaStar } from "react-icons/fa";
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
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);

  const { notifications, currentPage, nextPage, totalNotification, totalPage } =
    useSelector((state) => state.notifications);

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
    if (isLoading || !nextPage || noMoreNotifications) return;

    setIsLoading(true);
    const eventName =
      role === "0" || role === "1"
        ? "GET_NOTIFICATIONS_FOR_ADMIN"
        : "GET_NOTIFICATIONS_FOR_USER";

    socketServiceInstance.socket?.emit(eventName, {
      page: nextPage,
      limit: 10,
    });
    socketServiceInstance.socket?.on(eventName, (data) => {
      if (data.notifications.length === 0) {
        setNoMoreNotifications(true);
      } else {
        dispatch(addAllNotifications(data));
        if (!data.nextPage) {
          setNoMoreNotifications(true);
        }
      }
      setIsLoading(false);
    });
  }, [dispatch, isLoading, nextPage, noMoreNotifications, role]);

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 200;

    if (bottom && !isLoading && !noMoreNotifications) {
      fetchNotifications();
    }
  }, [fetchNotifications, isLoading, noMoreNotifications]);

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

  const handleMarkAllAsSeen = () => {
    if (role === "0" || role === "1") {
      socketServiceInstance.socket?.emit("NOTIFICATION_ALL_READ_BY_ADMIN", {});
    } else {
      socketServiceInstance.socket?.emit("NOTIFICATION_ALL_READ_BY_USER", {});
    }
    dispatch(markAllAsSeen());
  };

  const renderNotifications = (notifications) => {
    return notifications.map((notification) => (
      <div
        onClick={() => handleNotificationClick(notification)}
        key={notification._id}
        className={`md:ml-[19.5%] sm:ml-[26%] md:mr-9 sm:mr-6 mt-4 px-3 py-5 relative rounded-md transition-transform duration-300 ease-in-out hover:-translate-y-1 ${
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
          {notification.title === "RECEIVED_OFFER_LETTER_AGENT"
            ? "RECIEVED DOCUMENT"
            : notification.title
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
            state={{ notifyId: notification.pathData?.studentId }}
            className="text-primary hover:underline text-sm mt-2"
          >
            Click to view{" "}
            {notification.title === "RECEIVED_OFFER_LETTER_AGENT"
              ? "> Go to Received document"
              : notification.title === "VISA_REJECTED_BY_EMBASSY_AGENT" ||
                notification.title === "VISA_APPROVED_BY_EMBASSY_AGENT"
              ? "> Go to Visa Status"
              : null}
          </Link>
        ) : (
          <a
            onClick={() => handleNotificationClick(notification)}
            href={notification.routePath}
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
        customLink="/agent/shortlist"
        icon={location.pathname === "/student/shortlist" ? <FaStar /> : null}
        iconTwo={location.pathname === "/notifications" ? <FaBell /> : null}
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
          <span className="flex items-center pt-2 md:ml-[0%] sm:ml-7">
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Notifications Center
            </p>
          </span>
          <p className="mt-1 font-normal text-body sm:ml-16 md:ml-9 pr-[30%]">
            Stay updated on your applications, college statuses, visa progress,
            and more. Check here regularly for notifications and pending tasks.
          </p>
        </div>
        <div className="mb-20">
          <span className="flex justify-end mr-9 mt-6">
            <span
              onClick={handleMarkAllAsSeen}
              className="text-body bg-[#F2F5F7] px-6 py-2 rounded-md cursor-pointer"
            >
              Mark All as Seen
            </span>
          </span>
          {notifications.length > 0 ? (
            renderNotifications(notifications)
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No notifications to show.
            </p>
          )}
          {isLoading && <p className="text-center text-gray-500">Loading...</p>}
          {noMoreNotifications && notifications.length > 0 && (
            <p className="text-center text-gray-500 mt-4">
              No more notifications to show.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
