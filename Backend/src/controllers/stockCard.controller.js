const { z } = require("zod");
const stockCardService = require("../services/stockCard.service");

const listSchema = z.object({
  itemId: z.string().uuid("Invalid item ID").optional(),
  locationId: z.string().uuid("Invalid location ID").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().max(100, "Search query too long").optional(),
});

const detailParamsSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
});

const detailQuerySchema = z.object({
  locationId: z.string().uuid("Invalid location ID").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

async function listStockCards(req, res) {
  const parsed = listSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: parsed.error.errors,
    });
  }

  const { itemId, locationId, page, limit, search } = parsed.data;

  const result = await stockCardService.listStockCards({
    itemId,
    locationId,
    page,
    limit,
    search,
  });

  return res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

async function getItemStockCard(req, res) {
  const paramsParsed = detailParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid item ID",
      errors: paramsParsed.error.errors,
    });
  }

  const queryParsed = detailQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: queryParsed.error.errors,
    });
  }

  const { itemId } = paramsParsed.data;
  const { locationId, page, limit } = queryParsed.data;

  const result = await stockCardService.getItemStockCard({
    itemId,
    locationId,
    page,
    limit,
  });

  return res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
}

module.exports = {
  listStockCards,
  getItemStockCard,
};