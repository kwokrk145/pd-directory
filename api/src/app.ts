import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import session from "express-session";
import experienceRouter from './routes/experience';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    name: "pd.sid", // name of the session ID cookie
    secret: process.env.SESSION_SECRET!, // secret used to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/auth', authRoutes);
app.use('/experience', experienceRouter);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
export default app;