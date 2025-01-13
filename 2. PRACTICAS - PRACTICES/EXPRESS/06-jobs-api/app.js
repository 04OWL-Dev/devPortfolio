import dotenv from 'dotenv';
dotenv.config({ path: './06-jobs-api/starter/.env' });
import 'express-async-errors'
import connectDB from './db/connect.js';
import express from 'express';
import authMiddleware from './middleware/authentication.js';
const app = express();
app.use(express.json());

//security packages 
import helmet from 'helmet';
app.use(helmet());
import cors from 'cors';
app.use(cors());
import xss from 'xss-clean';
app.use(xss());
import rateLimiter from 'express-rate-limit';
app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))



import authRouter from './routes/auth.js';
app.use('/api/v1/auth', authRouter);

import jobsRouter from './routes/jobs.js'
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
