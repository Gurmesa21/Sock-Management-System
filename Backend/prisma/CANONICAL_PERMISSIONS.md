# Canonical Permission Identifiers

The backend uses the exact permission string identifiers already used by the React frontend.

| Frontend constant | Canonical identifier |
|---|---|
| `VIEW_DASHBOARD` | `view_dashboard` |
| `MANAGE_USERS` | `manage_users` |
| `MANAGE_ROLES` | `manage_roles` |
| `MANAGE_DEPARTMENTS` | `manage_departments` |
| `MANAGE_SUPPLIERS` | `manage_suppliers` |
| `MANAGE_CATEGORIES` | `manage_categories` |
| `MANAGE_UNITS` | `manage_units` |
| `MANAGE_STORES` | `manage_stores` |
| `MANAGE_WAREHOUSES` | `manage_warehouses` |
| `MANAGE_SHELVES` | `manage_shelves` |
| `MANAGE_ITEMS` | `manage_items` |
| `MANAGE_LOCATIONS` | `manage_locations` |
| `RECEIVE_STOCK` | `receive_stock` |
| `INSPECT_STOCK` | `inspect_stock` |
| `VIEW_GRN` | `view_grn` |
| `VIEW_STOCK` | `view_stock` |
| `MANAGE_STOCK_CARDS` | `manage_stock_cards` |
| `MANAGE_BIN_CARDS` | `manage_bin_cards` |
| `TRANSFER_STOCK` | `transfer_stock` |
| `STOCK_TAKING` | `stock_taking` |
| `STOCK_ADJUSTMENT` | `stock_adjustment` |
| `RETURN_STOCK` | `return_stock` |
| `ISSUE_STOCK` | `issue_stock` |
| `CREATE_REQUISITION` | `create_requisition` |
| `VIEW_REQUISITIONS` | `view_requisitions` |
| `APPROVE_REQUISITION` | `approve_requisition` |
| `VIEW_PROCUREMENTS` | `view_procurement` |
| `VIEW_PURCHASE_ORDERS` | `view_purchase_order` |
| `VIEW_DELIVERIES` | `view_deliveries` |
| `CREATE_GATE_PASS` | `create_gate_pass` |
| `VERIFY_GATE_PASS` | `verify_gate_pass` |
| `VIEW_VALUATION` | `view_valuation` |
| `RECONCILE_STOCK` | `reconcile_stock` |
| `VIEW_REPORTS` | `view_reports` |
| `VIEW_AUDIT` | `view_audit` |
| `MANAGE_NOTIFICATIONS` | `manage_notifications` |
| `MANAGE_SETTINGS` | `manage_settings` |

Do not introduce another identifier for an existing capability.

`*` is an internal Administrator wildcard and is not a frontend permission.
