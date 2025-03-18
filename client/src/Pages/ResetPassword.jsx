import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSend, setIsEmailSend] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

   const inputRef = React.useRef([])
  
    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
        inputRef.current[index+1].focus();
      }
    }
  
    const handleKeyDown = (e, index) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRef.current[index-1].focus();
      }
    }
  
    //function to handle paste feature of OTP
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('')
      pasteArray.forEach((char, index) => {
        if (inputRef.current[index]) {
          inputRef.current[index].value = char;
        }
      });
    } 

    const onSubmitEmail = async (e) => {
      e.preventDefault();

      try {
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
        if (data.success) {
          toast.success(data.message)
          data.success && setIsEmailSend(true);
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRef.current.map(e => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmited(true)
    }

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
        if (data.success ) {
          toast.success(data.message)  
        } else {
          toast.error(data.message)
        }
       
        if (data.success) {
          navigate('/login')
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      

      {/* Enter Email Id */}

      {!isEmailSend && 

      <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter Your Register Email Address.</p>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.mail_icon} alt="" />
          <input type="email" placeholder='Email Id' className='w-full bg-transparent outline-none text-white'
          value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
        mt-3'>Submit</button>
      </form>
    }


      {/* OTP Input Form */}

      {!isOtpSubmited && isEmailSend &&
      <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code send to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index)=>(
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center
            text-xl rounded-md' ref={e => inputRef.current[index] = e } onInput={(e) => handleInput(e, index)} 
            onKeyDown={(e) => handleKeyDown(e, index)} />
          ))}
        </div>

        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
          Submit</button>
       </form>
      }


       {/* Enter New Password */}

      {isOtpSubmited && isEmailSend &&
      <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.lock_icon} alt="" />
          <input type="password" placeholder='Password' className='w-full bg-transparent outline-none text-white'
          value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>

        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
        mt-3'>Submit</button>
      </form>
    }
    </div>
  )
}

export default ResetPassword