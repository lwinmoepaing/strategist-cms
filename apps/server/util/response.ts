export const successResponse = <T>(
  statusCode: number,
  message: string,
  data?: T
) => {
  return {
    statusCode,
    message,
    data,
  };
};
