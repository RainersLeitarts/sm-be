import express, { Request, Response } from "express"
import cors from "cors"
import routes from "./routes/routes"
const app = express()
const PORT = 3000

app.use(cors())

app.use(routes)

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})