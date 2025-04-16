
  
 export interface CommonResponse <T>{
    success: boolean;
    message: string;
    error?: boolean;
    data: T; 
  }
  
  const commonResponse = <T>(success: boolean, data: T, message: string, error?: boolean): CommonResponse<T> => ({
    success: success,
    message: message,
    error: error,
    data: data,
  });
  export { commonResponse };
