const prisma = require("../src/lib/prisma");
const env = require("../src/config/env");
const { hashPassword } = require("../src/utils/password");

const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",

  // Users / RBAC
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",

  // Master Data
  MANAGE_DEPARTMENTS: "manage_departments",
  MANAGE_SUPPLIERS: "manage_suppliers",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_UNITS: "manage_units",
  MANAGE_STORES: "manage_stores",
  MANAGE_WAREHOUSES: "manage_warehouses",
  MANAGE_SHELVES: "manage_shelves",
  MANAGE_ITEMS: "manage_items",
  MANAGE_LOCATIONS: "manage_locations",

  // Receiving / Inspection / GRN
  RECEIVE_STOCK: "receive_stock",
  INSPECT_STOCK: "inspect_stock",
  VIEW_GRN: "view_grn",

  // Inventory
  VIEW_STOCK: "view_stock",
  MANAGE_STOCK_CARDS: "manage_stock_cards",
  MANAGE_BIN_CARDS: "manage_bin_cards",
  TRANSFER_STOCK: "transfer_stock",

  // Stock Taking / Control - Day 8
  STOCK_TAKING: "stock_taking",
  VIEW_STOCK_TAKING: "view_stock_taking",
  CREATE_STOCK_TAKING: "create_stock_taking",
  INVESTIGATE_DISCREPANCY: "investigate_discrepancy",
  APPROVE_STOCK_ADJUSTMENT: "approve_stock_adjustment",
  STOCK_ADJUSTMENT: "stock_adjustment",

  // Shelf Life / Batch - Day 8
  VIEW_SHELF_LIFE: "view_shelf_life",
  MANAGE_SHELF_LIFE: "manage_shelf_life",
  VIEW_EXPIRING_STOCK: "view_expiring_stock",

  // Disposal - Day 8
  VIEW_DISPOSALS: "view_disposals",
  CREATE_DISPOSAL_REQUEST: "create_disposal_request",
  INSPECT_DISPOSAL: "inspect_disposal",
  APPROVE_DISPOSAL: "approve_disposal",
  EXECUTE_DISPOSAL: "execute_disposal",

  // Returns
  RETURN_STOCK: "return_stock",

  // Requisitions / Issuing
  ISSUE_STOCK: "issue_stock",
  CREATE_REQUISITION: "create_requisition",
  VIEW_REQUISITIONS: "view_requisitions",
  APPROVE_REQUISITION: "approve_requisition",

  // Procurement
  VIEW_PROCUREMENTS: "view_procurement",
  VIEW_PURCHASE_ORDERS: "view_purchase_order",
  VIEW_DELIVERIES: "view_deliveries",
  //purchase requisition
  VIEW_PURCHASE_REQUISITIONS: "view_purchase_requisitions",
  CREATE_PURCHASE_REQUISITION: "create_purchase_requisition",
  UPDATE_PURCHASE_REQUISITION: "update_purchase_requisition",
  SUBMIT_PURCHASE_REQUISITION: "submit_purchase_requisition",
  APPROVE_PURCHASE_REQUISITION: "approve_purchase_requisition",
  REJECT_PURCHASE_REQUISITION: "reject_purchase_requisition",
  ASSIGN_PURCHASE_REQUISITION_SUPPLIER: "assign_purchase_requisition_supplier",
  // Security / Gate Pass
  VIEW_GATE_PASS: "view_gate_pass",
  CREATE_GATE_PASS: "create_gate_pass",
  VERIFY_GATE_PASS: "verify_gate_pass",
  CONFIRM_GATE_PASS_EXIT: "confirm_gate_pass_exit",
  RECORD_DISPATCH: "record_dispatch",

  CREATE_ASSET: "create_asset",
  VIEW_ASSETS: "view_assets",
  ASSIGN_ASSET: "assign_asset",

  CREATE_MATERIAL_RETURN: "create_material_return",
  VIEW_MATERIAL_RETURNS: "view_material_returns",
  RECEIVE_MATERIAL_RETURN: "receive_material_return",
  INSPECT_MATERIAL_RETURN: "inspect_material_return",
  APPROVE_MATERIAL_RETURN: "approve_material_return",
  REJECT_MATERIAL_RETURN: "reject_material_return",

  CREATE_USER_CARD: "create_user_card",
  VIEW_USER_CARDS: "view_user_cards",

  // Reports / Audit / Finance
  VIEW_VALUATION: "view_valuation",
  RECONCILE_STOCK: "reconcile_stock",
  VIEW_REPORTS: "view_reports",
  VIEW_AUDIT: "view_audit",

  // System
  MANAGE_NOTIFICATIONS: "manage_notifications",
  MANAGE_SETTINGS: "manage_settings",

  VIEW_FINANCIAL_REPORTS: "view_financial_reports",
  VIEW_RECONCILIATION: "view_reconciliation",
  VIEW_NOTIFICATIONS: "view_notifications",
  VIEW_INVENTORY: "view_inventory",
  VIEW_STOCK_CARDS: "view_stock_cards",
  VIEW_BIN_CARDS: "view_bin_cards",
  VIEW_STOCK_TRANSACTIONS: "view_stock_transactions",
  CREATE_STOCK_TRANSFER: "create_stock_transfer",
  COMPLETE_STOCK_TRANSFER: "complete_stock_transfer",
  VIEW_STOCK_ADJUSTMENTS: "view_stock_adjustments",
  REJECT_STOCK_ADJUSTMENT: "reject_stock_adjustment",
  COMPLETE_DISPOSAL: "complete_disposal",
  COUNT_STOCK: "count_stock",
  VIEW_ISSUE_VOUCHERS: "view_issue_vouchers",
  CREATE_ISSUE_VOUCHER: "create_issue_voucher",
  VIEW_ISSUING: "view_issuing",
  CREATE_ISSUE: "create_issue",
  COMPLETE_ISSUE: "complete_issue",
  UPDATE_REQUISITION: "update_requisition",
  SUBMIT_REQUISITION: "submit_requisition",
  REJECT_REQUISITION: "reject_requisition",
};

const permissionDescriptions = {
  view_dashboard: "View the dashboard.",

  // Users / RBAC
  manage_users: "Create and manage system users.",
  manage_roles: "View and manage roles and permissions.",

  // Master Data
  manage_departments: "Manage departments.",
  manage_suppliers: "Manage suppliers.",
  manage_categories: "Manage item categories.",
  manage_units: "Manage units of measure.",
  manage_stores: "Manage stores.",
  manage_warehouses: "Manage warehouses.",
  manage_shelves: "Manage shelves.",
  manage_items: "Manage inventory items.",
  manage_locations: "Manage stock locations.",

  // Receiving / Inspection / GRN
  receive_stock: "Receive stock.",
  inspect_stock: "Inspect received stock.",
  view_grn: "View goods receiving notes.",

  // Inventory
  view_stock: "View stock information.",
  manage_stock_cards: "Manage stock cards.",
  manage_bin_cards: "Manage bin cards.",
  transfer_stock: "Transfer stock.",

  // Stock Taking / Control
  stock_taking: "Conduct stock taking activities.",
  view_stock_taking: "View stock taking sessions and counts.",
  create_stock_taking: "Create and conduct stock taking sessions.",
  investigate_discrepancy: "Investigate stock discrepancies.",
  approve_stock_adjustment: "Approve stock adjustments resulting from discrepancies.",
  stock_adjustment: "Perform authorized stock adjustments.",

  // Shelf Life / Batch
  view_shelf_life: "View shelf-life and batch information.",
  manage_shelf_life: "Manage shelf-life and batch records.",
  view_expiring_stock: "View near-expiry and expiring stock.",

  // Disposal
  view_disposals: "View disposal requests and disposal records.",
  create_disposal_request: "Create disposal requests.",
  inspect_disposal: "Inspect items proposed for disposal.",
  approve_disposal: "Approve or reject disposal requests.",
  execute_disposal: "Execute approved stock disposal.",

  // Returns
  return_stock: "Process returned stock.",

  // Requisitions / Issuing
  issue_stock: "Issue stock.",
  create_requisition: "Create requisitions.",
  view_requisitions: "View requisitions.",
  approve_requisition: "Approve requisitions.",
  update_requisition: "Update requisitions.",
  submit_requisition: "Submit requisitions.",
  reject_requisition: "Reject requisitions.",

  // Procurement
  view_procurement: "View procurement information.",
  view_purchase_order: "View purchase orders.",
  view_deliveries: "View deliveries.",
  //purchase requisition
  view_purchase_requisitions: "View purchase requisitions.",
  create_purchase_requisition: "Create purchase requisitions.",
  update_purchase_requisition: "Update purchase requisitions.",
  submit_purchase_requisition: "Submit purchase requisitions.",
  approve_purchase_requisition: "Approve purchase requisitions.",
  reject_purchase_requisition: "Reject purchase requisitions.",
  assign_purchase_requisition_supplier: "Assign a supplier to an approved purchase requisition.",
  // Security
  view_gate_pass: "View gate passes.",
  create_gate_pass: "Create gate passes.",
  verify_gate_pass: "Verify gate passes.",
  confirm_gate_pass_exit: "Confirm gate pass exit.",
  record_dispatch: "Record gate pass dispatch.",

  // Reports / Audit / Finance
  view_valuation: "View inventory valuation.",
  reconcile_stock: "Reconcile stock.",
  view_reports: "View system reports.",
  view_audit: "View audit logs.",

  // System
  manage_notifications: "Manage system notifications.",
  manage_settings: "Manage system settings.",
  view_financial_reports:
    "View financial inventory reports.",

  view_reconciliation:
    "View and perform stock reconciliation.",

  view_notifications:
    "View personal system notifications.",
  view_inventory: "View inventory balances.",
  view_stock_cards: "View stock cards.",
  view_bin_cards: "View bin cards.",
  view_stock_transactions: "View stock transactions.",
  create_stock_transfer: "Create stock transfers.",
  complete_stock_transfer: "Complete stock transfers.",
  view_stock_adjustments: "View stock adjustments.",
  reject_stock_adjustment: "Reject stock adjustments.",
  complete_disposal: "Complete approved disposal.",
  count_stock: "Record physical stock counts.",
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const ROLE_PERMISSIONS = {
  Administrator: ["*"],

  PAO: [
    "view_dashboard",
    "manage_users",
    "manage_roles",
    "manage_departments",
    "manage_locations",
    "view_stock",
    "approve_stock_adjustment",
    "investigate_discrepancy",
    "manage_settings",
    "approve_disposal",
    "view_reports",
    "view_audit",
    "view_notifications",
    "view_stock_taking",
    "create_stock_taking",
    "stock_taking",
    "view_inventory",
    "view_stock_transactions",
    "view_disposals",
    "approve_requisition",
    "approve_material_return",
    "view_stock_adjustments",
  ],

  "Procurement Officer": [
    "view_dashboard",

    "manage_suppliers",
    "manage_items",
    "manage_categories",
    "manage_units",

    "view_procurement",
    "view_requisitions",
    "create_requisition",
    "update_requisition",
    "submit_requisition",
    "view_purchase_order",
    "view_deliveries",

    "view_reports",
    "view_financial_reports",
    "view_reconciliation",
    "view_notifications",
    "view_purchase_requisitions",
    "create_purchase_requisition",
    "update_purchase_requisition",
    "submit_purchase_requisition",
    "approve_purchase_requisition",
    "reject_purchase_requisition",
    "assign_purchase_requisition_supplier",
  ],

  Inspector: [
    "view_dashboard",

    "inspect_stock",
    "view_grn",

    "view_stock",

    // Day 8 disposal inspection
    "view_disposals",
    "inspect_disposal",

    // Day 8 shelf-life monitoring
    "view_shelf_life",
    "view_expiring_stock",

    "view_reports",
    "view_notifications",
  ],

  Storekeeper: [
    "view_dashboard",

    // Receiving
    "receive_stock",
    "view_grn",

    // Inventory
    "view_stock",
    "manage_stock_cards",
    "manage_bin_cards",

    // Issuing / returns / transfers
    "issue_stock",
    "return_stock",
    "transfer_stock",
    "view_issue_vouchers",
    "create_issue_voucher",

    // Requisitions
    "view_requisitions",

    // Gate passes
    "view_gate_pass",
    "create_gate_pass",

    // Day 8 stock control
    "view_stock_taking",
    "create_stock_taking",
    "view_shelf_life",
    "view_expiring_stock",

    // Disposal
    "view_disposals",
    "create_disposal_request",

    "view_reports",
    "view_inventory", "view_stock_cards", "view_bin_cards", "view_stock_transactions",
    "create_stock_transfer", "complete_stock_transfer", "view_stock_adjustments", "reject_stock_adjustment", "count_stock",
    "view_notifications",
  ],

  "Stock Clerk": [
    "view_dashboard",

    // Inventory
    "view_stock",
    "manage_stock_cards",
    "manage_bin_cards",
    "transfer_stock",

    // Stock taking
    "stock_taking",
    "view_stock_taking",
    "create_stock_taking",

    // Shelf life
    "view_shelf_life",
    "view_expiring_stock",
    "manage_shelf_life",

    // Disposal
    "view_disposals",
    "create_disposal_request",

    "view_valuation",
    "reconcile_stock",
    "view_reports",
    "view_inventory", "view_stock_cards", "view_bin_cards", "view_stock_transactions",
    "create_stock_transfer", "complete_stock_transfer", "view_stock_adjustments", "reject_stock_adjustment", "count_stock",
    "view_notifications",
  ],

  "Department User": [
    "view_dashboard",
    "view_stock",

    "view_requisitions",
    "create_requisition",
    "update_requisition",
    "submit_requisition",

    // Returns
    "return_stock",

    // Disposal visibility
    "view_disposals",

    "view_notifications",
  ],

  "Department Head": [
    "view_dashboard",
    "view_stock",

    "view_requisitions",
    "create_requisition",
    "update_requisition",
    "submit_requisition",
    "approve_requisition",
    "reject_requisition",

    // Returns
    "return_stock",

    // Disposal visibility
    "view_disposals",

    "view_reports",
    "view_notifications",
  ],

  "Accounts Officer": [
    "view_dashboard",
    "view_valuation",
    "view_financial_reports",
    "view_reconciliation",
    "reconcile_stock",
    "view_reports",
    "view_notifications"
  ],

  "Stock Auditor": [
    "view_dashboard",

    // Stock taking
    "stock_taking",
    "view_stock_taking",
    "create_stock_taking",
    "investigate_discrepancy",

    // Inventory
    "view_stock",
    "view_valuation",
    "reconcile_stock",

    // Shelf life
    "view_shelf_life",
    "view_expiring_stock",

    // Disposal audit visibility
    "view_disposals",

    // Audit
    "view_audit",

    "view_reports",
    "view_notifications",
  ],

  "Security Officer": [
    "view_dashboard",
    "view_gate_pass",
    "verify_gate_pass",
    "confirm_gate_pass_exit",
    "record_dispatch",
    "view_reports",
    "view_notifications",
  ],
};

const ROLE_DESCRIPTIONS = {
  Administrator:
    "System administrator with full system access.",

  PAO:
    "Property Administration Officer.",

  "Procurement Officer":
    "Handles procurement-related operations.",

  Inspector:
    "Inspects received goods and disposal candidates.",

  Storekeeper:
    "Receives, stores and issues stock.",

  "Stock Clerk":
    "Maintains stock records, stock transactions and stock control activities.",

  "Department User":
    "Creates and views department requisitions and return requests.",

  "Department Head":
    "Approves department requisitions.",

  "Accounts Officer":
    "Handles inventory valuation and financial responsibilities.",

  "Stock Auditor":
    "Audits stock, stock taking, reconciliation and adjustment activities.",

  "Security Officer":
    "Verifies goods movement and gate passes.",
};

async function main() {
  const permissions = {};

  /*
   * ============================================================
   * 1. SEED PERMISSIONS
   * ============================================================
   */

  for (const key of ALL_PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { key },

      update: {
        description:
          permissionDescriptions[key] || null,
      },

      create: {
        key,
        description:
          permissionDescriptions[key] || null,
      },
    });

    permissions[key] = permission;
  }

  /*
   * ============================================================
   * 2. WILDCARD PERMISSION
   * ============================================================
   *
   * Used internally by Administrator authorization.
   *
   * It is NOT a frontend permission.
   */

  const wildcard = await prisma.permission.upsert({
    where: {
      key: "*",
    },

    update: {
      description:
        "Internal wildcard permission for Administrator.",
    },

    create: {
      key: "*",
      description:
        "Internal wildcard permission for Administrator.",
    },
  });

  permissions["*"] = wildcard;

  /*
   * ============================================================
   * 3. SEED ROLES + ROLE PERMISSIONS
   * ============================================================
   */

  for (const [
    name,
    permissionKeys,
  ] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: {
        name,
      },

      update: {
        description:
          ROLE_DESCRIPTIONS[name],
      },

      create: {
        name,
        description:
          ROLE_DESCRIPTIONS[name],
      },
    });

    /*
     * Rebuild role-permission assignments so
     * the seed always reflects the canonical
     * permission configuration above.
     */
    await prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
      },
    });

    await prisma.rolePermission.createMany({
      data: permissionKeys.map((key) => ({
        roleId: role.id,
        permissionId:
          permissions[key].id,
      })),
    });
  }

  /*
   * ============================================================
   * 4. CREATE / UPDATE ADMINISTRATOR
   * ============================================================
   */

  const adminRole =
    await prisma.role.findUnique({
      where: {
        name: "Administrator",
      },
    });

  if (!adminRole) {
    throw new Error(
      "Administrator role was not created."
    );
  }

  const adminPasswordHash =
    await hashPassword(
      env.SEED_ADMIN_PASSWORD
    );

  const admin =
    await prisma.user.upsert({
      where: {
        username: "admin",
      },

      update: {
        email:
          "admin@university.local",

        fullName:
          "System Administrator",

        passwordHash:
          adminPasswordHash,

        isActive: true,
      },

      create: {
        username: "admin",

        email:
          "admin@university.local",

        fullName:
          "System Administrator",

        passwordHash:
          adminPasswordHash,

        department:
          "Administration",

        isActive: true,
      },
    });

  /*
   * ============================================================
   * 5. ASSIGN ADMINISTRATOR ROLE
   * ============================================================
   */

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },

    update: {},

    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  /*
   * ============================================================
   * 6. OUTPUT
   * ============================================================
   */

  console.log("");
  console.log("==========================================");
  console.log("Database seed completed successfully.");
  console.log("==========================================");

  console.log(
    "Administrator username: admin"
  );

  console.log(
    "Administrator password: value of SEED_ADMIN_PASSWORD in .env"
  );

  console.log(
    `Roles seeded: ${Object.keys(
      ROLE_PERMISSIONS
    ).join(", ")}`
  );

  console.log(
    `Canonical permissions seeded: ${ALL_PERMISSIONS.length}`
  );

  console.log(
    "Day 8 permissions included:"
  );

  console.log(
    "  - view_stock_taking"
  );

  console.log(
    "  - create_stock_taking"
  );

  console.log(
    "  - investigate_discrepancy"
  );

  console.log(
    "  - approve_stock_adjustment"
  );

  console.log(
    "  - stock_adjustment"
  );

  console.log(
    "  - view_shelf_life"
  );

  console.log(
    "  - manage_shelf_life"
  );

  console.log(
    "  - view_expiring_stock"
  );

  console.log(
    "  - view_disposals"
  );

  console.log(
    "  - create_disposal_request"
  );

  console.log(
    "  - inspect_disposal"
  );

  console.log(
    "  - approve_disposal"
  );

  console.log(
    "  - execute_disposal"
  );

  console.log("==========================================");
}

main()
  .catch((error) => {
    console.error(
      "Seed failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });