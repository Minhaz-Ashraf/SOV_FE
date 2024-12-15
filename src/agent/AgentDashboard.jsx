import React, { useEffect, useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import AgentDashCard from "../components/dashboardComp/AgentDashCard";
import { adm, article, Group, task } from "../assets";
import DonoughtChart from "../components/dashboardComp/charts/Donought";
import LineChart, { LineChartAgent } from "../components/dashboardComp/charts/LineChart";
import BarChart from "../components/dashboardComp/charts/BarChart";
import {
  fetchAgentDashboardData,
  getAllApplications,
  getAllCompletedApplication,
  getAllUnderReviewApplication,
} from "../features/agentApi";
import { useDispatch, useSelector } from "react-redux";
import { agentInformation, allStudentCount } from "../features/agentSlice";
import { totalAgentStudent } from "../features/adminApi";
import { appType, donoughtFilter, userType } from "../constant/data";

const AgentDashboard = () => {
  const totalStudentCount = useSelector((state) => state.agent.studentCount);
  const { agentData } = useSelector((state) => state.agent);
  const [applicationData, setApplicationData] = useState();
  const [underReviewData, setUnderreviewData] = useState();
  const [completedApplication, setCompletedApplication] = useState();
  const [appOverviewCount, setAppOverviewCount] = useState();
  const [isUserType, setUserType] = useState();
  const [month, setMonth] = useState('11');
  const [year, setYear] = useState('2024');
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
  const [years] = useState([2024, 2025, 2026, 2027]);
  const handleDonoughtChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDateDoughnut(selectedValue);

    const [selectedMonth, selectedYear] = selectedValue.split(" ");

    setMonth(selectedMonth);
    setYear(selectedYear);
  };

  const dispatch = useDispatch();
  const handleUserChange = (e) => {
    setUserType(e.target.value);
  };

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
      const res = await totalAgentStudent(
        "/agent/application-overview",
        month,
        year
      );
      setAppOverviewCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalStudent = async () => {
    try {
      const res = await fetchAgentDashboardData(
        "/agent/user-monthly-counts-agent",
        null,
        selectedYearLine
      );
      setStudentCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalApplication = async () => {
    try {
      const res = await fetchAgentDashboardData(
        "/agent/total-application-monthly-count-agent",
        isUserType,
        selectedYearBar
      );
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
    getTotalStudent();
  }, []);

  useEffect(() => {
    getTotalApplication();
  }, [isUserType, selectedYearBar]);

  useEffect(() => {
    getTotalStudent();
  }, [selectedYearLine]);
  useEffect(() => {
    getTotalApplicationsOverview();
  }, [month, year]);
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  };
  const filteredDoughnutData = getFilteredDoughnutData(selectedDateDoughnut);

  const filteredLineData = {
    labels: monthNames, // Months as labels
    label: `Total Number of Students (${selectedYearBar})`,
    values: monthNames.map((month, index) => {
      const monthNumber = index + 1; // Map index to month number (1-12)

      // Ensure appCount exists and is accessed correctly
      const userCount = studentCount?.students || [];
      const matchedAppCount = userCount.find(
        (app) => app.year === selectedYearBar && app.month === monthNumber
      );

      return matchedAppCount ? matchedAppCount.count : 0; // Return count or 0 if not found
    }),
  };

  const filteredBarData = {
    labels: monthNames, // Months as labels
    label: `# of Applications (${selectedYearBar})`,
    values: monthNames.map((month, index) => {
      const monthNumber = index + 1; // Map index to month number (1-12)

      // Ensure appCount exists and is accessed correctly
      const applicationCounts = appCount?.applicationCounts || [];
      const matchedAppCount = applicationCounts.find(
        (app) => app.year === selectedYearBar && app.month === monthNumber
      );

      return matchedAppCount ? matchedAppCount.count : 0; // Return count or 0 if not found
    }),
  };
  // console.log(appOverviewCount?.data?.visaCount, "test");
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

                <span>
                  <label
                    htmlFor="year-line"
                    className="font-medium text-sidebar"
                  >
                    Select Year:{" "}
                  </label>
                  <select
                    id="year-line"
                    value={selectedDateDoughnut}
                    onChange={handleDonoughtChange}
                    className="border p-2 rounded-md ml-2 outline-none"
                  >
                    {donoughtFilter.map((data) => (
                      <option key={data.id} value={data.option}>
                        {data.label}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
              <div className="md:mx-2 sm:px-16 md:px-0 ">
                <DonoughtChart
                  data={filteredDoughnutData}
                  totalApplication={appOverviewCount?.data?.totalApplications}
                />
              </div>
            </div>

            <div className="px-9 bg-white py-4 rounded-md border border-[#E8E8E8] md:w-[60%] h-auto">
              <span className="flex flex-row justify-between mx-4">
                <p className="text-sidebar text-[18px] font-semibold mt-3 mb-6">
                  Total Users
                </p>
                <span>
                  <label
                    htmlFor="year-line"
                    className="font-medium text-sidebar"
                  >
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
              <LineChartAgent data={filteredLineData} />
            </div>
          </div>
        </div>

        <div className="md:ml-[19.5%] ml-[26%]  bg-white pt-4 rounded-md border border-[#E8E8E8] mr-10 mb-9 ">
          <span className="flex flex-row justify-between mx-9">
            <p className="text-sidebar text-[18px] font-bold mt-3 mb-9 ml-9">
              Total Applications
            </p>
            <span className="flex flex-row items-center">
              <div className="mx-2">
                <label htmlFor="year-bar" className="font-medium text-sidebar">
                  Application Type:{" "}
                </label>
                <select
                  className="ml-3 border px-2 py-1 w-28 h-11 rounded outline-none"
                  value={isUserType}
                  onChange={handleUserChange}
                >
                  <option value="">All</option>
                  {appType.map((option) => (
                    <option key={option.option} value={option.option}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mx-2">
                <label htmlFor="year-bar" className="font-medium text-sidebar">
                  Select Year:{" "}
                </label>
                <select
                  id="year-bar"
                  value={selectedYearBar}
                  onChange={(e) => setSelectedYearBar(Number(e.target.value))}
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
          </span>
          <BarChart data={filteredBarData} />
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
