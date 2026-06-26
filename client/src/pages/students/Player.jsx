import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Rating from "../../components/students/Rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  // Get Course Data
  const getCourseData = () => {
    const course = enrolledCourses.find(
      (course) => course._id === courseId
    );

    if (course) {
      setCourseData(course);
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
    getCourseData();
  }, [courseId, enrolledCourses]);

  return (
    <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
      {/* Left Column */}
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold">Course Structure</h2>

        <div className="py-5">
          {courseData?.courseContent?.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border border-gray-300 bg-white mb-2 rounded"
            >
              <div
                onClick={() => toggleSection(chapterIndex)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <img
                    className={`transition-transform ${
                      openSections[chapterIndex]
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                    src={assets.down_arrow_icon}
                    alt=""
                  />

                  <p>{chapter.chapterTitle}</p>
                </div>

                <p className="text-sm">
                  {chapter.chapterContent.length} Lectures •{" "}
                  {calculateChapterTime(chapter)}
                </p>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSections[chapterIndex]
                    ? "max-h-[600px]"
                    : "max-h-0"
                }`}
              >
                <ul className="list-disc pl-6 pr-4 py-2 border-t border-gray-300">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <li
                      key={lectureIndex}
                      className="flex items-start gap-2 py-2"
                    >
                      <img
                        src={assets.play_icon}
                        alt=""
                        className="w-4 h-4 mt-1"
                      />

                      <div className="flex justify-between w-full items-center">
                        <p className="text-sm text-gray-800">
                          {lecture.lectureTitle}
                        </p>

                        <div className="flex items-center gap-3 text-sm">
                          {lecture.lectureUrl && (
                            <button
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: chapterIndex + 1,
                                  lecture: lectureIndex + 1,
                                })
                              }
                              className="text-blue-600 hover:underline"
                            >
                              Watch
                            </button>
                          )}

                          <p className="text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              {
                                units: ["h", "m"],
                              }
                            )}
                          </p>
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
          <Rating initialRating={0} />
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

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{false ? 'Complete':'Mark Complete'}
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
  );
};

export default Player;