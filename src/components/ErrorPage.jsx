import React from "react";
import { useNavigate } from "react-router-dom";
import { error } from "../assets";
const ErrorPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="text-center font-poppins ">
        <div className="flex justify-center items-center md:mt-12 sm:mt-80 mt-28 ">
          <img src={error} alt="img" className="w-[40vh]   md:w-[85vh]" />
        </div>
        {/* <p className="md:text-[30px] text-[28px] font-semibold">
          Oops! We couldn't find that page.
        </p> */}
        {/* <p className="md:text-[25px]">May be you find what you need here...</p> */}

        <span onClick={handleNavigate}>
          <button className="bg-primary text-white mt-9 px-[6vh] py-2 rounded-lg hover:bg-transparent hover:border hover:border-primary hover:text-primary ">
            Back to Page{" "}
          </button>
        </span>
      </div>
    </>
  );
};

export default ErrorPage;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { missing } from "../assets";
// import Footer from "./Footer";
// const ErrorPage = () => {
//   const navigate = useNavigate();
//   const handleNavigate = () => {
//     navigate(-1);
//   };
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="text-center font-poppins ">
//         <div className="flex justify-center items-center md:mt-20 sm:mt-64 mt-28 md:gap-24 sm:gap-10  xl:mt-48">
//           <img src={missing} alt="img" className="w-[40vh]   md:w-[65vh] xl:w-[50vh] sm:w-[30vh]" />
//           <span className="text-[#464255]">
//             <p className="text-[40px] font-bold text-start">
//               OOPS! <br />
//               NOT FOUND
//             </p>
//             <p className="text-start">
//               Couldn’t find that. Do you want to return to <br />
//               the<span className="text-primary font-semibold cursor-pointer" onClick={handleNavigate}> previous page?</span>
//             </p>
//           </span>
//         </div>
//         {/* <p className="md:text-[30px] text-[28px] font-semibold">
//           Oops! We couldn't find that page.
//         </p> */}
//         {/* <p className="md:text-[25px]">May be you find what you need here...</p> */}

     
//       </div>
//       <footer className="mt-auto">
//       <Footer/>
//       </footer>
//     </div>
//   );
// };

// export default ErrorPage;
