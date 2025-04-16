import commonResponseType from "../../../static/static.json";
import { commonResponse } from "../../../lib/util";
import { Request, Response } from "express";
import { ObjectId } from "bson";
import { prisma } from "../../../database/db";
import { HttpStatusCode } from "axios";
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from "@prisma/client";

// Helper function to send success response
export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string
): void => {
  const response = commonResponse<any>(
    commonResponseType.RESPONSE_SUCCESS.TRUE,
    data,
    message
  );
  res.status(HttpStatusCode.Ok).json(response);
};

// Helper function to send error response
export const sendErrorResponse = (
  res: Response,
  errorMessage: string,
  statusCode: number
): void => {
  const response = commonResponse<any>(
    commonResponseType.RESPONSE_SUCCESS.FALSE,
    null,
    errorMessage
  );
  res.status(statusCode).json(response);
};

// send the create success response
export const SendCreateSuccessResponse = (
  res: Response,
  data: any,
  message: string
): void => {
  const response = commonResponse<any>(
    commonResponseType.RESPONSE_SUCCESS.TRUE,
    data,
    message
  );
  res.status(HttpStatusCode.Created).json(response);
};

// check mongodb object key
export const checkObjectKey = (id: string): boolean => {
  return ObjectId.isValid(id);
};

// Check if all elements in the array are valid MongoDB ObjectIds
export const checkObjectKeyArray = (ids: Array<{ id?: string }>): boolean => {
  console.log("ids: ", ids);
  return ids.every((item) => {
    // Skip if the id field is not present
    if (!item.id) {
      return true;
    }
    // Check if the available id is a valid ObjectId
    return ObjectId.isValid(item.id);
  });
};

// check pass id are exist or not
export const checkUser = () => {};


// decode access token
export const decodeAccessToken = async (token: string) => {
  const decoded = jwtDecode(token);
  console.log(decoded);
  return decoded;
};

// find data based on objectId
export const findRecordOnObjectId = async (
  modelName: keyof PrismaClient,
  id: string
) => {
  // Dynamically access the model based on modelName with type casting
  const model = prisma[modelName as keyof typeof prisma];

  // if (!model) {
  //   throw new Error(`Model ${model} does not exist in Prisma client.`);
  // }

  // Fetch the data based on ObjectId
  const data = await (model as any).findUnique({
    where: {
      id: id,
    },
  });

  return data;
};
