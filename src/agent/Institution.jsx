import React, { useEffect, useState } from "react";
import {
  CountrySelect,
  CustomInput,
  InstituteComponent,
} from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import InstituteCard from "../components/dashboardComp/InstituteCard";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import { getInstituteOption } from "../features/generalSlice";
import { shortlistedData } from "../features/agentSlice";
import Dnf from "../components/Dnf";
import { noInstitute } from "../assets";
import { shortlistAdd } from "../features/agentApi";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Institution = () => {
  const { prefCountryOption, instituteOption } = useSelector(
    (state) => state.general
  );
  const shortlistedUniversities = useSelector(
    (state) => state.agent.shortlisted?.institutes
  );

  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    country: "",
    institutes: "",
    search: "", // Search term for both country and institute
  });
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [filteredInstituteOptions, setFilteredInstituteOptions] = useState([]); // Filtered institutes for dropdown
  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { value, name } = e.target;
    setFilterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getInstituteOption());
    dispatch(shortlistedData());
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (filterData.country) {
      const filteredInstitutesByCountry = instituteOption.filter(
        (institute) => institute.country === filterData.country
      );
      setFilteredInstituteOptions(filteredInstitutesByCountry);
    } else {
      setFilteredInstituteOptions([]);
    }
  }, [filterData.country, instituteOption]);

  useEffect(() => {
    const filtered = instituteOption.filter((data) => {
      const isCountryMatch = filterData.country
        ? data.country === filterData.country
        : true;

      const isInstituteMatch = filterData.institutes
        ? data.instituteName === filterData.institutes
        : true;

      // Modified search logic to check both instituteName and country
      const isSearchMatch = filterData.search
        ? data.instituteName
            .toLowerCase()
            .includes(filterData.search.toLowerCase()) ||
          data.country.toLowerCase().includes(filterData.search.toLowerCase()) // Search by country as well
        : true;

      return isCountryMatch && isInstituteMatch && isSearchMatch;
    });

    const updatedInstitutes = filtered.map((institute) => {
      const isShortlisted = shortlistedUniversities?.some(
        (item) => item.instituteId?._id === institute?._id
      );
      return {
        ...institute,
        status: isShortlisted ? "added" : "removed",
      };
    });

    setFilteredInstitutes(updatedInstitutes);
  }, [filterData, instituteOption, shortlistedUniversities]);

  const shortlistInstitute = async (instituteId) => {
    try {
      const res = await shortlistAdd(instituteId);
      toast.success(res.message || "University shortlisted");
      dispatch(shortlistedData());
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const isFilterApplied = !!(
    filterData.country ||
    filterData.institutes ||
    filterData.search
  );

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AgentSidebar />
        </span>
      </div>
      <div>
        <span className="flex md:flex-row sm:flex-col items-center mt-20 md:ml-[16.5%] sm:ml-[22%]">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Explore: Colleges & Universities
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Discover colleges worldwide tailored to your study abroad dreams.
              Filter and Search by country and institutions to find the perfect
              match for your educational journey.
            </p>
          </span>
          <span className="flex flex-row items-center md:ml-20 sm:mt-6 md:mr-6 sm:mr-3 ">
            <CustomInput
              className="h-11 w-80 rounded-md placeholder:px-3  pl-9 border border-[#E8E8E8] outline-none"
              type="text"
              placeHodler="Search by Country & Universities"
              name="search"
              value={filterData.search}
              onChange={handleInput}
            />
            <span className="absolute pl-2 text-[20px] text-body">
              <IoSearchOutline />
            </span>
          </span>
        </span>
        <span className="grid grid-cols-2 gap-8 md:mr-[40%] md:ml-[19%] sm:ml-[27%] sm:mr-[20%]">
          <CountrySelect
            notImp={true}
            name="country"
            label="Country"
            options={prefCountryOption}
            customClass="bg-white"
            value={filterData.country}
            handleChange={handleInput}
          />
          {/* Only show institute dropdown if a country is selected */}

          <InstituteComponent
            imp={false}
            name="institutes"
            label="University & Institutes"
            options={filterData.country ? filteredInstituteOptions : []}
            customClass="bg-white"
            value={filterData.institutes}
            handleChange={handleInput}
          />
        </span>
      </div>

      {/* Loading and data handling */}
      {isLoading ? (
        <div className="w-1 ml-[53%]">
          <Loader />
        </div>
      ) : !isFilterApplied ? (
        <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={noInstitute}
            headingText="Start Your Journey!"
            bodyText="Apply a filter by country, institution, or search to view universities."
          />
        </p>
      ) : filteredInstitutes.length === 0 ? (
        <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={noInstitute}
            headingText="No results found"
            bodyText="Try adjusting your filters to find universities."
          />
        </p>
      ) : (
        <>
          <p className="mt-1 font-medium text-body pr-[20%] md:ml-[19%] sm:ml-[27%]">
            Showing {filteredInstitutes.length} of {instituteOption.length}{" "}
            universities
          </p>
          <p className="text-[24px] font-semibold text-sidebar md:ml-[19%] sm:ml-[27%]">
            All universities and colleges
          </p>
          <div className="md:ml-[19%] sm:ml-[27%] mt-6 grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 mx-6 md:gap-6 sm:gap-4">
            {filteredInstitutes.map((data) => (
              <InstituteCard
                key={data._id}
                instituteId={data._id}
                institutename={data.instituteName}
                country={data.country}
                status={data.status}
                shortlistInstitute={shortlistInstitute}
                link="/agent/student-lists"
                customState={{
                  country: data.country,
                  institute: data.instituteName,
                }}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Institution;
