import React from 'react'
import Hero from '../../components/students/Hero'
import Companies from '../../components/students/Companies'
import CoursesSection from '../../components/students/CoursesSection'
import TestimonialSection from '../../components/students/TestimonialSection'
import CallToAction from '../../components/students/CallToAction'

const Home = () => {
  return (
   <div className='flex flex-col items-center space-y-7 text-center'>
   <Hero/>
   <Companies/>
   <CoursesSection/>
   <TestimonialSection/>
   <CallToAction/>
   </div>
  )
}

export default Home