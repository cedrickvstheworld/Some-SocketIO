import * as express from "express"
import { Request, Response, NextFunction } from "express"
import * as passport from "passport"

class Router {
  public router: any

  constructor() {
    this.router = express.Router()
  }

  public preparedRoutes() {
    // check if request is authenticated
    this.router.post("/checkAuth", (request: Request, response: Response) => {
      if (request.isAuthenticated()) {
        return response.status(200).json({ user: request.user })
      }
      return response.sendStatus(403)
    })

    // google oauth routes
    this.router.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile email"] })
    )

    this.router.get(
      "/google/auth/redirect",
      passport.authenticate("google"),
      (request: Request, response: Response) => {
        console.log("callback URI reached")
        console.log(request.isAuthenticated())
        console.log(request.user)
        response.redirect("http://localhost:3000/main")
      }
    )

    // facebook oauth routes
    this.router.get("/auth/facebook", passport.authenticate("facebook"))

    this.router.get(
      "/facebook/auth/redirect",
      passport.authenticate("facebook"),
      (request: Request, response: Response) => {
        console.log("callback URI reached facebook")
        console.log(request.user)
        response.redirect("http://localhost:3000/main")
      }
    )

    // logout
    this.router.post("/logout", (request: Request, response: Response) => {
      request.logout()
      response.sendStatus(200)
    })
    
    return this.router
  }
}

export default new Router();
