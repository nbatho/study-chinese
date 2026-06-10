export const success = (res, data = null, statusCode = 200) =>
  res.status(statusCode).json({
    status: 'success',
    data
  });

export const created = (res, data = null) => success(res, data, 201);
