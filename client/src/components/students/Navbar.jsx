import React, { useContext } from 'react'
import { assets } from '../../assets/assets.js'
import { data, Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const location = useLocation()
  const isCourseListPage = location.pathname.includes('/course-list');
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { navigate, isEducator, backend_url, setIsEducator, getToken } = useContext(AppContext)

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const { data } = await axios.get(backend_url + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className={`flex justify-between py-3 items-center px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/7'}`}>
      <Link to='/'><img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-20 lg:w-32 cursor-pointer' />
      </Link>
      <div className='md:flex gap-3 text-gray-500 items-center hidden'>
        <div>
          {user && <> <button onClick={becomeEducator} className='cursor-pointer'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
            <Link to='/my-enrollments' className='cursor-pointer'>  My Enrollment </Link></>}
        </div>
        {user ? <UserButton /> : <button onClick={() => openSignIn()} className='cursor-pointer bg-blue-600 rounded-3xl text-white px-5 py-2'>Create Account</button>}
      </div>

      {/* Mobile Screen  */}

      <div className='md:hidden flex text-sm items-center gap-2 sm:gap-5 text-gray-500'>
        {user && <> <button onClick={becomeEducator} className='cursor-pointer'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> |
          <Link to='/my-enrollments' className='cursor-pointer'>  My Enrollment </Link></>}
        {user ? <UserButton /> : <button onClick={() => openSignIn()} className='cursor-pointer bg-blue-600 rounded-3xl text-white px-5 py-2'>Create Account</button>}
      </div>
    </div>
  )
}

export default Navbar