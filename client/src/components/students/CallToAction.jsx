import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className=''>
      <h2 className='text-2xl md:text-3xl lg:text-4xl font-semibold'>Learn anything, anytime, anywhere</h2>
      <p className='my-5'>Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.</p>
      <div className='flex gap-5 justify-center '>
        <button className='border px-10 py-3 text-white bg-blue-700 rounded-md'>Get started</button>
        <button className=' flex items-center gap-2'>Learn more <img src={assets.arrow_icon} alt="arrow_icon" /></button>
      </div>
    </div>
  )
}

export default CallToAction