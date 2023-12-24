export const successResponse = (
  statusCode: number = 200,
  message: string,
  data: any = null
) => {
  return {
    statusCode,
    message,
    data,
  };
};
