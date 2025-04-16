"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRecordOnObjectId = exports.decodeAccessToken = exports.checkUser = exports.checkObjectKeyArray = exports.checkObjectKey = exports.SendCreateSuccessResponse = exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const static_json_1 = __importDefault(require("../../../static/static.json"));
const util_1 = require("../../../lib/util");
const bson_1 = require("bson");
const db_1 = require("../../../database/db");
const axios_1 = require("axios");
const jwt_decode_1 = require("jwt-decode");
// Helper function to send success response
const sendSuccessResponse = (res, data, message) => {
    const response = (0, util_1.commonResponse)(static_json_1.default.RESPONSE_SUCCESS.TRUE, data, message);
    res.status(axios_1.HttpStatusCode.Ok).json(response);
};
exports.sendSuccessResponse = sendSuccessResponse;
// Helper function to send error response
const sendErrorResponse = (res, errorMessage, statusCode) => {
    const response = (0, util_1.commonResponse)(static_json_1.default.RESPONSE_SUCCESS.FALSE, null, errorMessage);
    res.status(statusCode).json(response);
};
exports.sendErrorResponse = sendErrorResponse;
// send the create success response
const SendCreateSuccessResponse = (res, data, message) => {
    const response = (0, util_1.commonResponse)(static_json_1.default.RESPONSE_SUCCESS.TRUE, data, message);
    res.status(axios_1.HttpStatusCode.Created).json(response);
};
exports.SendCreateSuccessResponse = SendCreateSuccessResponse;
// check mongodb object key
const checkObjectKey = (id) => {
    return bson_1.ObjectId.isValid(id);
};
exports.checkObjectKey = checkObjectKey;
// Check if all elements in the array are valid MongoDB ObjectIds
const checkObjectKeyArray = (ids) => {
    console.log("ids: ", ids);
    return ids.every((item) => {
        // Skip if the id field is not present
        if (!item.id) {
            return true;
        }
        // Check if the available id is a valid ObjectId
        return bson_1.ObjectId.isValid(item.id);
    });
};
exports.checkObjectKeyArray = checkObjectKeyArray;
// check pass id are exist or not
const checkUser = () => { };
exports.checkUser = checkUser;
// decode access token
const decodeAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, jwt_decode_1.jwtDecode)(token);
    console.log(decoded);
    return decoded;
});
exports.decodeAccessToken = decodeAccessToken;
// find data based on objectId
const findRecordOnObjectId = (modelName, id) => __awaiter(void 0, void 0, void 0, function* () {
    // Dynamically access the model based on modelName with type casting
    const model = db_1.prisma[modelName];
    // if (!model) {
    //   throw new Error(`Model ${model} does not exist in Prisma client.`);
    // }
    // Fetch the data based on ObjectId
    const data = yield model.findUnique({
        where: {
            id: id,
        },
    });
    return data;
});
exports.findRecordOnObjectId = findRecordOnObjectId;
//# sourceMappingURL=commonFunction.js.map