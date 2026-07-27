import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Rating from "../../components/students/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/students/Loading";

const Player = () => {
  const { enrolledCourses, calculateChapterTime, backend_url, getToken, userData, fetchUserEnrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null)
  const [intialRating, setIntialRating] = useState(0)

  // Get Course Data
  const getCourseData = () => {
    const course = enrolledCourses.find(
      (course) => course._id === courseId
    );

    if (course) {
      setCourseData(course);

      const rating = course.courseRatings?.find(
        (item) => item.userId === userData?._id
      );

      if (rating) {
        setIntialRating(rating.rating);
      }
    }
  };

  // Toggle Chapter
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Extract YouTube Video ID
  const getVideoId = (url) => {
    if (!url) return "";

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : "";
  };

  useEffect(() => {
    if (enrolledCourses.length && userData) {
      getCourseData();
    }
  }, [enrolledCourses, userData]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backend_url + '/api/user/update-course-progress', { courseId, lectureId }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        console.log(data)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backend_url + '/api/user/get-course-progress', { courseId }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setProgressData(
          data.progressData || {
            lectureCompleted: [],
          }
        );
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backend_url + '/api/user/add-rating', { courseId, rating }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(() => {
    getCourseProgress()
  }, [])

  return courseData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left Column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData?.courseContent?.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  onClick={() => toggleSection(index)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transform transition-transform ${openSections[index]
                        ? "rotate-180"
                        : " "
                        }`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />

                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>

                  <p className="text-sm md:text-default">
                    {chapter.chapterContent.length} Lectures -
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${openSections[index]
                    ? "max-h-96"
                    : "max-h-0"
                    }`}
                >
                  <ul className="list-disc pl-6 pr-4 py-2 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 py-2"
                      >
                        <img
                          src={
                            progressData?.lectureCompleted?.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt=""
                          className="w-4 h-4 mt-1"
                        />

                        <div className="flex justify-between w-full items-center">
                          <p className="">
                            {lecture.lectureTitle}
                          </p>

                          <div className="flex gap-2">
                            {lecture.lectureUrl && <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className="text-blue-500 cursor-pointer"> Preview
                            </p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={intialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right Column */}
        <div>
          {playerData ? (
            <div className="bg-white rounded-lg shadow">
              <YouTube
                videoId={getVideoId(playerData.lectureUrl)}
                iframeClassName="w-full aspect-video rounded-t-lg"
                opts={{
                  width: "100%",
                  playerVars: {
                    autoplay: 1,
                  },
                }}
              />

              <div className="flex justify-between items-center p-4">
                <p className="font-medium">
                  Chapter {playerData.chapter} • Lecture{" "}
                  {playerData.lecture}: {playerData.lectureTitle}
                </p>

                <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700">{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            courseData && (
              <img
                src={courseData.courseThumbnail}
                alt={courseData.courseTitle}
                className="w-full rounded-lg shadow"
              />
            )
          )}
        </div>
      </div>
    </>
  ) : <Loading />
};

export default Player;