import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import  {clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';



// Intialize Express 
const app = express()

// Connect DB 

await connectDB()
await connectCloudinary()


// Middleware 

app.use(cors())
app.use(clerkMiddleware())




// Routes 

app.get('/',(req,res)=>{res.send('API Working')})
app.post('/clerk',express.json(),clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)


// Local development server
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(
            `Server is running on port ${PORT}`
        );
    });
}

// Export Express app for Vercel
export default app;