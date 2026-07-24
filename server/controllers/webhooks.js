import { Webhook } from "svix";
import Stripe from "stripe";

import User from "../models/user.js";
import Course from "../models/course.js";
import { Purchase } from "../models/purchase.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================
// Clerk Webhook
// ==========================
export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.create(userData);

        return res.json({
          success: true,
          message: "User created",
        });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, userData);

        return res.json({
          success: true,
          message: "User updated",
        });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);

        return res.json({
          success: true,
          message: "User deleted",
        });
      }

      default:
        return res.json({
          success: true,
          message: "Unhandled Clerk event",
        });
    }
  } catch (error) {
    console.error("Clerk Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Stripe Webhook
// ==========================
export const stripeWebhooks = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("========== STRIPE WEBHOOK ==========");
    console.log("Event:", event.type);
  } catch (error) {
    console.error("Stripe Signature Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Session ID:", session.id);
        console.log("Metadata:", session.metadata);

        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) {
          console.log("Purchase ID missing");
          break;
        }

        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
          console.log("Purchase not found");
          break;
        }

        if (purchase.status === "completed") {
          console.log("Purchase already completed");
          break;
        }

        const user = await User.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (!user || !course) {
          console.log("User or Course not found");
          break;
        }

        if (!course.enrolledStudents.includes(String(user._id))) {
          course.enrolledStudents.push(String(user._id));
          await course.save();
        }

        const alreadyEnrolled = user.enrolledCourses.some(
          (id) => id.toString() === course._id.toString()
        );

        if (!alreadyEnrolled) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }

        purchase.status = "completed";
        await purchase.save();

        console.log("Purchase Updated Successfully");

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) break;

        const purchase = await Purchase.findById(purchaseId);

        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }

        console.log("Checkout Session Expired");

        break;
      }

      default:
        console.log(`Unhandled Event: ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};