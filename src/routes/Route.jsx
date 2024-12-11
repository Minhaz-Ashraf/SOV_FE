import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import AgentReg from "../pages/AgentReg";
import Login from "../pages/Login";
import NewAccount from "../pages/NewAccount";
import StudentReg from "../pages/StudentReg";
import SignUp from "../student/SignUp";
import AgentSignUp from "./../agent/AgentSignUp";
import Home from "./../pages/Home";
import ProtectedAgent from "./ProtectedAgent";
import ProtectedStudent from "./ProtectedStudent";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ChangePassword from "../pages/ChangePassword";
import SuccessPage from "../pages/SuccessPage";
import Dashboard from "../student/Dashboard";
import Shortlist from "../student/Shortlist";
import ApplyOfferLater from "../student/ApplyOfferLater";
import WaitingPage from "../pages/WaitingPage";
import AgentDashboard from "../agent/AgentDashboard";
import StudentsList from "../agent/StudentsList";
import AgentShortlist from "../agent/AgentShortlist";
import Institution from "../agent/Institution";
import StudentAgentProtected from "./StudentAgentProtected";
import StudentProfile from "../agent/StudentProfile";
import Applications from "../agent/Applications";
import ProfileEdit from "../agent/ProfileEdit";
import ApplicationView from "../agent/ApplicationView";
import OfferLetterEdit from "../agent/OfferLetterEdit";
import Approval from "../admin/Approval";
import ApplicationReview from "../admin/ApplicationReview";
import AdminLogin from "../admin/AdminLogin";
import ProtectedAdmin from "./ProtectedAdmin";
import HelpSupport from "../components/HelpSupport";
import AllApplication from "../student/AllApplication";
import StudentAgentInternal from "./StudentAgentInternal";
import CommonRoleProtected from "./CommonRoleProtected";
import AgentRoleProtected from "./AgentRoleProtected";
import HelpNSupport from "../pages/HelpNSupport";
import CourseFeeApplication from "../pages/CourseFeeApplication";
// import ChangedashboardEmail from '../pages/ChangedashboardEmail';
import ChangeDashboardPassword from "../pages/ChangeDashboardPassword";
import ChangeDashboardEmail from "../components/dashboardComp/ChangedashboardEmail";
import DashboardEmailOtp from "../components/dashboardComp/DashboardEmailOtp";
import VisaApply from "../pages/VisaApply";
import TicketSuppport from "./../admin/TicketSuppport";
import ChangeEmail from "../admin/ChangeEmail";
import ChangeAdminPassword from "../admin/ChangePassword";
import StudentDirectory from "../admin/StudentDirectory";
import AgentDirectory from "../admin/AgentDirectory";
import VisaEdit from "../agent/VisaEdit";
import CourseFeeEdit from "../agent/CourseFeeEdit";
import AdminDashboard from "../admin/AdminDashboard";
import VisaStatusComponent from "../components/dashboardComp/VisaStatusComponent";
import Documents from "./../student/Documents";
import AdminProfileEdit from "../admin/AdminProfileEdit";
import ReApproval_Request from "../pages/ReApproval_Request";
import NotificatonPage from "../pages/NotificatonPage";
import ApplicationList from "../admin/ApplicationList";
import StudentApplicationView from "../admin/StudentApplicationView";
import NoAccess from "./../components/NoAccess";
import DeleteAccount from "../pages/DeleteAccount";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/change-Pass",
    element: <ChangePassword></ChangePassword>,
  },
  {
    path: "/change-success",
    element: <SuccessPage></SuccessPage>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword></ForgotPassword>,
  },
  {
    path: "/otp-verify",
    element: <OtpVerification></OtpVerification>,
  },
  {
    path: "/new-account",
    element: <NewAccount></NewAccount>,
  },
  {
    path: "/student-signup",
    element: <SignUp></SignUp>,
  },

  {
    path: "/agent-signup",
    element: <AgentSignUp></AgentSignUp>,
  },
  {
    path: "/agent/account-deleted",
    element: <ReApproval_Request></ReApproval_Request>,
  },
  {
    path: "/student/account-deleted",
    element: <ReApproval_Request></ReApproval_Request>,
  },
  {
    path: "/notifications",
    element: <NotificatonPage></NotificatonPage>,
  },
  {
    path: "/removed-user",
    element: <NoAccess></NoAccess>,
  },
  {
    path: "/student-form/:page",
    element: (
      <StudentAgentProtected>
        <StudentReg></StudentReg>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/agent-form/:page",
    element: (
      <AgentRoleProtected>
        <AgentReg></AgentReg>
      </AgentRoleProtected>
    ),
  },
  {
    path: "/waiting",
    element: (
      // <ProtectedStudent>
      <WaitingPage></WaitingPage>
      // </ProtectedStudent>
    ),
  },

  {
    path: "/course-fee",
    element: (
      // <ProtectedStudent>
      <CourseFeeApplication></CourseFeeApplication>
      // </ProtectedStudent>
    ),
  },
  {
    path: "/settings/change-password",
    element: (
      // <ProtectedStudent>
      <ChangeDashboardPassword></ChangeDashboardPassword>
      // </ProtectedStudent>
    ),
  },
  {
    path: "/settings/change-email",
    element: (
      // <ProtectedStudent>
      <ChangeDashboardEmail></ChangeDashboardEmail>
      // </ProtectedStudent>
    ),
  },
  {
    path: "/settings/otp-confirm",
    element: (
      // <ProtectedStudent>
      <DashboardEmailOtp></DashboardEmailOtp>
      // </ProtectedStudent>
    ),
  },

  {
    path: "/visa-apply",
    element: (
      // <ProtectedStudent>
      <VisaApply></VisaApply>
      // </ProtectedStudent>
    ),
  },
  //student routes
  {
    path: "/student/dashboard",
    element: (
      <ProtectedStudent>
        <Dashboard></Dashboard>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/application",
    element: (
      <ProtectedStudent>
        <AllApplication></AllApplication>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/visa-update",
    element: (
      <ProtectedStudent>
        <VisaStatusComponent></VisaStatusComponent>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/document",
    element: (
      <ProtectedStudent>
        <Documents></Documents>
      </ProtectedStudent>
    ),
  },
  {
    path: "/account/profile-edit",
    element: (
      <CommonRoleProtected>
        <StudentProfile></StudentProfile>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/student/shortlist",
    element: (
      <StudentAgentInternal>
        <AgentShortlist></AgentShortlist>
      </StudentAgentInternal>
    ),
  },
  {
    path: "/help-support",
    element: (
      <StudentAgentInternal>
        <HelpNSupport></HelpNSupport>
      </StudentAgentInternal>
    ),
  },
  {
    path: "/offerLetter-apply",
    element: (
      // <StudentAgentInternal>
      <ApplyOfferLater></ApplyOfferLater>
      // </StudentAgentInternal>
    ),
  },

  {
    path: "/agent/dashboard",
    element: (
      <ProtectedAgent>
        <AgentDashboard></AgentDashboard>
      </ProtectedAgent>
    ),
  },
  {
    path: "/agent/student-lists",
    element: (
      <ProtectedAgent>
        <StudentsList></StudentsList>
      </ProtectedAgent>
    ),
  },

  {
    path: "/student-profile",
    element: (
      <CommonRoleProtected>
        <StudentProfile></StudentProfile>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent-profile",
    element: (
      <CommonRoleProtected>
        <ProfileEdit></ProfileEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/application-view",
    element: (
      <CommonRoleProtected>
        <OfferLetterEdit></OfferLetterEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/coursefee-view",
    element: (
      <CommonRoleProtected>
        <CourseFeeEdit></CourseFeeEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/visa-view",
    element: (
      <CommonRoleProtected>
        <VisaEdit></VisaEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent/applications",
    element: (
      <ProtectedAgent>
        <Applications></Applications>
      </ProtectedAgent>
    ),
  },

  {
    path: "/agent/application/lists",
    element: <ApplicationView></ApplicationView>,
  },
  {
    path: "/settings/delete-account",
    element: <DeleteAccount></DeleteAccount>,
  },
  {
    path: "/offerLetter/edit",
    element: (
      <CommonRoleProtected>
        <OfferLetterEdit></OfferLetterEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/visa/edit",
    element: (
      <CommonRoleProtected>
        <VisaEdit></VisaEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/course-fee/edit",
    element: (
      <CommonRoleProtected>
        <CourseFeeEdit></CourseFeeEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/account-settings/profile-edit",
    element: (
      <CommonRoleProtected>
        <ProfileEdit></ProfileEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent-profile",
    element: (
      <ProtectedAdmin>
        <ProfileEdit></ProfileEdit>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/shortlist",
    element: (
      <StudentAgentInternal>
        <AgentShortlist></AgentShortlist>
      </StudentAgentInternal>
    ),
  },
  {
    path: "/agent/institution",
    element: (
      <ProtectedAgent>
        <Institution></Institution>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/approvals",
    element: (
      <ProtectedAdmin>
        <Approval></Approval>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/applications-review",
    element: (
      <ProtectedAdmin>
        <ApplicationReview></ApplicationReview>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/applications-review",
    element: (
      <ProtectedAdmin>
        <ApplicationReview></ApplicationReview>
      </ProtectedAdmin>
    ),
  },
  //admin routes
  {
    path: "/admin/role/auth/login",
    element: <AdminLogin></AdminLogin>,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedAdmin>
        <AdminDashboard></AdminDashboard>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/ticket",
    element: (
      <ProtectedAdmin>
        <TicketSuppport></TicketSuppport>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/application-list",

    element: (
      <ProtectedAdmin>
        <ApplicationList></ApplicationList>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/student-applications",
    element: (
      <ProtectedAdmin>
        <StudentApplicationView></StudentApplicationView>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/change-email",
    element: (
      <ProtectedAdmin>
        <ChangeEmail></ChangeEmail>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <ProtectedAdmin>
        <AdminProfileEdit></AdminProfileEdit>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/change-password",
    element: (
      <ProtectedAdmin>
        <ChangeAdminPassword></ChangeAdminPassword>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/agent-directory",
    element: (
      <ProtectedAdmin>
        {" "}
        <AgentDirectory></AgentDirectory>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/agent-student",
    element: (
      <ProtectedAdmin>
        <StudentDirectory></StudentDirectory>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/student-directory",
    element: (
      <ProtectedAdmin>
        <StudentDirectory></StudentDirectory>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/*",
    element: <ErrorPage></ErrorPage>,
  },
]);
