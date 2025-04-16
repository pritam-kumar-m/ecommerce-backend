import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { commonResponse } from "../../lib/util";
import commonResponseType from "../../static/static.json";
import { sendErrorResponse } from "../modules/services/commonFunction";
import { HttpStatusCode } from "axios";
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

interface CustomRequest extends Request {
  userData?: JwtPayload | string;
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return sendErrorResponse(
        res,
        "Token is missing",
        HttpStatusCode.BadRequest
      );
    }
    
    const parts = token.split(".");
    if (parts.length !== 3) {
      return sendErrorResponse(
        res,
        "Invalid token format",
        HttpStatusCode.BadRequest
      );
    }

    // Verify the token first
    try {
      const verifyToken = jwt.verify(
        token,
        process.env.AUTH_SECRET_KEY as Secret
      ) as JwtPayload;

      
      // If verification succeeds, decode the token
      const decoded = jwtDecode(token);
      
     

      // Find the user in the database
      const userData = await prisma.user.findFirst({
        where: {
          id: decoded.sub,
        },
      });
   

      if (!userData) {
        return sendErrorResponse(
          res,
          "User not found",
          HttpStatusCode.Unauthorized
        );
      }

      // Attach user data to request and continue
      req.userData = userData;
      next();
    } catch (verifyError) {
      if (verifyError instanceof jwt.TokenExpiredError) {
        return sendErrorResponse(
          res,
          "Token expired",
          HttpStatusCode.Unauthorized
        );
      } else if (verifyError instanceof jwt.JsonWebTokenError) {
        return sendErrorResponse(
          res,
          "Invalid token",
          HttpStatusCode.Unauthorized
        );
      } else {
        throw verifyError; // Re-throw unexpected errors
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle any other errors
    const response = commonResponse<any>(
      commonResponseType.RESPONSE_SUCCESS.FALSE,
      null,
      "Authentication failed",
      commonResponseType.RESPONSE_SUCCESS.TRUE
    );
    return res
      .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
      .json(response);
  }
};
