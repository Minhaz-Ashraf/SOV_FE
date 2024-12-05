import React from 'react'
import { CustomInput } from './Input'

const Register = ({value,handleInput, errors, type, name, label, className, imp}) => {
  return (
<>
<div className="mt-6 text-[14px] text-secondary font-poppins">
          <span className="text-body-input ">{label} {imp}</span>
          <CustomInput
            className={`w-full h-12 bg-input  rounded-md mt-2 px-3 outline-none ${className}`}
            name={name}
            value={value}
            onChange={handleInput}
            type= {type}
            placeHodler={label}
          />
          {errors && <p className="text-red-500 mt-1 text-sm">{errors}</p>}
        </div>
</>  )
}

export default Register