import * as express from "express";
import { Request, Response, NextFunction } from 'express'

const router = express.Router();

router.post("/receive_msg", (request: Request, response: Response) => {
  let io = request.app.get("io");


});

module.exports = router;
