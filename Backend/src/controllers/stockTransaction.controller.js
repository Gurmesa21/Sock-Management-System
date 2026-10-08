const prisma =
  require("../config/prisma");

async function listTransactions(req, res) {
  const {
    page = 1,
    limit = 20,
    itemId,
    locationId,
    type,
    search,
  } = req.query;

  const pageNumber =
    Number(page);

  const limitNumber =
    Number(limit);

  const where = {
    ...(itemId && { itemId }),
    ...(locationId && { locationId }),
    ...(type && { type }),

    ...(search && {
      OR: [
        {
          transactionNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          reason: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [data, total] =
    await prisma.$transaction([
      prisma.stockTransaction.findMany({
        where,

        include: {
          item: true,
          location: {
            include: {
              store: true,
            },
          },
          performedBy: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip:
          (pageNumber - 1) *
          limitNumber,

        take:
          limitNumber,
      }),

      prisma.stockTransaction.count({
        where,
      }),
    ]);

  return res.json({
    success: true,
    data,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages:
        Math.ceil(
          total / limitNumber
        ),
    },
  });
}

async function getTransaction(req, res) {
  const transaction =
    await prisma.stockTransaction.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        item: true,
        location: {
          include: {
            store: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

  return res.json({
    success: true,
    data: transaction,
  });
}

module.exports = {
  listTransactions,
  getTransaction,
};