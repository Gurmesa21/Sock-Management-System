import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "../components/layout/Layout";

// =====================================================
// AUTHENTICATION & SYSTEM
// =====================================================

import PublicRoute from "../components/auth/PublicRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PermissionRoute from "../components/auth/PermissionRoute";

import Login from "../pages/login/Login";
import Signup from "../pages/login/Signup";
import ForgotPassword from "../pages/login/ForgotPassword";
import ResetPassword from "../pages/login/ResetPassword";
import SessionExpired from "../pages/login/SessionExpired";
import ChangePassword from "../pages/login/ChangePassword";

import NotFound from "../pages/errors/NotFound";
import Forbidden from "../pages/errors/Forbidden";

import Profile from "../pages/system/Profile";
import Settings from "../pages/system/Settings";
import Notifications from "../pages/system/Notifications";

import { AuthProvider } from "../context/AuthContext";
import PERMISSIONS from "../config/permissions";

// =====================================================
// DASHBOARD
// =====================================================

import Dashboard from "../features/dashboard/Dashboard";

// =====================================================
// MASTER DATA
// =====================================================

import Stores from "../features/stores/Stores";
import Categories from "../features/categories/Categories";
import Locations from "../features/locations/Locations";
import Items from "../features/items/Items";
import Suppliers from "../features/suppliers/Suppliers";
import Warehouses from "../features/warehouses/Warehouses";
import Shelves from "../features/warehouses/Shelves";

// =====================================================
// ADMINISTRATION
// =====================================================

import RolesPage from "../pages/administration/Roles/Roles.jsx";
import Departments from "../pages/administration/Departments/Departments";
import Units from "../pages/administration/Units/Units";
import Users from "../pages/users/Users";
import UserDetails from "../pages/users/UserDetails";
import UserForm from "../pages/users/userForm.jsx";

// =====================================================
// PROCUREMENT
// =====================================================

import Procurement from "../pages/procurement/Procurement";
import Requisitions from "../pages/procurement/requisition/Requisitions";
import NewRequisition from "../pages/procurement/requisition/NewRequisition";
import RequisitionDetails from "../pages/procurement/requisition/RequisitionDetails";
import PendingRequisitions from "../pages/procurement/requisition/PendingRequisitions";
import ApprovedRequisitions from "../pages/procurement/requisition/ApprovedRequisitions";
import PurchaseOrders from "../pages/procurement/purchaseOrder/PurchaseOrders";
import ProcurementReports from "../pages/procurement/reports/ProcurementReports.jsx";
import Deliveries from "../pages/procurement/delivery/Deliveries.jsx";
import PurchaseRequisitions from "../pages/procurement/purchaseRequisition/PurchaseRequisitions";
import PurchaseRequisitionForm from "../pages/procurement/purchaseRequisition/PurchaseRequisitionForm";
import PurchaseRequisitionDetails from "../pages/procurement/purchaseRequisition/PurchaseRequisitionDetails";
// =====================================================
// RECEIVING & INSPECTION
// =====================================================

import Receiving from "../pages/receiving/Receiving";
import NewReceiving from "../pages/receiving/NewReceiving";
import ReceivingDetails from "../pages/receiving/ReceivingDetails";
import ReceivingEvaluation from "../pages/receiving/ReceivingEvaluation";
import GRN from "../pages/receiving/GRN/GRN.jsx";
import GRNDetails from "../pages/receiving/GRN/GRNDetails.jsx";
import Inspection from "../pages/receiving/inspection/Inspection.jsx";

// =====================================================
// INVENTORY
// =====================================================

import Stock from "../features/stock/Stock";
import StockCards from "../features/stock/stockcard/StockCards.jsx";
import StockCardDetails from "../features/stock/stockcard/StockCardDetails.jsx";
import BinCards from "../features/stock/bincard/BinCards.jsx";
import BinCardDetails from "../features/stock/bincard/BinCardDetails.jsx";
import StockTransfers from "../features/stock/transfer/StockTransfers.jsx";
import StockTransferForm from "../features/stock/transfer/StockTransferForm.jsx";
import StockTransferDetails from "../features/stock/transfer/StockTransferDetails.jsx";
import Transactions from "../features/stock/transaction/Transactions.jsx";
import TransactionDetails from "../features/stock/transaction/TransactionDetails.jsx";
import Monitoring from "../features/inventory-control/Monitoring";
import ShelfLife from "../features/inventory-control/shelflife/ShelfLife.jsx";
import StockTaking from "../features/inventory-control/StockTaking";
import NewStockTaking from "../features/inventory-control/StockTakingNew";
import StockTakingDetails from "../features/inventory-control/StockTakingDetails";
import Disposal from "../features/inventory-control/Disposal";
import DisposalDetails from "../features/inventory-control/DisposalDetails";
import DisposalNew from "../features/inventory-control/DisposalNew";
import ShelfLifeDetails from "../features/inventory-control/shelflife/ShelfLifeDetails";
// =====================================================
// ISSUING
// =====================================================

import Issuing from "../features/issuing/Issuing";
import IssuingForm from "../features/issuing/IssuingForm.jsx";
import IssuingDetails from "../features/issuing/IssuingDetails";
import IssuingPending from "../features/issuing/IssuingPending";
import IssuingApproved from "../features/issuing/IssuingApproved";
import IssueVouchers from "../features/issuing/IssueVouchers";
import IssueVoucherDetails from "../features/issuing/IssueVoucherDetails";
import IssueVoucherForm from "../features/issuing/IssueVoucherForm";

// =====================================================
// GATE PASS & SECURITY
// =====================================================

import GatePasses from "../pages/gate-pass/GatePasses";
import SecurityVerification from "../pages/gate-pass/SecurityVerification";
import DispatchHistory from "../pages/gate-pass/dispatch/DispatchHistory";

// =====================================================
// RETURNS
// =====================================================

import Returns from "../pages/returns/Returns";
import NewReturn from "../pages/returns/NewReturn";
import ReturnDetails from "../pages/returns/ReturnDetails";
import InspectReturn from "../pages/returns/InspectReturn";

// =====================================================
// ASSETS & USER CARDS
// =====================================================

import Assets from "../pages/assets/Assets";
import NewAsset from "../pages/assets/NewAsset";
import AssetDetails from "../pages/assets/AssetDetails";
import UserCards from "../pages/userCards/UserCards";
import UserCardDetails from "../pages/userCards/UserCardDetails";

// =====================================================
// REPORTS & AUDIT
// =====================================================

import Reports from "../pages/reports/Reports";
import AuditLogs from "../pages/audit/AuditLogs";

// =====================================================
// STOCK CONTROL & FINANCE
// =====================================================

import StockAdjustments from "../pages/stock-control/stock-adjustment/StockAdjustments.jsx";
import StockValuation from "../pages/stock-control/srock-valuation/StockValuation.jsx";
import FIFO from "../pages/stock-control/fifo/FIFO.jsx";
import Reconciliation from "../pages/stock-control/reconciliation/Reconciliation.jsx";
import FinancialReports from "../pages/stock-control/FinancialReports";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route element={<PublicRoute />}>
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route
              path="/session-expired"
              element={<SessionExpired />}
            />
          </Route>

          <Route
            path="/403"
            element={<Forbidden />}
          />

          {/* =================================================
              PROTECTED APPLICATION
          ================================================= */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>

              {/* =================================================
                  DASHBOARD
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_DASHBOARD
                    }
                  />
                }
              >
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
              </Route>

              {/* =================================================
                  PERSONAL / SYSTEM
              ================================================= */}

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_NOTIFICATIONS
                    }
                  />
                }
              >
                <Route
                  path="/notifications"
                  element={<Notifications />}
                />
              </Route>

              <Route
                path="/change-password"
                element={<ChangePassword />}
              />

              {/* =================================================
                  ADMINISTRATION
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_USERS
                    }
                  />
                }
              >
                <Route
                  path="/users"
                  element={<Users />}
                />

                <Route
                  path="/users/new"
                  element={<UserForm />}
                />

                <Route
                  path="/users/:id"
                  element={<UserDetails />}
                />

                <Route
                  path="/users/:id/edit"
                  element={<UserForm />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_ROLES
                    }
                  />
                }
              >
                <Route
                  path="/roles"
                  element={<RolesPage />}
                />
                <Route
                  path="/roles/new"
                  element={<RolesPage view="new" />}
                />
                <Route
                  path="/roles/:id"
                  element={<RolesPage view="details" />}
                />
                <Route
                  path="/roles/:id/edit"
                  element={<RolesPage view="edit" />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_DEPARTMENTS
                    }
                  />
                }
              >
                <Route
                  path="/departments"
                  element={<Departments />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_UNITS
                    }
                  />
                }

              >
                <Route
                  path="/units"
                  element={<Units />}
                />
              </Route>

              {/* =================================================
                  MASTER DATA
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_STORES
                    }
                  />
                }
              >
                <Route
                  path="/stores"
                  element={<Stores />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_WAREHOUSES
                    }
                  />
                }
              >
                <Route
                  path="/warehouses"
                  element={<Warehouses />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_SHELVES
                    }
                  />
                }
              >
                <Route
                  path="/shelves"
                  element={<Shelves />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_CATEGORIES
                    }
                  />
                }
              >
                <Route
                  path="/categories"
                  element={<Categories />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_LOCATIONS
                    }
                  />
                }
              >
                <Route
                  path="/locations"
                  element={<Locations />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_ITEMS
                    }
                  />
                }
              >
                <Route
                  path="/items"
                  element={<Items />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.MANAGE_SUPPLIERS
                    }
                  />
                }
              >
                <Route
                  path="/suppliers"
                  element={<Suppliers />}
                />
              </Route>

              {/* =================================================
                  PROCUREMENT
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_PROCUREMENTS
                    }
                  />
                }
              >
                <Route
                  path="/procurement"
                  element={<Procurement />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_REQUISITIONS
                    }
                  />
                }
              >
                <Route
                  path="/requisitions"
                  element={<Requisitions />}
                />
                
                <Route
                  path="/requisitions/:id"
                  element={<RequisitionDetails />}
                />

                <Route
                  path="/requisitions/approved"
                  element={<ApprovedRequisitions />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={PERMISSIONS.VIEW_PURCHASE_REQUISITIONS}
                  />
                }
              >
                <Route
                  path="/Procurement-requisitions"
                  element={<PurchaseRequisitions />}
                />

                <Route
                  path="/Procurement-requisitions/:id"
                  element={<PurchaseRequisitionDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={PERMISSIONS.CREATE_PURCHASE_REQUISITION}
                  />
                }
              >
                <Route
                  path="/Procurement-requisitions/new"
                  element={<PurchaseRequisitionForm />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={PERMISSIONS.UPDATE_PURCHASE_REQUISITION}
                  />
                }
              >
                <Route
                  path="/Procurement-requisitions/:id/edit"
                  element={<PurchaseRequisitionForm />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.CREATE_REQUISITION
                    }
                  />
                }
              >
                <Route
                  path="/requisitions/new"
                  element={<NewRequisition />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.UPDATE_REQUISITION
                    }
                  />
                }
              >
                <Route
                  path="/requisitions/:id/edit"
                  element={<NewRequisition />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.APPROVE_REQUISITION
                    }
                  />
                }
              >
                <Route
                  path="/requisitions/pending"
                  element={<PendingRequisitions />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_PURCHASE_ORDERS
                    }
                  />
                }
              >
                <Route
                  path="/purchase-orders"
                  element={<PurchaseOrders />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_DELIVERIES
                    }
                  />
                }
              >
                <Route
                  path="/deliveries"
                  element={<Deliveries />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_REPORTS
                    }
                  />
                }
              >
                <Route
                  path="/procurement-reports"
                  element={<ProcurementReports />}
                />
              </Route>

              {/* =================================================
                  RECEIVING & INSPECTION
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.RECEIVE_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/receiving"
                  element={<Receiving />}
                />

                <Route
                  path="/receiving/new"
                  element={<NewReceiving />}
                />

                <Route
                  path="/receiving/:id"
                  element={<ReceivingDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_GRN
                    }
                  />
                }
              >
                <Route
                  path="/grn"
                  element={<GRN />}
                />

                <Route
                  path="/grn/:grnNumber"
                  element={<GRNDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.INSPECT_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/inspection"
                  element={<Inspection />}
                />

                <Route
                  path="/receiving/:id/evaluation"
                  element={<ReceivingEvaluation />}
                />
              </Route>

              {/* =================================================
                  INVENTORY
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/stock"
                  element={<Stock />}
                />

                <Route
                  path="/monitoring"
                  element={<Monitoring />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_SHELF_LIFE
                    }
                  />
                }
              >
                <Route
                  path="/shelf-life"
                  element={<ShelfLife />}
                />

                <Route
                  path="/shelf-life/:id"
                  element={<ShelfLifeDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_STOCK_TRANSACTIONS
                    }
                  />
                }
              >
                <Route
                  path="/transactions"
                  element={<Transactions />}
                />
                <Route
                  path="/transactions/:id"
                  element={<TransactionDetails />}
                />
              </Route>
              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_STOCK_CARDS
                    }
                  />
                }
              >
                <Route
                  path="/stock-cards"
                  element={<StockCards />}
                />

                <Route
                  path="/stock-cards/:itemId"
                  element={<StockCardDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_BIN_CARDS
                    }
                  />
                }
              >
                <Route
                  path="/bin-cards"
                  element={<BinCards />}
                />

                <Route
                  path="/bin-cards/:locationId"
                  element={<BinCardDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.TRANSFER_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/stock-transfers"
                  element={<StockTransfers />}
                />

                <Route
                  path="/stock-transfers/new"
                  element={<StockTransferForm />}
                />

                <Route
                  path="/stock-transfers/:id"
                  element={<StockTransferDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_STOCK_TAKING
                    }
                  />
                }
              >
                <Route
                  path="/stock-taking"
                  element={<StockTaking />}
                />
                <Route
                  path="/stock-taking/:id"
                  element={<StockTakingDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.CREATE_STOCK_TAKING
                    }
                  />
                }
              >
                <Route
                  path="/stock-taking/new"
                  element={<NewStockTaking />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.STOCK_ADJUSTMENT
                    }
                  />
                }
              >
                <Route
                  path="/stock-control/adjustments"
                  element={<StockAdjustments />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_DISPOSALS
                    }
                  />
                }
              >
                <Route
                  path="/disposal"
                  element={<Disposal />}
                />
                <Route
                  path="/disposal/:id"
                  element={<DisposalDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.CREATE_DISPOSAL_REQUEST
                    }
                  />
                }
              >
                <Route
                  path="/disposal/new"
                  element={<DisposalNew />}
                />
              </Route>

              {/* =================================================
                  ISSUING
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.ISSUE_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/issuing"
                  element={<Issuing />}
                />

                <Route
                  path="/issuing/new"
                  element={<IssuingForm />}
                />

                <Route
                  path="/issuing/pending"
                  element={<IssuingPending />}
                />

                <Route
                  path="/issuing/approved"
                  element={<IssuingApproved />}
                />

                <Route
                  path="/issuing/:id"
                  element={<IssuingDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_ISSUE_VOUCHERS
                    }
                  />
                }
              >
                <Route
                  path="/issue-vouchers"
                  element={<IssueVouchers />}
                />

                <Route
                  path="/issue-vouchers/:id"
                  element={<IssueVoucherDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.CREATE_ISSUE_VOUCHER
                    }
                  />
                }
              >
                <Route
                  path="/issue-vouchers/new"
                  element={<IssueVoucherForm />}
                />
              </Route>

              {/* =================================================
                  GATE PASS & SECURITY
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_GATE_PASSES
                    }
                  />
                }
              >
                <Route
                  path="/gate-passes"
                  element={<GatePasses />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VERIFY_GATE_PASS
                    }
                  />
                }
              >
                <Route
                  path="/gate-pass/verification"
                  element={<SecurityVerification />}
                />

                <Route
                  path="/gate-pass/history"
                  element={<DispatchHistory />}
                />
              </Route>

              {/* =================================================
                  RETURNS
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_MATERIAL_RETURNS
                    }
                  />
                }
              >
                <Route
                  path="/returns"
                  element={<Returns />}
                />

                <Route
                  path="/returns/new"
                  element={<NewReturn />}
                />

                <Route
                  path="/returns/:id"
                  element={<ReturnDetails />}
                />

                <Route
                  path="/returns/:id/inspect"
                  element={<InspectReturn />}
                />
              </Route>

              {/* =================================================
                  ASSETS & USER CARDS
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={PERMISSIONS.VIEW_ASSETS}
                  />
                }
              >
                <Route
                  path="/assets"
                  element={<Assets />}
                />

                <Route
                  path="/assets/new"
                  element={<NewAsset />}
                />

                <Route
                  path="/assets/:id"
                  element={<AssetDetails />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={PERMISSIONS.VIEW_USER_CARDS}
                  />
                }
              >
                <Route
                  path="/user-cards"
                  element={<UserCards />}
                />

                <Route
                  path="/user-cards/:id"
                  element={<UserCardDetails />}
                />
              </Route>

              {/* =================================================
                  STOCK CONTROL & FINANCE
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_VALUATION
                    }
                  />
                }
              >
                <Route
                  path="/stock-control/valuation"
                  element={<StockValuation />}
                />

                <Route
                  path="/stock-control/fifo"
                  element={<FIFO />}
                />

              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_FINANCIAL_REPORTS
                    }
                  />
                }
              >
                <Route
                  path="/stock-control/financial-reports"
                  element={<FinancialReports />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.RECONCILE_STOCK
                    }
                  />
                }
              >
                <Route
                  path="/stock-control/reconciliation"
                  element={<Reconciliation />}
                />
              </Route>

              {/* =================================================
                  REPORTS & AUDIT
              ================================================= */}

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_REPORTS
                    }
                  />
                }
              >
                <Route
                  path="/reports"
                  element={<Reports />}
                />
              </Route>

              <Route
                element={
                  <PermissionRoute
                    permission={
                      PERMISSIONS.VIEW_AUDIT
                    }
                  />
                }
              >
                <Route
                  path="/audit-logs"
                  element={<AuditLogs />}
                />
              </Route>

              {/* =================================================
                  ROOT
              ================================================= */}

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

              {/* =================================================
                  404
              ================================================= */}

              <Route
                path="*"
                element={<NotFound />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;