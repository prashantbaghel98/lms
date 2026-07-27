import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/students/Loading'
import { assets, dummyDashboardData } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null)
  const { currency, backend_url, getToken, isEducator } = useContext(AppContext)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backend_url + '/api/educator/dashboard', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setDashboardData(data.educatorDashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator])



  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-4 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

  {/* Total Enrollments */}
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center gap-4">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100">
      <img src={assets.patients_icon} alt="Students" className="w-8 h-8" />
    </div>

    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        {dashboardData.enrolledStudentsData.length}
      </h2>
      <p className="text-gray-500 font-medium">
        Total Enrollments
      </p>
    </div>
  </div>

  {/* Total Courses */}
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center gap-4">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100">
      <img src={assets.appointments_icon} alt="Courses" className="w-8 h-8" />
    </div>

    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        {dashboardData.totalCourses}
      </h2>
      <p className="text-gray-500 font-medium">
        Total Courses
      </p>
    </div>
  </div>

  {/* Total Earnings */}
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center gap-4">
    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100">
      <img src={assets.earning_icon} alt="Earnings" className="w-8 h-8" />
    </div>

    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        {currency}
        {dashboardData.totalEarnings}
      </h2>
      <p className="text-gray-500 font-medium">
        Total Earnings
      </p>
    </div>
  </div>

</div>

        <div>
          <h2 className='pb-4 text-lg font-medium'>Latest Enrollements</h2>
          <div className='flex flex-col items-center max-w-xl w-ful overflow-hidden rounded-md bg-white border border-gray-500/20'>

            <table className='table-fixed md:table-auto w-full overflow-hidden'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student Name</th>
                  <th className='px-4 py-3 font-semibold'>Course Title</th>
                </tr>
              </thead>

              <tbody className='text-sm text-gray-500'>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='border-b border-gray-500/20'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>
                      {index + 1}
                    </td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img src={item.student.imageUrl} alt="profile" className='w-9 h-9 rounded-full' />
                      <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py03 truncate'>
                      {item.courseTitle}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
          <div>

          </div>
        </div>

      </div>
    </div>
  ) : <Loading />
}

export default Dashboard