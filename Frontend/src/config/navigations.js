import PERMISSIONS from "./permissions";

/*
=========================================================
APPLICATION NAVIGATION
=========================================================

Rules:

1. Navigation paths MUST match AppRoutes.jsx.
2. Related functions are grouped together.
3. Labels are written for real users, not developers.
4. Permissions control visibility.
=========================================================
*/

export const NAVIGATION = [
  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    title: "Dashboard",
    path: "/dashboard",
    permission:
      PERMISSIONS.VIEW_DASHBOARD,
  },

  // =====================================================
  // ADMINISTRATION
  // =====================================================

  {
    title: "Administration",
    children: [
      {
        title: "User Management",
        path: "/users",
        permission:
          PERMISSIONS.MANAGE_USERS,
      },

      {
        title: "Roles & Permissions",
        path: "/roles",
        permission:
          PERMISSIONS.MANAGE_ROLES,
      },

      {
        title: "Departments",
        path: "/departments",
        permission:
          PERMISSIONS.MANAGE_DEPARTMENTS,
      },

      {
        title: "Units",
        path: "/units",
        permission:
          PERMISSIONS.MANAGE_UNITS,
      },
    ],
  },

  // =====================================================
  // MASTER DATA
  // =====================================================

  {
    title: "Master Data",
    children: [
      {
        title: "Stores",
        path: "/stores",
        permission:
          PERMISSIONS.MANAGE_STORES,
      },

      {
        title: "Warehouses",
        path: "/warehouses",
        permission:
          PERMISSIONS.MANAGE_WAREHOUSES,
      },

      {
        title: "Shelves",
        path: "/shelves",
        permission:
          PERMISSIONS.MANAGE_SHELVES,
      },
      {
        title: "Locations",
        path: "/locations",
        permission:
          PERMISSIONS.MANAGE_LOCATIONS,
      },

      {
        title: "Item Categories",
        path: "/categories",
        permission:
          PERMISSIONS.MANAGE_CATEGORIES,
      },

      {
        title: "Items",
        path: "/items",
        permission:
          PERMISSIONS.MANAGE_ITEMS,
      },

      {
        title: "Suppliers",
        path: "/suppliers",
        permission:
          PERMISSIONS.MANAGE_SUPPLIERS,
      },


    ],
  },

  // =====================================================
  // PROCUREMENT
  // =====================================================

  {
    title: "Procurement",
    children: [
      {
        title: "Procurement Overview",
        path: "/procurement",
        permission:
          PERMISSIONS.VIEW_PROCUREMENTS,
      },

      {
        title: "Purchase Requisitions",
        path: "/Procurement-requisitions",
        permission: PERMISSIONS.VIEW_PURCHASE_REQUISITIONS,
      },

      {
        title: "Purchase Orders",
        path: "/purchase-orders",
        permission:
          PERMISSIONS.VIEW_PURCHASE_ORDERS,
      },

      {
        title: "Deliveries",
        path: "/deliveries",
        permission:
          PERMISSIONS.VIEW_DELIVERIES,
      },

      {
        title: "Procurement Reports",
        path: "/procurement-reports",
        permission:
          PERMISSIONS.VIEW_REPORTS,
      },
    ],
  },

  // =====================================================
  // RECEIVING & INSPECTION
  // =====================================================

  {
    title: "Receiving & Inspection",
    children: [
      {
        title: "Receiving",
        path: "/receiving",
        permission:
          PERMISSIONS.RECEIVE_STOCK,
      },

      {
        title: "Inspection",
        path: "/inspection",
        permission:
          PERMISSIONS.INSPECT_STOCK,
      },

      {
        title: "Goods Receiving Notes",
        path: "/grn",
        permission:
          PERMISSIONS.VIEW_GRN,
      },
    ],
  },

  // =====================================================
  // INVENTORY
  // =====================================================

  {
    title: "Inventory",
    children: [
      {
        title: "Inventory Overview",
        path: "/stock",
        permission:
          PERMISSIONS.VIEW_STOCK,
      },

      {
        title: "Stock Cards",
        path: "/stock-cards",
        permission:
          PERMISSIONS.VIEW_STOCK_CARDS,
      },

      {
        title: "Bin Cards",
        path: "/bin-cards",
        permission:
          PERMISSIONS.VIEW_BIN_CARDS,
      },

      {
        title: "Stock Transactions",
        path: "/transactions",
        permission:
          PERMISSIONS.VIEW_STOCK_TRANSACTIONS,
      },

      {
        title: "Stock Transfers",
        path: "/stock-transfers",
        permission:
          PERMISSIONS.TRANSFER_STOCK,
      },

      {
        title: "Stock Taking",
        path: "/stock-taking",
        permission:
          PERMISSIONS.STOCK_TAKING,
      },

      {
        title: "Stock Monitoring",
        path: "/monitoring",
        permission:
          PERMISSIONS.VIEW_STOCK,
      },

      {
        title: "Shelf Life",
        path: "/shelf-life",
        permission:
          PERMISSIONS.VIEW_SHELF_LIFE,
      },
    ],
  },

  // =====================================================
  // STOCK OPERATIONS
  // =====================================================

  {
    title: "Stock Operations",
    children: [
      {
        title: "Requisitions",
        path: "/requisitions",
        permission:
          PERMISSIONS.VIEW_REQUISITIONS,
      },
      {
        title: "Issue Stock",
        path: "/issuing",
        permission:
          PERMISSIONS.VIEW_ISSUING,
      },

      {
        title: "Issue Vouchers",
        path: "/issue-vouchers",
        permission:
          PERMISSIONS.VIEW_ISSUE_VOUCHERS,
      },



      {
        title: "Returns",
        path: "/returns",
        permission:
          PERMISSIONS.VIEW_MATERIAL_RETURNS,
      },

      {
        title: "Disposals",
        path: "/disposal",
        permission:
          PERMISSIONS.VIEW_DISPOSALS,
      },
    ],
  },

  // =====================================================
  // GATE PASS & SECURITY
  // =====================================================

  {
    title: "Gate Pass & Security",
    children: [
      {
        title: "Gate Passes",
        path: "/gate-passes",
        permission:
          PERMISSIONS.VIEW_GATE_PASSES,
      },

      {
        title: "Security Verification",
        path: "/gate-pass/verification",
        permission:
          PERMISSIONS.VERIFY_GATE_PASS,
      },

      {
        title: "Dispatch History",
        path: "/gate-pass/history",
        permission:
          PERMISSIONS.VERIFY_GATE_PASS,
      },
    ],
  },

  // =====================================================
  // STOCK CONTROL & FINANCE
  // =====================================================

  {
    title: "Stock Control & Finance",
    children: [
      {
        title: "Stock Adjustments",
        path: "/stock-control/adjustments",
        permission:
          PERMISSIONS.VIEW_STOCK_ADJUSTMENTS,
      },

      {
        title: "Stock Valuation",
        path: "/stock-control/valuation",
        permission:
          PERMISSIONS.VIEW_VALUATION,
      },

      {
        title: "FIFO Valuation",
        path: "/stock-control/fifo",
        permission:
          PERMISSIONS.VIEW_VALUATION,
      },

      {
        title: "Reconciliation",
        path: "/stock-control/reconciliation",
        permission:
          PERMISSIONS.RECONCILE_STOCK,
      },

      {
        title: "Financial Reports",
        path: "/stock-control/financial-reports",
        permission:
          PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      },
    ],
  },

  // =====================================================
  // REPORTING & AUDIT
  // =====================================================

  {
    title: "Reports & Audit",
    children: [
      {
        title: "Reports",
        path: "/reports",
        permission:
          PERMISSIONS.VIEW_REPORTS,
      },

      {
        title: "Audit Logs",
        path: "/audit-logs",
        permission:
          PERMISSIONS.VIEW_AUDIT,
      },
    ],
  },

  // =====================================================
  // SYSTEM
  // =====================================================

  {
    title: "System",
    children: [
      {
        title: "Notifications",
        path: "/notifications",
        permission:
          PERMISSIONS.VIEW_NOTIFICATIONS,
      },

      {
        title: "Profile",
        path: "/profile",
      },

      {
        title: "Personal Preferences",
        path: "/settings",
      },

      {
        title: "Change Password",
        path: "/change-password",
      },
    ],
  },
];

export default NAVIGATION;