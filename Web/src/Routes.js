import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import Spinner from './Common/Spinner'
import ProtectedRoute from './Utils/ProtectedRoute';

const Login = lazy(() => import('./Containers/Auth/Login'));
const Register = lazy(() => import('./Containers/Auth/Register'));
const Roles = lazy(() => import('./Containers/Roles/Roles'));
const RolesCreate = lazy(() => import('./Containers/Roles/RolesCreate'));
const RolesEdit = lazy(() => import('./Containers/Roles/RolesEdit'));

const Rules = lazy(() => import('./Containers/Rules/Rules'));
const RulesCreate = lazy(() => import('./Containers/Rules/RulesCreate'));
const RulesEdit = lazy(() => import('./Containers/Rules/RulesEdit'));

const Departments = lazy(() => import('./Containers/Departments/Departments'));
const DepartmentsCreate = lazy(() => import('./Containers/Departments/DepartmentsCreate'));
const DepartmentsEdit = lazy(() => import('./Containers/Departments/DepartmentsEdit'));

const Stations = lazy(() => import('./Containers/Stations/Stations'));
const StationsCreate = lazy(() => import('./Containers/Stations/StationsCreate'));
const StationsEdit = lazy(() => import('./Containers/Stations/StationsEdit'));

const Cases = lazy(() => import('./Containers/Cases/Cases'));
const CasesCreate = lazy(() => import('./Containers/Cases/CasesCreate'));
const CasesEdit = lazy(() => import('./Containers/Cases/CasesEdit'));

const Units = lazy(() => import('./Containers/Units/Units'));
const UnitsCreate = lazy(() => import('./Containers/Units/UnitsCreate'));
const UnitsEdit = lazy(() => import('./Containers/Units/UnitsEdit'));

const Users = lazy(() => import('./Containers/Users/Users'));
const UsersCreate = lazy(() => import('./Containers/Users/UsersCreate'));
const UsersEdit = lazy(() => import('./Containers/Users/UsersEdit'));

const Stockdefines = lazy(() => import('./Containers/Stockdefines/Stockdefines'));
const StockdefinesCreate = lazy(() => import('./Containers/Stockdefines/StockdefinesCreate'));
const StockdefinesEdit = lazy(() => import('./Containers/Stockdefines/StockdefinesEdit'));

const Files = lazy(() => import('./Containers/Files/Files'));
const FilesCreate = lazy(() => import('./Containers/Files/FilesCreate'));
const FilesEdit = lazy(() => import('./Containers/Files/FilesEdit'));

const Purchaseorders = lazy(() => import('./Containers/Purchaseorders/Purchaseorders'));
const PurchaseordersCreate = lazy(() => import('./Containers/Purchaseorders/PurchaseordersCreate'));
const PurchaseordersEdit = lazy(() => import('./Containers/Purchaseorders/PurchaseordersEdit'));

const Patienttypes = lazy(() => import('./Containers/Patienttypes/Patienttypes'));
const PatienttypesCreate = lazy(() => import('./Containers/Patienttypes/PatienttypesCreate'));
const PatienttypesEdit = lazy(() => import('./Containers/Patienttypes/PatienttypesEdit'));

const Costumertypes = lazy(() => import('./Containers/Costumertypes/Costumertypes'));
const CostumertypesCreate = lazy(() => import('./Containers/Costumertypes/CostumertypesCreate'));
const CostumertypesEdit = lazy(() => import('./Containers/Costumertypes/CostumertypesEdit'));

const Patientdefines = lazy(() => import('./Containers/Patientdefines/Patientdefines'));
const PatientdefinesCreate = lazy(() => import('./Containers/Patientdefines/PatientdefinesCreate'));
const PatientdefinesEdit = lazy(() => import('./Containers/Patientdefines/PatientdefinesEdit'));

const Patients = lazy(() => import('./Containers/Patients/Patients'));
const PatientsCreate = lazy(() => import('./Containers/Patients/PatientsCreate'));
const PatientsEdit = lazy(() => import('./Containers/Patients/PatientsEdit'));
const PatientsDetail = lazy(() => import('./Containers/Patients/PatientsDetail'));
const PatientsFiles = lazy(() => import('./Containers/Patients/PatientsFiles'));
const PatientsAddstock = lazy(() => import('./Containers/Patients/PatientsAddstock'));
const PatientsAddmedicine = lazy(() => import('./Containers/Patients/PatientsAddmedicine'));
const PatientsRemovestock = lazy(() => import('./Containers/Patients/PatientsRemovestock'));
const PatientsRemovemedicine = lazy(() => import('./Containers/Patients/PatientsRemovemedicine'));
const PatientsEditcase = lazy(() => import('./Containers/Patients/PatientsEditcase'));
const PatientsEditroutine = lazy(() => import('./Containers/Patients/PatientsEditroutine'));

const Patientstocks = lazy(() => import('./Containers/Patientstocks/Patientstocks'));
const PatientstocksCreate = lazy(() => import('./Containers/Patientstocks/PatientstocksCreate'));
const PatientstocksEdit = lazy(() => import('./Containers/Patientstocks/PatientstocksEdit'));

const Patientmedicines = lazy(() => import('./Containers/Patientmedicines/Patientmedicines'));
const PatientmedicinesCreate = lazy(() => import('./Containers/Patientmedicines/PatientmedicinesCreate'));
const PatientmedicinesEdit = lazy(() => import('./Containers/Patientmedicines/PatientmedicinesEdit'));

const Patientstockmovements = lazy(() => import('./Containers/Patientstockmovements/Patientstockmovements'));
const PatientstockmovementsCreate = lazy(() => import('./Containers/Patientstockmovements/PatientstockmovementsCreate'));
const PatientstockmovementsEdit = lazy(() => import('./Containers/Patientstockmovements/PatientstockmovementsEdit'));

const Purchaseorderstocks = lazy(() => import('./Containers/Purchaseorderstocks/Purchaseorderstocks'));
const PurchaseorderstocksCreate = lazy(() => import('./Containers/Purchaseorderstocks/PurchaseorderstocksCreate'));
const PurchaseorderstocksEdit = lazy(() => import('./Containers/Purchaseorderstocks/PurchaseorderstocksEdit'));

const Purchaseorderstockmovements = lazy(() => import('./Containers/Purchaseorderstockmovements/Purchaseorderstockmovements'));
const PurchaseorderstockmovementsCreate = lazy(() => import('./Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsCreate'));
const PurchaseorderstockmovementsEdit = lazy(() => import('./Containers/Purchaseorderstockmovements/PurchaseorderstockmovementsEdit'));

const Warehouses = lazy(() => import('./Containers/Warehouses/Warehouses'));
const WarehousesCreate = lazy(() => import('./Containers/Warehouses/WarehousesCreate'));
const WarehousesEdit = lazy(() => import('./Containers/Warehouses/WarehousesEdit'));

const Preregistrations = lazy(() => import('./Containers/Preregistrations/Preregistrations'));
const PreregistrationsCreate = lazy(() => import('./Containers/Preregistrations/PreregistrationsCreate'));
const PreregistrationsEdit = lazy(() => import('./Containers/Preregistrations/PreregistrationsEdit'));
const PreregistrationsEditfile = lazy(() => import('./Containers/Preregistrations/PreregistrationsEditfile'));
const PreregistrationsEditstock = lazy(() => import('./Containers/Preregistrations/PreregistrationsEditstock'));
const PreregistrationsComplete = lazy(() => import('./Containers/Preregistrations/PreregistrationsComplete'));

const Stocks = lazy(() => import('./Containers/Stocks/Stocks'));
const StocksCreate = lazy(() => import('./Containers/Stocks/StocksCreate'));
const StocksEdit = lazy(() => import('./Containers/Stocks/StocksEdit'));

const Medicines = lazy(() => import('./Containers/Medicines/Medicines'));
const MedicinesCreate = lazy(() => import('./Containers/Medicines/MedicinesCreate'));
const MedicinesEdit = lazy(() => import('./Containers/Medicines/MedicinesEdit'));

const Stockmovements = lazy(() => import('./Containers/Stockmovements/Stockmovements'));
const StockmovementsCreate = lazy(() => import('./Containers/Stockmovements/StockmovementsCreate'));
const StockmovementsEdit = lazy(() => import('./Containers/Stockmovements/StockmovementsEdit'));

const Tododefines = lazy(() => import('./Containers/Tododefines/Tododefines'));
const TododefinesCreate = lazy(() => import('./Containers/Tododefines/TododefinesCreate'));
const TododefinesEdit = lazy(() => import('./Containers/Tododefines/TododefinesEdit'));

const Todogroupdefines = lazy(() => import('./Containers/Todogroupdefines/Todogroupdefines'));
const TodogroupdefinesCreate = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesCreate'));
const TodogroupdefinesEdit = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesEdit'));

const Periods = lazy(() => import('./Containers/Periods/Periods'));
const PeriodsCreate = lazy(() => import('./Containers/Periods/PeriodsCreate'));
const PeriodsEdit = lazy(() => import('./Containers/Periods/PeriodsEdit'));

const Checkperiods = lazy(() => import('./Containers/Checkperiods/Checkperiods'));
const CheckperiodsCreate = lazy(() => import('./Containers/Checkperiods/CheckperiodsCreate'));
const CheckperiodsEdit = lazy(() => import('./Containers/Checkperiods/CheckperiodsEdit'));

const Patientmovements = lazy(() => import('./Containers/Patientmovements/Patientmovements'));
const PatientmovementsCreate = lazy(() => import('./Containers/Patientmovements/PatientmovementsCreate'));
const PatientmovementsEdit = lazy(() => import('./Containers/Patientmovements/PatientmovementsEdit'));

const Todos = lazy(() => import('./Containers/Todos/Todos'));

const Mailsettings = lazy(() => import('./Containers/Mailsettings/Mailsettings'));
const MailsettingsCreate = lazy(() => import('./Containers/Mailsettings/MailsettingsCreate'));
const MailsettingsEdit = lazy(() => import('./Containers/Mailsettings/MailsettingsEdit'));

const Printtemplates = lazy(() => import('./Containers/Printtemplates/Printtemplates'));
const PrinttemplatesCreate = lazy(() => import('./Containers/Printtemplates/PrinttemplatesCreate'));
const PrinttemplatesEdit = lazy(() => import('./Containers/Printtemplates/PrinttemplatesEdit'));

const Rooms = lazy(() => import('./Containers/Rooms/Rooms'));
const RoomsCreate = lazy(() => import('./Containers/Rooms/RoomsCreate'));
const RoomsEdit = lazy(() => import('./Containers/Rooms/RoomsEdit'));

const Beds = lazy(() => import('./Containers/Beds/Beds'));
const BedsCreate = lazy(() => import('./Containers/Beds/BedsCreate'));
const BedsEdit = lazy(() => import('./Containers/Beds/BedsEdit'));

const Floors = lazy(() => import('./Containers/Floors/Floors'));
const FloorsCreate = lazy(() => import('./Containers/Floors/FloorsCreate'));
const FloorsEdit = lazy(() => import('./Containers/Floors/FloorsEdit'));

const ProfileEdit = lazy(() => import('./Containers/Auth/ProfileEdit'));
const PasswordChange = lazy(() => import('./Containers/Auth/PasswordChange'));
const Passwordforget = lazy(() => import('./Containers/Auth/Passwordforget'));
const PasswordReset = lazy(() => import('./Containers/Auth/PasswordReset'));
const Home = lazy(() => import('./Pages/Home'));
const Notfoundpage = lazy(() => import('./Utils/Notfoundpage'));

class Routes extends Component {
  render() {

    const { Profile } = this.props

    const roles = Profile?.roles

    const routes = [
      { exact: true, path: "/Login", auth: false, component: Login },
      { exact: true, path: "/Register", auth: false, component: Register },
      { exact: true, path: "/Home", auth: true, component: Home, permission: '' },
      { exact: true, path: "/", auth: true, component: Home, permission: '' },
      { exact: true, path: "/Roles", auth: true, component: Roles, permission: 'rolescreen' },
      { exact: true, path: "/Roles/Create", auth: true, component: RolesCreate, permission: 'rolescreen' },
      { exact: true, path: "/Roles/:RoleID/Edit", auth: true, component: RolesEdit, permission: 'rolescreen' },
      { exact: true, path: "/Departments", auth: true, component: Departments, permission: 'departmentscreen' }, ,
      { exact: true, path: "/Departments/Create", auth: true, component: DepartmentsCreate, permission: 'departmentscreen' },
      { exact: true, path: "/Departments/:DepartmentID/Edit", auth: true, component: DepartmentsEdit, permission: 'departmentscreen' },
      { exact: true, path: "/Stations", auth: true, component: Stations, permission: 'stationscreen' },
      { exact: true, path: "/Stations/Create", auth: true, component: StationsCreate, permission: 'stationscreen' },
      { exact: true, path: "/Stations/:StationID/Edit", auth: true, component: StationsEdit, permission: 'stationscreen' },
      { exact: true, path: "/Cases", auth: true, component: Cases, permission: 'casescreen' },
      { exact: true, path: "/Cases/Create", auth: true, component: CasesCreate, permission: 'casescreen' },
      { exact: true, path: "/Cases/:CaseID/Edit", auth: true, component: CasesEdit, permission: 'casescreen' },
      { exact: true, path: "/Units", auth: true, component: Units, permission: 'unitscreen' },
      { exact: true, path: "/Units/Create", auth: true, component: UnitsCreate, permission: 'unitscreen' },
      { exact: true, path: "/Units/:UnitID/Edit", auth: true, component: UnitsEdit, permission: 'unitscreen' },
      { exact: true, path: "/Stockdefines", auth: true, component: Stockdefines, permission: 'stockdefinescreen' },
      { exact: true, path: "/Stockdefines/Create", auth: true, component: StockdefinesCreate, permission: 'stockdefinescreen' },
      { exact: true, path: "/Stockdefines/:StockdefineID/Edit", auth: true, component: StockdefinesEdit, permission: 'stockdefinescreen' },
      { exact: true, path: "/Stocks", auth: true, component: Stocks, permission: 'stockscreen' },
      { exact: true, path: "/Stocks/Create", auth: true, component: StocksCreate, permission: 'stockscreen' },
      { exact: true, path: "/Stocks/:StockID/Edit", auth: true, component: StocksEdit, permission: 'stockscreen' },
      { exact: true, path: "/Medicines", auth: true, component: Medicines, permission: 'stockscreen' },
      { exact: true, path: "/Medicines/Create", auth: true, component: MedicinesCreate, permission: 'stockscreen' },
      { exact: true, path: "/Medicines/:StockID/Edit", auth: true, component: MedicinesEdit, permission: 'stockscreen' },
      { exact: true, path: "/Stockmovements", auth: true, component: Stockmovements, permission: 'stockmovementscreen' },
      { exact: true, path: "/Stockmovements/Create", auth: true, component: StockmovementsCreate, permission: 'stockmovementscreen' },
      { exact: true, path: "/Stockmovements/:StockmovementID/Edit", auth: true, component: StockmovementsEdit, permission: 'stockmovementscreen' },
      { exact: true, path: "/Users", auth: true, component: Users, permission: 'userscreen' },
      { exact: true, path: "/Users/Create", auth: true, component: UsersCreate, permission: 'userscreen' },
      { exact: true, path: "/Users/:UserID/Edit", auth: true, component: UsersEdit, permission: 'userscreen' },
      { exact: true, path: "/Files", auth: true, component: Files, permission: 'filescreen' },
      { exact: true, path: "/Files/Create", auth: true, component: FilesCreate, permission: 'filescreen' },
      { exact: true, path: "/Files/:FileID/Edit", auth: true, component: FilesEdit, permission: 'filescreen' },
      { exact: true, path: "/Purchaseorders", auth: true, component: Purchaseorders, permission: 'purchaseorderscreen' },
      { exact: true, path: "/Purchaseorders/Create", auth: true, component: PurchaseordersCreate, permission: 'purchaseorderscreen' },
      { exact: true, path: "/Purchaseorders/:PurchaseorderID/Edit", auth: true, component: PurchaseordersEdit, permission: 'purchaseorderscreen' },
      { exact: true, path: "/Costumertypes", auth: true, component: Costumertypes, permission: 'costumertypescreen' },
      { exact: true, path: "/Costumertypes/Create", auth: true, component: CostumertypesCreate, permission: 'costumertypescreen' },
      { exact: true, path: "/Costumertypes/:CostumertypeID/Edit", auth: true, component: CostumertypesEdit, permission: 'costumertypescreen' },
      { exact: true, path: "/Patienttypes", auth: true, component: Patienttypes, permission: 'patienttypescreen' },
      { exact: true, path: "/Patienttypes/Create", auth: true, component: PatienttypesCreate, permission: 'patienttypescreen' },
      { exact: true, path: "/Patienttypes/:PatienttypeID/Edit", auth: true, component: PatienttypesEdit, permission: 'patienttypescreen' },
      { exact: true, path: "/Patientdefines", auth: true, component: Patientdefines, permission: 'patientdefinescreen' },
      { exact: true, path: "/Patientdefines/Create", auth: true, component: PatientdefinesCreate, permission: 'patientdefinescreen' },
      { exact: true, path: "/Patientdefines/:PatientdefineID/Edit", auth: true, component: PatientdefinesEdit, permission: 'patientdefinescreen' },
      { exact: true, path: "/Patients", auth: true, component: Patients, permission: 'patientscreen' },
      { exact: true, path: "/Patients/Create", auth: true, component: PatientsCreate, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID", auth: true, component: PatientsDetail, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Editfile", auth: true, component: PatientsFiles, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Edit", auth: true, component: PatientsEdit, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Addstock", auth: true, component: PatientsAddstock, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Addmedicine", auth: true, component: PatientsAddmedicine, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Removestock", auth: true, component: PatientsRemovestock, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Removemedicine", auth: true, component: PatientsRemovemedicine, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Editcase", auth: true, component: PatientsEditcase, permission: 'patientscreen' },
      { exact: true, path: "/Patients/:PatientID/Editroutine", auth: true, component: PatientsEditroutine, permission: 'patientscreen' },
      { exact: true, path: "/Warehouses", auth: true, component: Warehouses, permission: 'warehousescreen' },
      { exact: true, path: "/Warehouses/Create", auth: true, component: WarehousesCreate, permission: 'warehousescreen' },
      { exact: true, path: "/Warehouses/:WarehouseID/Edit", auth: true, component: WarehousesEdit, permission: 'warehousescreen' },
      { exact: true, path: "/Tododefines", auth: true, component: Tododefines, permission: 'tododefinescreen' },
      { exact: true, path: "/Tododefines/Create", auth: true, component: TododefinesCreate, permission: 'tododefinescreen' },
      { exact: true, path: "/Tododefines/:TododefineID/Edit", auth: true, component: TododefinesEdit, permission: 'tododefinescreen' },
      { exact: true, path: "/Todogroupdefines", auth: true, component: Todogroupdefines, permission: 'todogroupdefinescreen' },
      { exact: true, path: "/Todogroupdefines/Create", auth: true, component: TodogroupdefinesCreate, permission: 'todogroupdefinescreen' },
      { exact: true, path: "/Todogroupdefines/:TodogroupdefineID/Edit", auth: true, component: TodogroupdefinesEdit, permission: 'todogroupdefinescreen' },
      { exact: true, path: "/Patientstocks", auth: true, component: Patientstocks, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientstocks/Create", auth: true, component: PatientstocksCreate, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientstocks/:PatientstockID/Edit", auth: true, component: PatientstocksEdit, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientmedicines", auth: true, component: Patientmedicines, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientmedicines/Create", auth: true, component: PatientmedicinesCreate, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientmedicines/:PatientstockID/Edit", auth: true, component: PatientmedicinesEdit, permission: 'patientstockscreen' },
      { exact: true, path: "/Patientstockmovements", auth: true, component: Patientstockmovements, permission: 'patientstockmovementscreen' },
      { exact: true, path: "/Patientstockmovements/Create", auth: true, component: PatientstockmovementsCreate, permission: 'patientstockmovementscreen' },
      { exact: true, path: "/Patientstockmovements/:PatientstockmovementID/Edit", auth: true, component: PatientstockmovementsEdit, permission: 'patientstockmovementscreen' },
      { exact: true, path: "/Purchaseorderstocks", auth: true, component: Purchaseorderstocks, permission: 'purchaseorderstockscreen' },
      { exact: true, path: "/Purchaseorderstocks/Create", auth: true, component: PurchaseorderstocksCreate, permission: 'purchaseorderstockscreen' },
      { exact: true, path: "/Purchaseorderstocks/:PurchaseorderstockID/Edit", auth: true, component: PurchaseorderstocksEdit, permission: 'purchaseorderstockscreen' },
      { exact: true, path: "/Purchaseorderstockmovements", auth: true, component: Purchaseorderstockmovements, permission: 'purchaseorderstockmovementscreen' },
      { exact: true, path: "/Purchaseorderstockmovements/Create", auth: true, component: PurchaseorderstockmovementsCreate, permission: 'purchaseorderstockmovementscreen' },
      { exact: true, path: "/Purchaseorderstockmovements/:PurchaseorderstockmovementID/Edit", auth: true, component: PurchaseorderstockmovementsEdit, permission: 'purchaseorderstockmovementscreen' },
      { exact: true, path: "/Patientmovements", auth: true, component: Patientmovements, permission: 'patientmovementscreen' },
      { exact: true, path: "/Patientmovements/Create", auth: true, component: PatientmovementsCreate, permission: 'patientmovementscreen' },
      { exact: true, path: "/Patientmovements/:PatientmovementID/Edit", auth: true, component: PatientmovementsEdit, permission: 'patientmovementscreen' },
      { exact: true, path: "/Mailsettings", auth: true, component: Mailsettings, permission: 'mailsettingscreen' },
      { exact: true, path: "/Mailsettings/Create", auth: true, component: MailsettingsCreate, permission: 'mailsettingscreen' },
      { exact: true, path: "/Mailsettings/:MailsettingID/Edit", auth: true, component: MailsettingsEdit, permission: 'mailsettingscreen' },
      { exact: true, path: "/Todos", auth: true, component: Todos, permission: 'todoscreen' },
      { exact: true, path: "/Checkperiods", auth: true, component: Checkperiods, permission: 'checkperiodscreen' },
      { exact: true, path: "/Checkperiods/Create", auth: true, component: CheckperiodsCreate, permission: 'checkperiodscreen' },
      { exact: true, path: "/Checkperiods/:CheckperiodID/Edit", auth: true, component: CheckperiodsEdit, permission: 'checkperiodscreen' },
      { exact: true, path: "/Printtemplates", auth: true, component: Printtemplates, permission: 'printtemplatescreen' },
      { exact: true, path: "/Printtemplates/Create", auth: true, component: PrinttemplatesCreate, permission: 'printtemplatescreen' },
      { exact: true, path: "/Printtemplates/:PrinttemplateID/Edit", auth: true, component: PrinttemplatesEdit, permission: 'printtemplatescreen' },
      { exact: true, path: "/Periods", auth: true, component: Periods, permission: 'periodscreen' },
      { exact: true, path: "/Periods/Create", auth: true, component: PeriodsCreate, permission: 'periodscreen' },
      { exact: true, path: "/Periods/:PeriodID/Edit", auth: true, component: PeriodsEdit, permission: 'periodscreen' },
      { exact: true, path: "/Rules", auth: true, component: Rules, permission: 'rulescreen' },
      { exact: true, path: "/Rules/Create", auth: true, component: RulesCreate, permission: 'rulescreen' },
      { exact: true, path: "/Rules/:RuleID/Edit", auth: true, component: RulesEdit, permission: 'rulescreen' },
      { exact: true, path: "/Beds", auth: true, component: Beds, permission: 'bedscreen' },
      { exact: true, path: "/Beds/Create", auth: true, component: BedsCreate, permission: 'bedscreen' },
      { exact: true, path: "/Beds/:BedID/Edit", auth: true, component: BedsEdit, permission: 'bedscreen' },
      { exact: true, path: "/Floors", auth: true, component: Floors, permission: 'floorscreen' },
      { exact: true, path: "/Floors/Create", auth: true, component: FloorsCreate, permission: 'floorscreen' },
      { exact: true, path: "/Floors/:FloorID/Edit", auth: true, component: FloorsEdit, permission: 'floorscreen' },
      { exact: true, path: "/Rooms", auth: true, component: Rooms, permission: 'roomscreen' },
      { exact: true, path: "/Rooms/Create", auth: true, component: RoomsCreate, permission: 'roomscreen' },
      { exact: true, path: "/Rooms/:RoomID/Edit", auth: true, component: RoomsEdit, permission: 'roomscreen' },
      { exact: true, path: "/Preregistrations", auth: true, component: Preregistrations, permission: 'patientscreen' },
      { exact: true, path: "/Preregistrations/Create", auth: true, component: PreregistrationsCreate, permission: 'patientscreen' },
      { exact: true, path: "/Preregistrations/:PatientID/Edit", auth: true, component: PreregistrationsEdit, permission: 'patientscreen' },
      { exact: true, path: "/Preregistrations/:PatientID/Editfile", auth: true, component: PreregistrationsEditfile, permission: 'patientscreen' },
      { exact: true, path: "/Preregistrations/:PatientID/Editstock", auth: true, component: PreregistrationsEditstock, permission: 'patientscreen' },
      { exact: true, path: "/Preregistrations/:PatientID/Complete", auth: true, component: PreregistrationsComplete, permission: 'patientscreen' },
      { exact: true, path: "/Profile/Edit", auth: true, component: ProfileEdit, permission: 'userscreen' },
      { exact: true, path: "/Profile/Change-Password", auth: true, component: PasswordChange, permission: 'userscreen' },
      { exact: true, path: "/PasswordReset/:RequestID", auth: false, component: PasswordReset },
      { exact: true, path: "/Forgetpassword", auth: false, component: Passwordforget },
      { exact: false, path: "*", auth: false, component: Notfoundpage },
    ]

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route, index) => {
            return route.auth ? (((roles || []).includes('admin') || (roles || []).includes(route.permission)) ? <ProtectedRoute key={index} exact={route.exact} path={route.path} component={route.component} /> : null) :
              <Route key={index} exact={route.exact} path={route.path} component={route.component} />
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default Routes;
