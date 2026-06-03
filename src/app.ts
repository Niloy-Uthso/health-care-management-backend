import express, { Application, NextFunction, Request, Response } from "express";
import { SpecialtyRoute } from "./app/modules/specialty/specialty.route";
import { AuthRouter } from "./app/modules/auth/auth.router";
import { success } from "better-auth";
import { globalErrorHandler } from "./app/middleware/globalerrorhandlaer";
import { notfound } from "./app/middleware/notfound";
import { userRoute } from "./app/modules/user/user.route";
import { doctorRoute } from "./app/modules/docotor/doctor.router";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/specialty",SpecialtyRoute)

app.use("/api/v1/auth", AuthRouter)

app.use("/api/v1/user",userRoute)

app.use("/api/v1/doctor",doctorRoute)

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
 app.use(globalErrorHandler)
 app.use(notfound)
export default app 