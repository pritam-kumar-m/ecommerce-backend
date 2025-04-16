import { PaginationParams } from "../tsType/masterType";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// find all records in database based on table name
export const findAllRecords = async (tableName: string) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];

    return await (model as any).findMany({});
  } catch (error) {
    console.log("Error fetching records:findAllRecords-----", error.message);
  }
};

// find pagination type data
export const findSearchPaginationRecord = async (
  tableName: string,
  searchKeyValue: any,
  includeRelationChild?: any,
  pagination?: PaginationParams
) => {
  try {
    const { page = 1, pageSize = 10 } = pagination || {};

    // Calculate offset for pagination
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const model = prisma[tableName as keyof typeof prisma];

    // Get total count for pagination metadata
    const totalCount = await (model as any).count({
      where: searchKeyValue,
    });

    // Fetch matching records with optional relations and pagination
    const matchedResults = await (model as any).findMany({
      where: searchKeyValue,
      include: includeRelationChild || undefined, // Include relations if provided
      skip,
      take,
    });

    return {
      data: matchedResults,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    console.error("Error in findSearchPaginationRecord:", error.message);
    console.error(error.stack); // Log full stack trace for better debugging
    return null; // Return null in case of an error
  }
};

// find search result
export const findSearchRecord = async (
  tableName: string,
  searchKeyValue: any,
  includeRelationChild?: any
) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];

    const findMatchedResult = await (model as any).findMany({
      where: searchKeyValue,
      include: includeRelationChild || undefined, // Include relations if provided,
    });

    return findMatchedResult;
  } catch (error) {
    console.error("Error fetching records in findSearchRecord:", error.message);
    console.error(error.stack); // Log full error stack for better debugging
    return null; // Return null in case of error
  }
};

// create a new record in the specified table
export const createRecord = async (tableName: string, data: any) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];

    const newRecord = await (model as any).create({
      data,
    });
    return newRecord;
  } catch (error) {
    console.log("Error creating record:createRecord----", error.message);
  }
};

// update an existing record in the specified table
export const updateRecord = async (
  tableName: string,
  id: string,
  data: any
) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];

    const updatedRecord = await (model as any).update({
      where: { id },
      data,
    });
    return updatedRecord;
  } catch (error) {
    console.log("Error updating record:updateRecord----", error.message);
  }
};

// delete records

// create a new record in the specified table
export const deleteRecord = async (tableName: string, id: string) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];

    const newRecord = await (model as any).delete({
      where: {
        id: id,
      },
    });
    return newRecord;
  } catch (error) {
    console.log("Error creating record:createRecord----", error.message);
  }
};

// find single record
export const findSingleRecord = async (tableName: string, whereClause: any) => {
  try {
    const model = prisma[tableName as keyof typeof prisma];
    console.log("whereClause", whereClause)
    const findRecords = await (model as any).FindFirst({
      where: whereClause
    });
    return findRecords;
  } catch (error) {
    console.log("Error creating record:createRecord----", error.message);
  }
};
