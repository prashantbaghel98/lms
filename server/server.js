import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import clerkWebhooks from "./controllers/webhooks.js";



// Intialize Express 

const app = express()

// Connect DB 

await connectDB()


// Middleware 

app.use(cors())




// Routes 

app.get('/',(req,res)=>{
    res.send('API Working')
})

app.post('/clerk',express.json(),clerkWebhooks);


// Port 

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})