const { PAGINATION } = require('../config/constants');

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { getPaginationParams, buildPaginationMeta };
