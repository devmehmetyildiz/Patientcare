import { combineReducers } from "@reduxjs/toolkit";
import CaseSlice from "./CaseSlice";
import DepartmentSlice from "./DepartmentSlice";
import ProfileSlice from "./ProfileSlice";
import RoleSlice from "./RoleSlice";
import StationSlice from "./StationSlice";
import UnitSlice from "./UnitSlice";
import StockdefinesSlice from "./StockdefineSlice"
import StockSlice from "./StockSlice"
import StockmovementsSlice from "./StockmovementSlice";
import UserSlice from "./UserSlice";
import FileSlice from "./FileSlice";
import PurchaseorderSlice from "./PurchaseorderSlice"
import PatienttypeSlice from "./PatienttypeSlice"
import CostumertypeSlice from "./CostumertypeSlice"
import PatientdefineSlice from "./PatientdefineSlice"
import PatientSlice from "./PatientSlice";
import PatientstockmovementSlice from "./PatientstockmovementSlice";
import PatientstockSlice from "./PatientstockSlice"
import PurchaseorderstockmovementSlice from "./PurchaseorderstockmovementSlice"
import PurchaseorderstockSlice from "./PurchaseorderstockSlice"
import WarehouseSlice from "./WarehouseSlice"
import TododefineSlice from "./TododefineSlice";
import TodogroupdefineSlice from "./TodogroupdefineSlice";
import PatientmovementSlice from "./PatientmovementSlice";
import PeriodSlice from "./PeriodSlice";
import CheckperiodSlice from "./CheckperiodSlice";
import MailsettingSlice from "./MailsettingSlice";
import PrinttemplateSlice from "./PrinttemplateSlice";
import TodoSlice from "./TodoSlice";
import RuleSlice from "./RuleSlice";

const Slices = combineReducers({
    Units: UnitSlice,
    Profile: ProfileSlice,
    Roles: RoleSlice,
    Departments: DepartmentSlice,
    Stations: StationSlice,
    Cases: CaseSlice,
    Stockdefines: StockdefinesSlice,
    Stocks: StockSlice,
    Stockmovements: StockmovementsSlice,
    Users: UserSlice,
    Files: FileSlice,
    Purchaseorders: PurchaseorderSlice,
    Costumertypes: CostumertypeSlice,
    Patienttypes: PatienttypeSlice,
    Patientdefines: PatientdefineSlice,
    Patients: PatientSlice,
    Patientstockmovements: PatientstockmovementSlice,
    Patientstocks: PatientstockSlice,
    Purchaseorderstockmovements: PurchaseorderstockmovementSlice,
    Purchaseorderstocks: PurchaseorderstockSlice,
    Warehouses: WarehouseSlice,
    Tododefines: TododefineSlice,
    Todogroupdefines: TodogroupdefineSlice,
    Patientmovements: PatientmovementSlice,
    Periods: PeriodSlice,
    Checkperiods: CheckperiodSlice,
    Mailsettings: MailsettingSlice,
    Printtemplates: PrinttemplateSlice,
    Todos: TodoSlice,
    Rules: RuleSlice
});

export default Slices;