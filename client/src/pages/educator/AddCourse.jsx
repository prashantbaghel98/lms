import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import uniqid from "uniqid";
import { assets } from "../../assets/assets";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name");

      if (!title) return;

      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder:
          chapters.length > 0
            ? chapters[chapters.length - 1].chapterOrder + 1
            : 1,
      };

      setChapters([...chapters, newChapter]);
    }

    if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    }

    if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle) return;

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, lectureDetails],
          };
        }

        return chapter;
      })
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });

    setShowPopup(false);
  };

  const removeLecture = (chapterId, lectureIndex) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            chapterContent: chapter.chapterContent.filter(
              (_, index) => index !== lectureIndex
            ),
          };
        }

        return chapter;
      })
    );
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-y-auto p-4 md:p-8">
      <form className="flex flex-col gap-6 max-w-3xl">

        {/* Course Title */}
        <div>
          <p>Course Title</p>
          <input
            className="border rounded p-2 w-full"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <p>Course Description</p>
          <div
            ref={editorRef}
            className="border rounded min-h-[180px]"
          ></div>
        </div>

        {/* Price */}
        <div>
          <p>Price</p>
          <input
            type="number"
            className="border rounded p-2"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <p>Thumbnail</p>

          <label className="cursor-pointer">
            <img
              src={assets.file_upload_icon}
              alt=""
              className="w-14"
            />

            <input
              hidden
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="w-20 mt-2"
            />
          )}
        </div>

        {/* Discount */}
        <div>
          <p>Discount %</p>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded p-2 w-24"
          />
        </div>

        {/* Chapters */}
        <div>

          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.chapterId}
              className="border rounded mb-4 bg-white"
            >
              <div className="flex justify-between items-center p-4 border-b">

                <div className="flex items-center">

                  <img
                    src={assets.dropdown_icon}
                    alt=""
                    width={15}
                    onClick={() =>
                      handleChapter("toggle", chapter.chapterId)
                    }
                    className={`cursor-pointer mr-2 ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                  />

                  <span>
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>

                </div>

                <div className="flex gap-4 items-center">

                  <span>
                    {chapter.chapterContent.length} Lectures
                  </span>

                  <img
                    src={assets.cross_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={() =>
                      handleChapter("remove", chapter.chapterId)
                    }
                  />

                </div>

              </div>

              {!chapter.collapsed && (
                <div className="p-4">

                  {chapter.chapterContent.map((lecture, index) => (
                    <div
                      key={index}
                      className="flex justify-between mb-2"
                    >
                      <span>
                        {index + 1}. {lecture.lectureTitle} -{" "}
                        {lecture.lectureDuration} mins -{" "}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          Link
                        </a>{" "}
                        -{" "}
                        {lecture.isPreviewFree
                          ? "Free Preview"
                          : "Paid"}
                      </span>

                      <img
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer"
                        onClick={() =>
                          removeLecture(chapter.chapterId, index)
                        }
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-gray-100 rounded px-3 py-2 mt-2"
                    onClick={() => {
                      setCurrentChapterId(chapter.chapterId);
                      setShowPopup(true);
                    }}
                  >
                    + Add Lecture
                  </button>

                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="bg-blue-100 p-2 rounded"
            onClick={() => handleChapter("add")}
          >
            + Add Chapter
          </button>

        </div>

        <button
          className="bg-black text-white px-8 py-3 rounded w-fit"
          type="submit"
        >
          ADD
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[500px] relative">

            <h2 className="font-semibold mb-4">Add Lecture</h2>

            <input
              placeholder="Lecture Title"
              className="border p-2 rounded w-full mb-3"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
            />

            <input
              placeholder="Duration"
              className="border p-2 rounded w-full mb-3"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
            />

            <input
              placeholder="Lecture URL"
              className="border p-2 rounded w-full mb-3"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
            />

            <label className="flex gap-2 mb-4">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: e.target.checked,
                  })
                }
              />
              Free Preview
            </label>

            <button
              type="button"
              className="bg-blue-500 text-white w-full py-2 rounded"
              onClick={addLecture}
            >
              Add Lecture
            </button>

            <img
              src={assets.cross_icon}
              alt=""
              className="absolute right-4 top-4 w-4 cursor-pointer"
              onClick={() => setShowPopup(false)}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;