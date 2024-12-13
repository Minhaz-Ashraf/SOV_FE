import { io, Socket } from "socket.io-client";
const role = localStorage.getItem("role");
import {store} from "../features/store";
import { addAllNotifications, addNewNotification, markNotificationAsRead, updateNotificationCount } from "../features/notificationSlice";
import { Navigate, useNavigate } from "react-router-dom";

class SocketService {

  constructor() {
    this.socket = null;
  }
  async connectToSocket(hostName, encryptData) {
    if (this.socket) {
      console.log("Socket is already connected");
      return;
    }
     
    const query = encryptData;

    console.log("Connecting to socket...", hostName, encryptData);

    // Initialize the socket connection
    this.socket = io(hostName, {
      path: "/notifications/",
      query,
      transports: ["websocket"],
    });

    // Handle connection success
    this.socket.on("connect", () => {
      
      if (role === "0") {
        this.socket.emit("GET_NOTIFICATIONS_FOR_ADMIN", { page: 1, limit: 10 });
      } else {
        this.socket.emit("GET_NOTIFICATIONS_FOR_USER", { page: 1, limit: 10 });
      }
      console.log("Successfully connected to socket:", this.socket.id);
    });

    this.socket.on("onMessage", (message) => {
      console.log("Received message from server:", message);
    })

    this.socket.on("GET_NOTIFICATIONS_FOR_USER", (data) => {
      console.log("GET_NOTIFICATIONS_FOR_USER:", data);
      store.dispatch(addAllNotifications(data));
    });
    
    this.socket.on("GET_NOTIFICATIONS_FOR_ADMIN", (data) => {
      console.log("GET_NOTIFICATIONS_FOR_ADMIN:", data);
      store.dispatch(addAllNotifications(data));
    });

    //these three are for getting new notifications and appending them
    this.socket.on("GLOBAL_NOTIFICATION_STUDENT_ALERT", (data) => {
      console.log("GLOBAL_NOTIFICATION_STUDENT_ALERT:", data);
      store.dispatch(addNewNotification(data))
      this.socket.emit("GET_UNREAD_COUNT", "emitForUser");
    });
    this.socket.on("DELETE_AUTH_TOKEN", (data) => {

      console.log("mak");
      // const navigate= useNavigate()

      localStorage.removeItem('role')
      localStorage.removeItem('student')
      localStorage.removeItem('form')
      localStorage.removeItem('userAuthToken')

      // navigate("/login")


    });

    this.socket.on("GLOBAL_NOTIFICATION_AGENT_ALERT", (data) => {
      console.log("GLOBAL_NOTIFICATION_AGENT_ALERT:", data);
      store.dispatch(addNewNotification(data))
      this.socket.emit("GET_UNREAD_COUNT", "emitForUser");
    });

    this.socket.on("GLOBAL_NOTIFICATION_ADMIN_ALERT", (data) => {
      console.log("GLOBAL_NOTIFICATION_ADMIN_ALERT:", data);
      store.dispatch(addNewNotification(data))
      this.socket.emit("GET_UNREAD_COUNT", "emitForAdmin");
    });

    //this event is to get the notificationCount
    this.socket.on("GET_UNREAD_COUNT", (data) => {
      console.log("GET_UNREAD_COUN:", data);
      store.dispatch(updateNotificationCount(data));
    });

    this.socket.on("NOTIFICATION_READ_STATUS_UPDATE", (data) => {
      console.log("NOTIFICATION_READ_STATUS_UPDATE:", data);
      store.dispatch(markNotificationAsRead(data));
    });

    // Handle connection errors
    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Handle disconnection
    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.socket = null;
    });

  }


  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected");
    }
  }

  sendMessage = async (eventType, dataObj) => {
    console.log(`for event ${eventType}, data is ${dataObj}`);
    if (this.isConnected()) {
      this.socket.emit(eventType, dataObj);
    } else {
      console.log("Socket is not connected, message not sent");
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;