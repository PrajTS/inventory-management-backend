import { authProxy } from "@middlewares/Proxy";
import { userManagementMicroserviceUrl } from "@services/util";
import { CONSTANTS } from "@shared/constants";
import logger from "@shared/Logger";
import axios from "axios";
import { Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import StatusCodes from "http-status-codes";
import _ from "lodash";

const router = Router();
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { extend = false } = req.query;
    const { userCred, email, phoneNumber, password } = req.body;
    const { data: user } = await axios.post(
      `${userManagementMicroserviceUrl()}/check-user-creds`,
      {
        ...(userCred && { userCred }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        password,
      }
    );
    const userDetails = user.user;
    req.session.user = userDetails || {};
    if (extend) {
      req.session.cookie.maxAge = CONSTANTS.COOKIE_MAX_AGE_EXTENDED_MILLIS;
    }
    const userResponse = {
      user: {
        userCred: userDetails.userCred,
        fullName: userDetails.fullName,
        displayPicture: userDetails.displayPicture,
      },
    };
    return res.status(OK).send(userResponse);
  } catch (e) {
    logger.err(e);
    return res.status(UNAUTHORIZED).send(_.get(e, "response.data"));
  }
});

router.get("/me", (req: Request, res: Response) => {
  const user = _.get(req, "session.user");
  if (user) {
    const userResponse = {
      user: {
        userCred: user.userCred,
        fullName: user.fullName,
        displayPicture: user.displayPicture,
      },
    };
    res.status(OK).send(userResponse);
  } else {
    res.status(UNAUTHORIZED).end();
  }
});

router.get("/logout", (req: Request, res: Response) => {
  if (req.session.user) {
    req.session.destroy((err: any) => {
      if (err) {
        res.status(INTERNAL_SERVER_ERROR).send("Unable to logout");
      } else {
        res.status(OK).end();
      }
    });
  } else {
    res.status(BAD_REQUEST).send("User was not logged it.");
  }
});

router.use(
  "/",
  authProxy,
  createProxyMiddleware({
    target: process.env.AUTHENTICATOR_MICROSERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: Request) => {
      if (req?.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

export default router;
