/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ErrorAPIResp } from "@dtos/errorApiResponse";
import { User } from "@dtos/user";
import { CONSTANTS } from "@shared/constants";
import logger from "@shared/Logger";
import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import _ from "lodash";
import { RowDataPacket } from "mysql2";
import db from "../post-start/db";

const router = Router();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { extend = false } = req.query;
    const { username, password }: { username: string; password: string } =
      req.body;
    const [rows] = await (
      await db
    ).execute(`SELECT * FROM users where username=?`, [username]);
    const row = (<RowDataPacket>rows)[0];
    const userDetails: User = {
      id: row.id,
      username: row.username,
      password: row.password,
    };
    if (userDetails.password !== password) {
      return res
        .status(UNAUTHORIZED)
        .json(new ErrorAPIResp(UNAUTHORIZED, "Incorrect password", "Auth"));
    }

    const { id } = userDetails;
    req.session.user = { ...(id && { id }) };
    if (extend) {
      req.session.cookie.maxAge = CONSTANTS.COOKIE_MAX_AGE_EXTENDED_MILLIS;
    }
    const userResponse = {
      user: {
        username: userDetails.username,
      },
    };
    return res.status(OK).send(userResponse);
  } catch (e) {
    logger.err(e);
    return res
      .status(UNAUTHORIZED)
      .json(new ErrorAPIResp(UNAUTHORIZED, "Incorrect username", "Auth"));
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const sessionUser = _.get(req, "session.user");
    if (!_.isEmpty(sessionUser) && sessionUser.id) {
      const [rows] = await (
        await db
      ).execute(`SELECT * FROM users where id=?`, [sessionUser.id]);
      const row = (<RowDataPacket>rows)[0];
      const userDetails: User = {
        id: row.id,
        username: row.username,
        password: row.password,
      };
      if (_.isEmpty(row)) {
        throw "User does not exist";
      }
      const userResponse = {
        user: {
          username: userDetails.username,
        },
      };
      res.status(OK).send(userResponse);
    } else {
      throw "unauth";
    }
  } catch (e) {
    logger.err(e);
    res.status(UNAUTHORIZED).end();
  }
});

router.get("/logout", (req: Request, res: Response) => {
  if (req.session.user) {
    req.session.destroy((err: any) => {
      if (err) {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json(
            new ErrorAPIResp(INTERNAL_SERVER_ERROR, "Unable to logout", "Auth")
          );
      } else {
        res.status(OK).end();
      }
    });
  } else {
    res
      .status(BAD_REQUEST)
      .json(
        new ErrorAPIResp(BAD_REQUEST, "User session does not exist", "Auth")
      );
  }
});

export default router;
