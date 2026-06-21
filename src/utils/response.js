const sendSuccess = (res, statusCode, message, data = {}, meta = {}) => {
  const response = { success: true, message };
  if (Object.keys(data).length > 0 || Array.isArray(data)) response.data = data;
  if (Object.keys(meta).length > 0) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
