import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { dnf } from "../assets";
const Dnf = ({headingText, bodyText, dnfImg,isButton, buttonText}) => {
  return (
    <>
        <div className="bg-white mx-28  mb-20 pt-12 pb-12 flex flex-col  justify-center items-center rounded-md ">
          <img src={dnfImg} alt="img" className="w-44 h-44" />
          <p className="text-sidebar font-semibold mt-3 text-[24px]">
       {headingText}
          </p>
          <p className=" text-body font-normal mt-3 md:x-20 text-[15px] text-center">
           {bodyText}
          </p>
{isButton === true &&
          <span className="bg-primary text-white rounded-md px-6 py-2 mt-6 cursor-pointer">{buttonText}</span>
}
        </div>
    </>
  );
};

export default Dnf;




export const DataNotFound = ({ message, linkText, linkDestination, className }) =>
{
  return (
    <span className={className}>
      <img src={dnf} alt="img" className='w-44 ' />
      <p className='font-DMsans mt-6  text-center'>{message}</p>
      {/* <Link to={linkDestination} className='mt-3 bg-primary rounded-lg text-white py-1 px-3'>
        {linkText}
      </Link> */}
    </span>
  );
};

function BackArrow({ className , LinkData})
{
  const navigate = useNavigate();

  const goBack = () => {
    
      navigate(-1); 
    
   
  };
  return (
    <span className={className}>
      <span onClick={goBack}>
      <span className='flex items-center bg-primary md:bg-transparent sm:bg-transparent  text-white py-6 px-6'>
        <IoArrowBackOutline className="md:text-primary sm:text-primary text-[28px] cursor-pointer" />
        <span> Back</span>
        </span>
      </span>
    </span>
  )
}
