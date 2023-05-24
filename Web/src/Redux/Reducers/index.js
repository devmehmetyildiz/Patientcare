import { combineReducers } from "@reduxjs/toolkit";
import CaseReducer from "./CaseReducer";
import DepartmentReducer from "./DepartmentReducer";
import ProfileReducer from "./ProfileReducer";
import RoleReducer from "./RoleReducer";
import StationReducer from "./StationReducer";
import UnitReducer from "./UnitReducer";
import StockdefinesReducer from "./StockdefineReducer"
import StockReducer from "./StockReducer"
import StockmovementsReducer from "./StockmovementReducer";
import UserReducer from "./UserReducer";
import FileReducer from "./FileReducer";
import PurchaseorderReducer from "./PurchaseorderReducer"
import PatienttypeReducer from "./PatienttypeReducer"
import CostumertypeReducer from "./CostumertypeReducer"
import PatientdefineReducer from "./PatientdefineReducer"
import PatientReducer from "./PatientReducer";
import PatientstockmovementReducer from "./PatientstockmovementReducer";
import PatientstockReducer from "./PatientstockReducer"
import PurchaseorderstockmovementReducer from "./PurchaseorderstockmovementReducer"
import PurchaseorderstockReducer from "./PurchaseorderstockReducer"
import WarehouseReducer from "./WarehouseReducer"
import TododefineReducer from "./TododefineReducer";
import TodogroupdefineReducer from "./TodogroupdefineReducer";
import PatientmovementReducer from "./PatientmovementReducer";
import PeriodReducer from "./PeriodReducer";
import CheckperiodReducer from "./CheckperiodReducer";
import MailsettingReducer from "./MailsettingReducer";
import PrinttemplateReducer from "./PrinttemplateReducer";
import TodoReducer from "./TodoReducer";

const reducers = combineReducers({
    Units: UnitReducer,
    Profile: ProfileReducer,
    Roles: RoleReducer,
    Departments: DepartmentReducer,
    Stations: StationReducer,
    Cases: CaseReducer,
    Stockdefines: StockdefinesReducer,
    Stocks: StockReducer,
    Stockmovements: StockmovementsReducer,
    Users: UserReducer,
    Files: FileReducer,
    Purchaseorders: PurchaseorderReducer,
    Costumertypes: CostumertypeReducer,
    Patienttypes: PatienttypeReducer,
    Patientdefines: PatientdefineReducer,
    Patients: PatientReducer,
    Patientstockmovements: PatientstockmovementReducer,
    Patientstocks: PatientstockReducer,
    Purchaseorderstockmovements: PurchaseorderstockmovementReducer,
    Purchaseorderstocks: PurchaseorderstockReducer,
    Warehouses: WarehouseReducer,
    Tododefines: TododefineReducer,
    Todogroupdefines: TodogroupdefineReducer,
    Patientmovements: PatientmovementReducer,
    Periods: PeriodReducer,
    Checkperiods: CheckperiodReducer,
    Mailsettings: MailsettingReducer,
    Printtemplates: PrinttemplateReducer,
    Todos: TodoReducer
});

export default reducers;