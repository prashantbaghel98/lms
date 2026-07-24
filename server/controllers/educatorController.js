import { clerkClient } from "@clerk/express";
import Course from "../models/course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.js";

// ==============================
// Update User Role to Educator
// ==============================
export const updateRoleToEducator = async (req, res) => {
    try {
        // Get logged-in user ID from Clerk
        const { userId } = req.auth();

        // Update user's public metadata
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator",
            },
        });
 
        res.json({
            success: true,
            message: "You can publish a course now",
        });
    } catch (error) {
        console.error("Update Role Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};

// ==============================
// Add New Course
// ==============================
export const addCourse = async (req, res) => {
    try {
        // Get educator ID from authenticated user
        const { userId: educatorId } = req.auth();

        // Get course data and uploaded image
        const { courseData } = req.body;
        const imageFile = req.file;

        // Check if thumbnail image is uploaded
        if (!imageFile) {
            return res.json({
                success: false,
                message: "Thumbnail not attached",
            });
        }

        // Convert course data from JSON string to object
        const parsedCourseData = JSON.parse(courseData);

        // Add educator ID to course object
        parsedCourseData.educator = educatorId;

        // Create course in MongoDB
        const newCourse = await Course.create(parsedCourseData);

        // Upload thumbnail image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        // Save Cloudinary image URL
        newCourse.courseThumbnail = imageUpload.secure_url;

        // Update course with thumbnail URL
        await newCourse.save();

        res.json({
            success: true,
            message: "Course Added Successfully",
        });
    } catch (error) {
        console.error("Add Course Error:", error);

        res.json({
            success: false,
            message: error.message,
        });
    }
};


// ==============================
// Get Educator Course
// ==============================


export const getEducatorCourses = async (req, res) => {
    try {
        const { userId: educator } = req.auth();
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}


// ==============================
// Get Educator Dashboard Data
// ==============================
export const educatorDashboardData = async (req, res) => {
  try {
    // Get logged-in educator ID from Clerk
    const { userId: educator } = req.auth();

    // Fetch all courses created by this educator
    const courses = await Course.find({ educator });

    // Calculate total number of courses
    const totalCourses = courses.length;

    // Extract all course IDs
    const courseId = courses.map(course => course._id);

    // ==============================
    // Calculate Total Earnings
    // ==============================

    // Fetch all completed purchases for educator's courses
    const purchases = await Purchase.find({
      courseId: { $in: courseId },
      status: "completed",
    });

    // Calculate total earnings from completed purchases
    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // ==============================
    // Collect Enrolled Students Data
    // ==============================

    const enrolledStudentsData = [];

    // Loop through each course
    for (const course of courses) {
      // Fetch enrolled students for the current course
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      // Store course title along with student details
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    // Send dashboard data to frontend
    res.json({
      success: true,
      educatorDashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    console.error("Educator Dashboard Error:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Get Enrolled Students Data
// ==============================
export const getEnrolledStudentsData = async (req, res) => {
  try {
    // Get logged-in educator ID from Clerk
    const { userId: educator } = req.auth();

    // Fetch all courses created by this educator
    const courses = await Course.find({ educator });

    // Extract all course IDs
    const courseIds = courses.map((course) => course._id);

    // ==============================
    // Fetch Completed Purchases
    // ==============================

    // Get all completed purchases for educator's courses
    // Populate student details and course title
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    // ==============================
    // Format Enrolled Students Data
    // ==============================

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    // Send response
    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error("Get Enrolled Students Error:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};