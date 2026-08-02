import express, {type Application, type Request, type Response } from "express";

const app: Application = express();

// app.use(cors({
//     origin: config.app_url,
//     credentials: true,
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());


app.get("/",(req: Request,res: Response)=>{
    res.send("FixItNow-Backend is running");
})

export default app;