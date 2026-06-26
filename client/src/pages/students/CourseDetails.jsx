import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/students/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Youtube from 'react-youtube'


const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)
  const { allCourses, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLecture, currency } = useContext(AppContext)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses])


  const toggleSection = (index) => {
    setOpenSections((prev) => (
      { ...prev, [index]: !prev[index], }
    ))

  }


  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-revers min-h-screen  gap-10 relative items-start justify-between md:px-8  md:pt-20 text-left '>

        <div className='absolute top-0 left-0 w-full h-[500px] -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* Left Column  */}

        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm'
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription
            }}
          />


          {/* Review and rating  */}

          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} key={i} alt="" />))}

            </div>
            <p className=' text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'rating' : 'ratings'})</p>

            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'student' : 'students'}</p>
          </div>

          <p className='text-sm'>
            Course by <span className='text-blue-600 underline'>Prashant</span>
          </p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>

            <div className='py-5'>
              {
                courseData.courseContent.map((chapter, index) => (
                  <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                    <div onClick={() => toggleSection(index)} className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'>
                      <div className='flex items-center gap-2'>
                        <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : 'rotate-0'}`} src={assets.down_arrow_icon} alt="arrow_icon" />
                        <p>{chapter.chapterTitle}</p>
                      </div>
                      <p className='text-sm md:text-default'>{chapter.chapterContent.length} Lectures - {calculateChapterTime(chapter)}</p>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className='list-disc mg:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                        {chapter.chapterContent.map((lecture, index) => (
                          <li key={index} className='flex items-start gap-2 py-1'>
                            <img src={assets.play_icon} alt="play_icon" className='w-4 h-4 mt-1 ' />

                            <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                              <p>{lecture.lectureTitle}</p>
                              <div className='flex gap-2'>
                                {lecture.isPreviewFree && <p onClick={() =>
                                  setPlayerData({
                                    videoId: lecture.lectureUrl.split('/').pop(),
                                  })
                                } className='text-blue-500 cursor-pointer'>Preview</p>}
                                <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                              </div>
                            </div>

                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              }
            </div>

          </div>


          <div className='py-20 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-4
    [&_h2]:text-[black] [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-3
    [&_h3]:text-2xl [&_h3]:font-medium [&_h3]:mb-2
    [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-gray-700
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
    [&_li]:mb-2
    [&_a]:text-blue-600 [&_a]:underline
    [&_img]:rounded-lg [&_img]:my-4 [&_img]:w-full
    [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic
  "'
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription
              }}
            />
          </div>


        </div>


        {/* Right Column   */}

        <div className='max-w-[424px] shadow-2xl z-10 rounded-t md:rounded-b-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {

            playerData ? (
              <Youtube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
            ) : <img src={courseData.courseThumbnail} alt="" />
          }
          <div className='p-5'>
            <div className='flex items-center gap-2'>

              <img
                src={assets.time_clock_icon}
                alt="time_left_clock_icon"
              />



              <p className='text-red-500'> <span className='font-medium'>5 Days</span> left at this price</p>
            </div>

            <div className='flex gap-3 items-center pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
              <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>

            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star_icon" />
                <p>{calculateRating(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock_icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="clock_icon" />
                <p>{calculateNoOfLecture(courseData)} Lessons</p>
              </div>

            </div>

            <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium '>{isAlreadyEnrolled ? 'Already Enrolled' : 'Enrolled Now'}</button>

            <div className='pt-6 '>
              <p className='md:text-xl text-lg fomt-medium text-gray-800'>What's in the course</p>
              <ul className='ml-4 pt-2 text-sm md:text-text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates</li>
                <li>Lifetime access with free updates</li>
                <li>Lifetime access with free updates</li>
                <li>Lifetime access with free updates</li>
                <li>Lifetime access with free updates</li>

              </ul>
            </div>

          </div>
        </div>

      </div>
    </>
  ) : <Loading />
}

export default CourseDetails