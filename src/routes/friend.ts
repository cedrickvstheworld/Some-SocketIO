import * as express from "express"
import { Request, Response, NextFunction } from "express"
const User = require('../models/users')

class Router {
  public router: any

  constructor() {
    this.router = express.Router();
  }

  private userAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (request.isAuthenticated()) {
      return next()
    }
    return response.status(403)
  }

  public preparedRoutes() {
    this.router.post(
      "/add_friend_request",
      this.userAuthenticated,
      (request: Request, response: Response) => {
        let user_name: string = request.body.user_name
        let user_id: string = request.body.user_id
        let friend_id: string = request.body.friend_id

        if (user_id === friend_id) {
          return response
            .status(400)
            .json({ error: "can't add self as a friend" })
        }

        User.findOne(
          {
            id: user_id
          },
          (error: string, user: any) => {
            if (error) {
              console.log(error)
            }

            for (let i in user.friend_requests) {
              if (user.friend_requests[i].id === friend_id) {
                return response.status(400).json({
                  error: "This user had already sent you a friend request"
                })
              }
            }
          }
        );

        User.findOne(
          {
            id: friend_id
          },
          (error: string, user: any) => {
            if (error) {
              console.log(error)
            }

            if (!user) {
              return response.status(404).json({ error: "user not found" })
            }

            // verify if already had requested{
            for (let i in user.friend_requests) {
              if (user.friend_requests[i] === user_id) {
                return response
                  .status(400)
                  .json({ error: "request had already sent to this user" })
              }
            }

            User.findOneAndUpdate(
              {
                id: friend_id
              },
              {
                $push: {
                  friend_requests: user_id
                }
              },
              { new: true },
              (error: string, friend: any) => {
                if (error) {
                  console.log(error)
                }

                let new_friend_request = {
                  name: user_name,
                  id: user_id
                }

                let io_clients = request.app.get("io_clients")

                async function notifyUser() {
                  return await io_clients.forEach((io_client: any) => {
                    if (io_client.client_id === friend_id) {
                      request.app
                        .get("io")
                        .to(`${io_client.connection_id}`)
                        .emit("new friend", new_friend_request)
                    }
                  })
                }

                notifyUser()

                response.status(200).json({ friend })
              }
            )
          }
        )
      }
    )
    return this.router
  }
}

export default new Router();
