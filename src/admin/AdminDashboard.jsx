import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { adm, article, Group, GroupUser, task, TwoUser } from "../assets";
import DonoughtChart from "../components/dashboardComp/charts/Donought";
import LineChart from "../components/dashboardComp/charts/LineChart";
import BarChart from "../components/dashboardComp/charts/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { agentInformation, allStudentCount } from "../features/agentSlice";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import AdminDashCard, {
  AdminDashCardTwo,
} from "../components/adminComps/AdminDashCard";
import {
  fetchAdminDashboardData,
  totalAgentStudent,
} from "../features/adminApi";
import { appType, donoughtFilter, userType } from "../constant/data";

const AdminDashboard = () => {
  const { getAdminProfile } = useSelector((state) => state.admin);

  const totalStudentCount = useSelector((state) => state.agent.studentCount);
  const { agentData } = useSelector((state) => state.agent);
  const [applicationData, setApplicationData] = useState();
  const [isAgentData, setAgentData] = useState();
  const [isStudentData, setStudentData] = useState();

  const [userMonthlyData, setUserMontlyData] = useState();
  // const [monthlyApplicationData, setMontlyApplicationData] = useState();
  const [ticketData, setTicketData] = useState();
  const [userCount, setUserCount] = useState();
  const [appCount, setAppCount] = useState();
  const [appOverviewCount, setAppOverviewCount] = useState();
  const [isUserType, setUserType] = useState();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
const [userDataType, setUserDataType]  = useState('');
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
    
    const [selectedMonth, selectedYear] = selectedValue.split(' ');

    setMonth(selectedMonth); 
    setYear(selectedYear);   
  };
  
  const handleUserChange = (e) => {
    setUserType(e.target.value);
  };
  const handleUserTypeChange = (e) => {
    setUserDataType(e.target.value);
  };

  const agentLineData = userCount?.data?.agents ?? [];
  const studentData = userCount?.data?.students ?? [];

  console.log(selectedDateDoughnut);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allStudentCount());
  }, [dispatch]);

  const getApplicationCount = async () => {
    try {
      const res = await fetchAdminDashboardData("/admin/application-count");
      setApplicationData(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getApplicationMonthlyCount = async () => {
    try {
      const res = await fetchAdminDashboardData(
        "/admin/total-application-monthly-count",
        isUserType,
        selectedYearBar
      );
      setAppCount(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserMonthlyCount = async () => {
    try {
      const res = await fetchAdminDashboardData(
        "/admin/user-monthly-counts",
        null,
        selectedYearLine,
        userDataType
      );
      setUserMontlyData(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTicketCount = async () => {
    try {
      const res = await fetchAdminDashboardData("/admin/ticket-count");
      setTicketData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getAgentData = async () => {
    try {
      const res = await totalAgentStudent("/admin/agent-count");
      setAgentData(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getStudentData = async () => {
    try {
      const res = await totalAgentStudent("/admin/student-count");
      setStudentData(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalUser = async () => {
    try {
      const res = await totalAgentStudent("/admin/user-monthly-counts");
      setUserCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalApplicationsOverview = async () => {
    try {
      const res = await totalAgentStudent(
        "/admin/total-application-overview-admin",
        month,
        year
      );
      setAppOverviewCount(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getApplicationCount();
    getTicketCount();

    getUserMonthlyCount();
    getAgentData();
    getStudentData();
    getTotalUser();
  }, []);
  useEffect(() => {
    getTotalApplicationsOverview();
  }, [month, year]);
  useEffect(() => {
    getUserMonthlyCount();
  }, [selectedYearLine, userDataType]);
  useEffect(() => {
    getApplicationMonthlyCount();
  }, [isUserType, selectedYearBar]);
  const cardData = [
    {
      // link: "/agent/applications",
      icon: article,
      totalCount: applicationData?.totalCount ||"0",
      approvedCount: applicationData?.approvedCount ||"0",
      pendingCount: applicationData?.pendingCount ||"0",
      label: "Applications",
      text: "Approved",
    },
    {
      // link: "/agent/applications",
      icon: adm,
      totalCount: ticketData?.totalCount || "0",
      approvedCount: ticketData?.approvedCount || "0",
      pendingCount: ticketData?.pendingCount || "0",
      label: "Tickets",
      text: "Resolved",
    },
  ];

  const cardDataTwo = [
    {
      // link: "/admin/applications",
      icon: GroupUser,
      customBg: "#C5FCF8",
      count: isStudentData?.data?.studentCount || "0",
      active: isStudentData?.data?.activeStudentCount || "0",

      label: "Total Students",
      customSBg: "#C5FCF8",
      bgImg: "/bgOne.png",
    },
    {
      // link: "/agent/applications",
      icon: TwoUser,
      customBg: "#FAEDED",
      count: isAgentData?.data?.totalAgent || "0",
      active: isAgentData?.data?.activeAgentCount || "0",
      label: "Total Agents",
      customSBg: "#FAEDED",
      bgImg: "/bgTwo.png",
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

  


  const datasets = [];

  // Add agent dataset if data exists
  if (agentLineData.length > 0) {
    datasets.push({
      label: `# of Agents (${selectedYearLine})`,
      data: monthNames.map((month, index) => {
        const monthNumber = index + 1;
        const agent = agentLineData.find(
          (user) => user.year === selectedYearLine && user.month === monthNumber
        );
        return agent ? agent.count : 0;
      }),
      borderColor: '#4B9460', // Green line color for agents
      backgroundColor: 'rgba(75, 148, 96, 0.2)', // Light green for points
      pointBackgroundColor: 'rgba(75, 148, 96, 1)', // Dark green for points
      tension: 0.4, // Curved line
      borderWidth: 2,
    });
  }
  
  // Add student dataset if data exists
  if (studentData.length > 0) {
    datasets.push({
      label: `# of Students (${selectedYearLine})`,
      data: monthNames.map((month, index) => {
        const monthNumber = index + 1;
        const student = studentData.find(
          (user) => user.year === selectedYearLine && user.month === monthNumber
        );
        return student ? student.count : 0;
      }),
      borderColor: '#FF6F61', // Red line color for students
      backgroundColor: 'rgba(255, 111, 97, 0.2)', // Light red for points
      pointBackgroundColor: 'rgba(255, 111, 97, 1)', // Dark red for points
      tension: 0.4, // Curved line
      borderWidth: 2,
    });
  }
  
  // Check if we have any datasets to render
  const filteredLineData = {
    labels: monthNames, // Months as labels
    datasets: datasets.length > 0 ? datasets : [], // Only include datasets if they exist
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

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          <AdminSidebar />
        </span>
        <div className="md:ml-[17%] ml-[22%] pt-14 font-poppins">
          <p className="md:text-[28px] text-[24px] font-bold text-sidebar mt-6 ml-9">
            Dashboard
          </p>
          <span className="flex items-center justify-between mx-9">
            <p className="font-normal text-body pr-[20%] text-[16px]">
              Hi{" "}
              {getAdminProfile?.data?.firstName +
                " " +
                getAdminProfile?.data?.lastName}
              , Welcome back to SOV Portal
            </p>
            <span className="bg-white px-4 py-2 text-body"></span>
          </span>
          <span className="grid md:grid-cols-4 sm:grid-cols-2 items-center mx-9 mt-6 gap-4">
            {cardDataTwo.map((data, index) => (
              <AdminDashCardTwo
                key={index}
                label={data.label}
                link={data.link}
                customBg={data.customBg}
                count={data.count}
                active={data.active}
                icon={data.icon}
                customSBg={data.customSBg}
                bgImg={data.bgImg}
              />
            ))}
            {cardData.map((data, index) => (
              <AdminDashCard
                key={index}
                label={data.label}
                link={data.link}
                totalCount={data.totalCount}
                pendingCount={data.pendingCount}
                approvedCount={data.approvedCount}
                icon={data.icon}
                text={data.text}
              />
            ))}
          </span>

          <div className="flex md:flex-row flex-col w-full gap-4 px-6 mt-6 mb-9">
            <div className="px-9 bg-white py-4 rounded-md border border-[#E8E8E8] md:w-[40%] h-auto ">
              <div className="  flex flex-row items-center justify-between w-full">
                <p className="text-sidebar text-[18px] font-semibold mt-3 mb-6">
                  Application Overview
                </p>

                <span className="flex items-center">
                  <label
                    htmlFor="year-line"
                    className="font-medium text-sidebar w-28"
                  >
                    Select Year:{" "}
                  </label>
                  <select
                    id="year-line"
                    value={selectedDateDoughnut}
                    onChange={handleDonoughtChange} 

                    className="border p-2 rounded-md  outline-none"
                  >
                    {donoughtFilter.map((data) => (
                      <option
                        key={data.id}
                        value={data.option}
                      >
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

                <div className="flex gap-3 items-center">
              
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
                </div>

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
            <span className="flex flex-row items-center">
              <div className="mx-2">
                <label htmlFor="year-bar" className="font-medium text-sidebar">
                  Application Type:{" "}
                </label>
                <select
                  className="ml-3 border px-2 py-1 w-24 h-11 rounded outline-none"
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

export default AdminDashboard;
