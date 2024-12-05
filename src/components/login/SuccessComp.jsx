import React from 'react'
import { greenCheck } from '../../assets'

export const SuccessComp = () => {
  return (
    <>
        <div className='flex flex-col justify-center w-full items-center'>
            <img src={greenCheck} alt="img" loading='lazy'  className='w-24 h-24'/>

            <p className='text-secondary font-poppins text-[22px] mt-6'>Password changed successfully!</p>
            <p className='text-green-500 font-poppins text-[16px]'>We’re redirecting you to the login page...</p>
        </div>
    </>
  )
}
