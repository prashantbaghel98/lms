import { clerkClient } from "@clerk/express";

// Protect Educator Routes
export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please sign in.",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  } catch (error) {
    console.error("Protect Educator Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};