import express, { json } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes/routes"
const app = express()
const PORT = 3000

dotenv.config({ path: "../.env" });
app.use(cors())
app.use(json())
app.use(cookieParser())
app.use(routes)

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})