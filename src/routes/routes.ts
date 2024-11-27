import { Router } from "express";
import auth from "./auth"

const api = Router()
    .use("/auth", auth)


export default Router().use("/api", api)