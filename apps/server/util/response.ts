export const successResponse = <T>(
  statusCode: number = 200,
  message: string,
  data?: T
) => {
  return {
    statusCode,
    message,
    data,
  };
};
