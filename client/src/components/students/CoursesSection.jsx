import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <div className='max-w-l py-16 md:px-30 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className=' mb-5 text-sm md:text-base mt-3 text-gray-500'>Discover our top-rated courses across various categories. From coding and design to <br></br> business and wellness, our courses are crafted to deliver results.</p>


      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:py-16 my-10 gap-4'>
        {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
      </div>

      <Link to='/all-courses' onClick={() => scrollTo(0, 0)} className=' text-gray-500 border border-gray-500/30 px-10 py-3 rounded'>Show All Courses</Link>
    </div>
  )
}

export default CoursesSection