const { z } = require("zod");
const binCardService = require("../services/binCard.service");

const listSchema = z.object({
  locationId: z.string().uuid("Invalid location ID").optional(),
  itemId: z.string().uuid("Invalid item ID").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().max(100, "Search query too long").optional(),
});

const detailParamsSchema = z.object({
  locationId: z.string().uuid("Invalid location ID"),
});

const detailQuerySchema = z.object({
  itemId: z.string().uuid("Invalid item ID").optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});


async function listBinCards(req, res) {
  const parsed = listSchema.safeParse(req.query);
  
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: parsed.error.errors,
    });
  }

  const { locationId, itemId, page, limit, search } = parsed.data;

  const result = await binCardService.listBinCards({
    locationId,
    itemId,
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


async function getLocationBinCard(req, res) {
  const paramsParsed = detailParamsSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid location ID",
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

  const { locationId } = paramsParsed.data;
  const { itemId, page, limit } = queryParsed.data;

  const result = await binCardService.getLocationBinCard({
    locationId,
    itemId,
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
  listBinCards,
  getLocationBinCard,
};