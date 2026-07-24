import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import { Purchase } from "../models/purchase.js";
import Course from "../models/course.js";


// API controller fucntion to manage clerk user with database 


const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }

                await User.create(userData)
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + "" + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }


            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export default clerkWebhooks;

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

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
    console.log("Webhook Verification Failed:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Session:", session.id);
        console.log("Metadata:", session.metadata);

        const purchaseId = session.metadata.purchaseId;

        if (!purchaseId) {
          console.log("Purchase ID not found in metadata");
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

        if (!course.enrolledStudents.includes(user._id)) {
          course.enrolledStudents.push(user._id);
          await course.save();
        }

        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }

        purchase.status = "completed";
        await purchase.save();

        console.log("Payment Completed");

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;

        if (!purchaseId) break;

        const purchase = await Purchase.findById(purchaseId);

        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }

        console.log("Payment Failed");

        break;
      }

      default:
        console.log(`Unhandled Event: ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.log("Webhook Processing Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};











