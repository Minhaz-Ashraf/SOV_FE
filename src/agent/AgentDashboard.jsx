import React, { useEffect, useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import AgentDashCard from "../components/dashboardComp/AgentDashCard";
import { adm, article, Group, task } from "../assets";
import DonoughtChart from "../components/dashboardComp/charts/Donought";
import LineChart from "../components/dashboardComp/charts/LineChart";
import BarChart from "../components/dashboardComp/charts/BarChart";
import {
  getAllApplications,
  getAllCompletedApplication,
  getAllUnderReviewApplication,
} from "../features/agentApi";
import { useDispatch, useSelector } from "react-redux";
import { agentInformation, allStudentCount } from "../features/agentSlice";
import { totalAgentStudent } from "../features/adminApi";

const AgentDashboard = () => {
  const totalStudentCount = useSelector((state) => state.agent.studentCount);
  const { agentData } = useSelector((state) => state.agent);
  const [applicationData, setApplicationData] = useState();
  const [underReviewData, setUnderreviewData] = useState();
  const [completedApplication, setCompletedApplication] = useState();
  const [appOverviewCount, setAppOverviewCount] = useState();
  const [appCount, setAppCount] = useState();
   const [studentCount, setStudentCount] = useState();
  const [selectedYearLine, setSelectedYearLine] = useState(
    new Date().getFullYear()
  );
  const [selectedYearBar, setSelectedYearBar] = useState(
    new Date().getFullYear()
  );
  const [selectedDateDoughnut, setSelectedDateDoughnut] = useState(
    new Date().toISOString().substring(0, 10)
  ); // Date picker state
  const [years] = useState([2021, 2022, 2023, 2024]); // List of available years
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allStudentCount());
  }, [dispatch]);

  const getApplicationCount = async () => {
    try {
      const res = await getAllApplications();
      setApplicationData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getUnderReviewData = async () => {
    try {
      const res = await getAllUnderReviewApplication();
      setUnderreviewData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompletedData = async () => {
    try {
      const res = await getAllCompletedApplication();
      setCompletedApplication(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalApplicationsOverview = async () => {
    try {
      const res = await  totalAgentStudent("/agent/application-overview");
      setAppOverviewCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalStudent = async () => {
    try {
      const res = await  totalAgentStudent("/agent/user-monthly-counts-agent");
      setStudentCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalApplication = async () => {
    try {
      const res = await  totalAgentStudent("/agent/total-application-monthly-count-agent");
      setAppCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getApplicationCount();
    getUnderReviewData();
    getCompletedData();
    getTotalApplicationsOverview();
    getTotalStudent()
    getTotalApplication();
  }, []);

  const cardData = [
    { 
      link: "/agent/student-lists",
      icon: Group,
      count: totalStudentCount?.totalRecords,
      data: totalStudentCount?.percentageIncrease,
      label: "Total Students",
    },
    {
      link: "/agent/applications",
      icon: article,
      count: applicationData?.totalRecords,
      data: applicationData?.percentageIncrease,
      label: "Total Applications",
    },
    {
      link: "/agent/applications",
      icon: adm,
      count: underReviewData?.totalUnderReview,
      data: underReviewData?.underReviewPercentage,
      label: "Under Review Applications",
    },
    {
      link: "/agent/applications",
      icon: task,
      count: completedApplication?.totalCompleted,
      data: completedApplication?.increasePercentage,
      label: "Completed Applications",
    },
  ];

  
 
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    label: "# of Votes",
    values: [12, 19, 3, 5, 15, 12, 8, 20],
  };

  const donoughtData = {
    labels: ["Offer Letter", "Course Fee Application", "Visa"],
    label: "# of Applications",
    values: [
      appOverviewCount?.data?.offerLetterCount || 0,
      (appOverviewCount?.data?.totalApplications || 0) -
        ((appOverviewCount?.data?.offerLetterCount || 0) +
          (appOverviewCount?.data?.visaCount || 0)),
      appOverviewCount?.data?.visaCount || 0,
    ],
  };
  
  const getFilteredDoughnutData = (date) => {
    if (!appOverviewCount?.data) return donoughtData;
  
    const filteredValues = [
      appOverviewCount?.data?.offerLetterCount || 0,
      (appOverviewCount?.data?.totalApplications || 0) -
        ((appOverviewCount?.data?.offerLetterCount || 0) +
          (appOverviewCount?.data?.visaCount || 0)),
      appOverviewCount?.data?.visaCount || 0,
    ];
  
    return {
      ...donoughtData,
      values: filteredValues,
    };
  }; const filteredDoughnutData = getFilteredDoughnutData(selectedDateDoughnut);

  const filteredLineData = {
    labels: monthNames, // Months as labels
    label: `# of Users (${selectedYearLine})`,
    // values: setStudentCount
    //   .filter((user) => user.year === selectedYearLine)
    //   .map((user) => user.count),
  };
  

  const filteredBarData = {
    ...barData,
    label: `# of Applications (${selectedYearBar})`,
    values: barData.values, // Adjust this if you have year-specific data
  };
console.log(appOverviewCount?.data?.visaCount, "test") 
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          <AgentSidebar />
        </span>
        <div className="md:ml-[17%] ml-[22%] pt-14 font-poppins">
          <p className="md:text-[28px] text-[24px] font-bold text-sidebar mt-6 ml-9">
            Dashboard
          </p>
          <span className="flex items-center justify-between mx-9">
            <p className="font-normal text-body pr-[20%] text-[16px]">
              Hi{" "}
              {agentData?.primaryContact?.firstName +
                " " +
                agentData?.primaryContact?.lastName}
              , Welcome back to SOV Portal
            </p>
            <span className="bg-white px-4 py-2 text-body">
              Your Id:{" "}
              <span className="text-black font-semibold ">
                {agentData?.agId}
              </span>
            </span>
          </span>
          <span className="grid md:grid-cols-4 sm:grid-cols-2 items-center mx-9 mt-6 gap-4">
            {cardData.map((data, index) => (
              <AgentDashCard
                key={index}
                label={data.label}
                link={data.link}
                count={data.count}
                icon={data.icon}
                data={data.data}
              />
            ))}
          </span>

          <div className="flex md:flex-row flex-col w-full gap-4 px-9 mt-6 mb-9">
            <div className="px-9 bg-white py-4 rounded-md border border-[#E8E8E8] md:w-[40%] h-auto ">
              <div className="  flex flex-row items-center justify-between">
                <p className="text-sidebar text-[18px] font-semibold mt-3 mb-6">
                  Application Overview
                </p>

                <input
                  type="date"
                  id="date-doughnut"
                  value={selectedDateDoughnut}
                  onChange={(e) => setSelectedDateDoughnut(e.target.value)}
                  className="border w-10 p-2 rounded-md outline-none text-[13px]"
                />
              </div>
              <div className="md:mx-2 sm:px-16 md:px-0 ">
                <DonoughtChart data={filteredDoughnutData}  visaCount={appOverviewCount?.data?.visaCount}/>
              </div>
            </div>

            <div className="px-9 bg-white py-4 rounded-md border border-[#E8E8E8] md:w-[60%] h-auto">
              <span className="flex flex-row justify-between mx-4">
                <p className="text-sidebar text-[18px] font-semibold mt-3 mb-6">
                  Total Students
                </p>
                <span>
                  <label htmlFor="year-line" className="font-semibold">
                    Select Year:{" "}
                  </label>
                  <select
                    id="year-line"
                    value={selectedYearLine}
                    onChange={(e) =>
                      setSelectedYearLine(parseInt(e.target.value))
                    }
                    className="border p-2 rounded-md ml-2 outline-none"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </span>
              </span>
              <LineChart data={filteredLineData} />
            </div>
          </div>
        </div>

        <div className="md:ml-[19.5%] ml-[26%]  bg-white pt-4 rounded-md border border-[#E8E8E8] mr-10 mb-9 ">
          <span className="flex flex-row justify-between mx-9">
            <p className="text-sidebar text-[18px] font-bold mt-3 mb-9 ml-9">
              Total Applications
            </p>
            <div className="mx-2">
              <label htmlFor="year-bar" className="font-semibold">
                Select Year:{" "}
              </label>
              <select
                id="year-bar"
                value={selectedYearBar}
                onChange={(e) => setSelectedYearBar(parseInt(e.target.value))}
                className="border p-2 rounded-md outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </span>
          <BarChart data={filteredBarData} />
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
