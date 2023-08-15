import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./"
import {register} from "./controllers/auth.js";/* creating my own controller register*/


/* middleware configuration */
const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet);
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


/* File storage 
Everytime somebody upload any file then it will save in public/assets folder.*/ 
const storage=multer.diskStorage({
    destination: function(req, file, cb ){
        cb(null,"public/assets")
    },
    filename:function(req, file, cb){
        cb(null,file.originalname); 
    }
});
const upload=multer({storage});

/*Routing with files */
app.post("/auth/register",upload.single("picture"),register); /*here picture will be uploaded in public assets folder and register controller will be invoked.

/*Routes */
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.post("/posts",postRoutes);

/*Mongoose Setup */
const PORT =process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port:${PORT}`));
})
.catch((error)=>console.log(`${error} did not connect`));
