import { FaStar } from "react-icons/fa";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import ShortlistComponent from "../components/dashboardComp/ShortlistComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { shortlistedData } from "../features/agentSlice";
import { shortlistAdd } from "../features/agentApi";
import { toast } from "react-toastify";
import Sidebar from "../components/dashboardComp/Sidebar";

const AgentShortlist = () => {
  const role = localStorage.getItem("role")
  const shortlisteduniversity = useSelector((state) => state.agent.shortlisted);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch shortlisted universities on component mount
  useEffect(() => {
    setIsLoading(true);
    dispatch(shortlistedData()).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  // Function to handle shortlisting an institute
  const shortlistInstitute = async (instituteId) => {
    try {
      const res = await shortlistAdd(instituteId);
      console.log(res);
      toast.success(res.message || "University shortlisted");

      // Refetch the updated list after successful shortlist
      dispatch(shortlistedData());
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header icon={<FaStar />} customLink="/agent/shortlist" />
      <div className="">
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        {role === "3" ? <Sidebar/> :     <AgentSidebar />}
        </span>
      </div>

      <ShortlistComponent
        cardData={shortlisteduniversity}
        shortlistInstitute={shortlistInstitute}
        isLoading={isLoading}
        headingText="Your Shortlisted Universities & Colleges"
        bodyText="Easily explore your shortlisted colleges tailored to your preferred countries, all in one place. Simplify your study abroad journey with a personalized selection on our study visa portal."
      />
    </>
  );
};

export default AgentShortlist;
