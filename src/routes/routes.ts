import { Router } from "express";
import auth from "./auth"
import posts from "./posts"
import tests from "./tests"

const api = Router()
    .use("/auth", auth)
    .use("/posts", posts)
    .use("/tests", tests)


export default Router().use("/api", api)