import { Router } from "express";
import auth from "./auth"
import posts from "./posts"

const api = Router()
    .use("/auth", auth)
    .use("/posts", posts)


export default Router().use("/api", api)