import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'
import { Link } from 'react-router-dom'


const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our<br></br>
        platform has made a difference in their lives.</p>

      <div className='max-w-4xl grid grid-cols-3 gap-8 mt-14'>
        {dummyTestimonial.map((Testimonial, index) => (
          <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg overflow-hidden'>
            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
              <img className='h-12 w-12 rounded-full' src={Testimonial.image} alt={Testimonial.name} />

              <div>
                <h1 className='text-lg font-medium text-gray-800'>{Testimonial.name}</h1>
                <p className='text-gray-800/80'>{Testimonial.role}</p>
              </div>

            </div>
            <div className='p-5 pb-0'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={i < Math.floor(Testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className='text-gray-500 my-5'>{Testimonial.feedback}</p>
              <a href='#' className=' underline text-blue-500'>Read more</a> 
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSection