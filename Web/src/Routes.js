import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, Spinner } from './Components'

const Login = lazy(() => import('./Containers/Auth/Login'));
const Register = lazy(() => import('./Containers/Auth/Register'));
const Roles = lazy(() => import('./Containers/Roles/Roles'));
const RolesCreate = lazy(() => import('./Containers/Roles/RolesCreate'));
const RolesEdit = lazy(() => import('./Containers/Roles/RolesEdit'));

const About = lazy(() => import('./Components/About'));

const Approve = lazy(() => import('./Containers/Approve/Approve'));

const Rules = lazy(() => import('./Containers/Rules/Rules'));
const RulesCreate = lazy(() => import('./Containers/Rules/RulesCreate'));
const RulesEdit = lazy(() => import('./Containers/Rules/RulesEdit'));

const Departments = lazy(() => import('./Containers/Departments/Departments'));
const DepartmentsCreate = lazy(() => import('./Containers/Departments/DepartmentsCreate'));
const DepartmentsEdit = lazy(() => import('./Containers/Departments/DepartmentsEdit'));

const Cases = lazy(() => import('./Containers/Cases/Cases'));
const CasesCreate = lazy(() => import('./Containers/Cases/CasesCreate'));
const CasesEdit = lazy(() => import('./Containers/Cases/CasesEdit'));

const Units = lazy(() => import('./Containers/Units/Units'));
const UnitsCreate = lazy(() => import('./Containers/Units/UnitsCreate'));
const UnitsEdit = lazy(() => import('./Containers/Units/UnitsEdit'));

const Users = lazy(() => import('./Containers/Users/Users'));
const UsersDetail = lazy(() => import('./Containers/Users/UsersDetail'));
const UsersCreate = lazy(() => import('./Containers/Users/UsersCreate'));
const UsersEdit = lazy(() => import('./Containers/Users/UsersEdit'));

const Files = lazy(() => import('./Containers/Files/Files'));
const FilesCreate = lazy(() => import('./Containers/Files/FilesCreate'));
const FilesEdit = lazy(() => import('./Containers/Files/FilesEdit'));

const Costumertypes = lazy(() => import('./Containers/Costumertypes/Costumertypes'));
const CostumertypesCreate = lazy(() => import('./Containers/Costumertypes/CostumertypesCreate'));
const CostumertypesEdit = lazy(() => import('./Containers/Costumertypes/CostumertypesEdit'));

const Patients = lazy(() => import('./Containers/Patients/Patients'));
const PatientsDetail = lazy(() => import('./Containers/Patients/PatientsDetail'));
const PatientsEditcash = lazy(() => import('./Containers/Patients/PatientsEditcash'));
const PatientsEditsupportplan = lazy(() => import('./Containers/Patients/PatientsEditsupportplan'));
const PatientsEditroutine = lazy(() => import('./Containers/Patients/PatientsEditroutine'));
const PatientsFiles = lazy(() => import('./Containers/Patients/PatientsFiles'));

const Patientscases = lazy(() => import('./Containers/Patientscases/Patientscases'));

const Preregistrations = lazy(() => import('./Containers/Preregistrations/Preregistrations'));
const PreregistrationsCreate = lazy(() => import('./Containers/Preregistrations/PreregistrationsCreate'));
const PreregistrationsEdit = lazy(() => import('./Containers/Preregistrations/PreregistrationsEdit'));

const Patientdefines = lazy(() => import('./Containers/Patientdefines/Patientdefines'));
const PatientdefinesCreate = lazy(() => import('./Containers/Patientdefines/PatientdefinesCreate'));
const PatientdefinesEdit = lazy(() => import('./Containers/Patientdefines/PatientdefinesEdit'));

const Patienttypes = lazy(() => import('./Containers/Patienttypes/Patienttypes'));
const PatienttypesCreate = lazy(() => import('./Containers/Patienttypes/PatienttypesCreate'));
const PatienttypesEdit = lazy(() => import('./Containers/Patienttypes/PatienttypesEdit'));

//-----------------------------Warehouse-----------------------------
const Purchaseorders = lazy(() => import('./Containers/Purchaseorders/Purchaseorders'));
const PurchaseordersCreate = lazy(() => import('./Containers/Purchaseorders/PurchaseordersCreate'));
const PurchaseordersEdit = lazy(() => import('./Containers/Purchaseorders/PurchaseordersEdit'));

const Warehouses = lazy(() => import('./Containers/Warehouses/Warehouses'));
const WarehousesCreate = lazy(() => import('./Containers/Warehouses/WarehousesCreate'));
const WarehousesEdit = lazy(() => import('./Containers/Warehouses/WarehousesEdit'));

const Stocks = lazy(() => import('./Containers/Stocks/Stocks'));
const StocksCreate = lazy(() => import('./Containers/Stocks/StocksCreate'));
const StocksEdit = lazy(() => import('./Containers/Stocks/StocksEdit'));

const Stockmovements = lazy(() => import('./Containers/Stockmovements/Stockmovements'));
const StockmovementsDetail = lazy(() => import('./Containers/Stockmovements/StockmovementsDetail'));
const StockmovementsCreate = lazy(() => import('./Containers/Stockmovements/StockmovementsCreate'));
const StockmovementsEdit = lazy(() => import('./Containers/Stockmovements/StockmovementsEdit'));

const Stockdefines = lazy(() => import('./Containers/Stockdefines/Stockdefines'));
const StockdefinesCreate = lazy(() => import('./Containers/Stockdefines/StockdefinesCreate'));
const StockdefinesEdit = lazy(() => import('./Containers/Stockdefines/StockdefinesEdit'));

const Stocktypes = lazy(() => import('./Containers/Stocktypes/Stocktypes'));
const StocktypesCreate = lazy(() => import('./Containers/Stocktypes/StocktypesCreate'));
const StocktypesEdit = lazy(() => import('./Containers/Stocktypes/StocktypesEdit'));

const Stocktypegroups = lazy(() => import('./Containers/Stocktypegroups/Stocktypegroups'));
const StocktypegroupsCreate = lazy(() => import('./Containers/Stocktypegroups/StocktypegroupsCreate'));
const StocktypegroupsEdit = lazy(() => import('./Containers/Stocktypegroups/StocktypegroupsEdit'));

const Equipmentgroups = lazy(() => import('./Containers/Equipmentgroups/Equipmentgroups'));
const EquipmentgroupsCreate = lazy(() => import('./Containers/Equipmentgroups/EquipmentgroupsCreate'));
const EquipmentgroupsEdit = lazy(() => import('./Containers/Equipmentgroups/EquipmentgroupsEdit'));

const Equipments = lazy(() => import('./Containers/Equipments/Equipments'));
const EquipmentsCreate = lazy(() => import('./Containers/Equipments/EquipmentsCreate'));
const EquipmentsEdit = lazy(() => import('./Containers/Equipments/EquipmentsEdit'));


//-----------------------------END-----------------------------

const Tododefines = lazy(() => import('./Containers/Tododefines/Tododefines'));
const TododefinesCreate = lazy(() => import('./Containers/Tododefines/TododefinesCreate'));
const TododefinesEdit = lazy(() => import('./Containers/Tododefines/TododefinesEdit'));

const Todogroupdefines = lazy(() => import('./Containers/Todogroupdefines/Todogroupdefines'));
const TodogroupdefinesCreate = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesCreate'));
const TodogroupdefinesEdit = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesEdit'));

const Periods = lazy(() => import('./Containers/Periods/Periods'));
const PeriodsCreate = lazy(() => import('./Containers/Periods/PeriodsCreate'));
const PeriodsEdit = lazy(() => import('./Containers/Periods/PeriodsEdit'));

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

const Shiftdefines = lazy(() => import('./Containers/Shiftdefines/Shiftdefines'));
const ShiftdefinesCreate = lazy(() => import('./Containers/Shiftdefines/ShiftdefinesCreate'));
const ShiftdefinesEdit = lazy(() => import('./Containers/Shiftdefines/ShiftdefinesEdit'));

const Beds = lazy(() => import('./Containers/Beds/Beds'));
const BedsCreate = lazy(() => import('./Containers/Beds/BedsCreate'));
const BedsEdit = lazy(() => import('./Containers/Beds/BedsEdit'));

const Floors = lazy(() => import('./Containers/Floors/Floors'));
const FloorsCreate = lazy(() => import('./Containers/Floors/FloorsCreate'));
const FloorsEdit = lazy(() => import('./Containers/Floors/FloorsEdit'));

const Breakdowns = lazy(() => import('./Containers/Breakdowns/Breakdowns'));
const BreakdownsCreate = lazy(() => import('./Containers/Breakdowns/BreakdownsCreate'));
const BreakdownsEdit = lazy(() => import('./Containers/Breakdowns/BreakdownsEdit'));

const Mainteancies = lazy(() => import('./Containers/Mainteancies/Mainteancies'));
const MainteanciesCreate = lazy(() => import('./Containers/Mainteancies/MainteanciesCreate'));
const MainteanciesEdit = lazy(() => import('./Containers/Mainteancies/MainteanciesEdit'));

const Placeviews = lazy(() => import('./Containers/Placeviews/Placeviews'));
const PlaceviewsTransfer = lazy(() => import('./Containers/Placeviews/PlaceviewsTransfer'));

const Patientcashregisters = lazy(() => import('./Containers/Patientcashregisters/Patientcashregisters'));
const PatientcashregistersCreate = lazy(() => import('./Containers/Patientcashregisters/PatientcashregistersCreate'));
const PatientcashregistersEdit = lazy(() => import('./Containers/Patientcashregisters/PatientcashregistersEdit'));

const Patientcashmovements = lazy(() => import('./Containers/Patientcashmovements/Patientcashmovements'));
const PatientcashmovementsCreate = lazy(() => import('./Containers/Patientcashmovements/PatientcashmovementsCreate'));
const PatientcashmovementsEdit = lazy(() => import('./Containers/Patientcashmovements/PatientcashmovementsEdit'));

const Companycashmovements = lazy(() => import('./Containers/Companycashmovements/Companycashmovements'));
const CompanycashmovementsCreate = lazy(() => import('./Containers/Companycashmovements/CompanycashmovementsCreate'));
const CompanycashmovementsEdit = lazy(() => import('./Containers/Companycashmovements/CompanycashmovementsEdit'));

const Usagetypes = lazy(() => import('./Containers/Usagetypes/Usagetypes'));
const UsagetypesCreate = lazy(() => import('./Containers/Usagetypes/UsagetypesCreate'));
const UsagetypesEdit = lazy(() => import('./Containers/Usagetypes/UsagetypesEdit'));

const ProfileEdit = lazy(() => import('./Containers/Auth/ProfileEdit'));
const PasswordChange = lazy(() => import('./Containers/Auth/PasswordChange'));
const Passwordforget = lazy(() => import('./Containers/Auth/Passwordforget'));
const PasswordReset = lazy(() => import('./Containers/Auth/PasswordReset'));

const Appreports = lazy(() => import('./Containers/Appreports/Appreports'));

const Careplans = lazy(() => import('./Containers/Careplans/Careplans'));
const CareplansCreate = lazy(() => import('./Containers/Careplans/CareplansCreate'));
const CareplansEdit = lazy(() => import('./Containers/Careplans/CareplansEdit'));

const Supportplans = lazy(() => import('./Containers/Supportplans/Supportplans'));
const SupportplansCreate = lazy(() => import('./Containers/Supportplans/SupportplansCreate'));
const SupportplansEdit = lazy(() => import('./Containers/Supportplans/SupportplansEdit'));

const Supportplanlists = lazy(() => import('./Containers/Supportplanlists/Supportplanlists'));
const SupportplanlistsCreate = lazy(() => import('./Containers/Supportplanlists/SupportplanlistsCreate'));
const SupportplanlistsEdit = lazy(() => import('./Containers/Supportplanlists/SupportplanlistsEdit'));

const Helpstatus = lazy(() => import('./Containers/Helpstatus/Helpstatus'));
const HelpstatusCreate = lazy(() => import('./Containers/Helpstatus/HelpstatusCreate'));
const HelpstatusEdit = lazy(() => import('./Containers/Helpstatus/HelpstatusEdit'));

const Makingtypes = lazy(() => import('./Containers/Makingtypes/Makingtypes'));
const MakingtypesCreate = lazy(() => import('./Containers/Makingtypes/MakingtypesCreate'));
const MakingtypesEdit = lazy(() => import('./Containers/Makingtypes/MakingtypesEdit'));

const Ratings = lazy(() => import('./Containers/Ratings/Ratings'));
const RatingsCreate = lazy(() => import('./Containers/Ratings/RatingsCreate'));
const RatingsEdit = lazy(() => import('./Containers/Ratings/RatingsEdit'));

const Requiredperiods = lazy(() => import('./Containers/Requiredperiods/Requiredperiods'));
const RequiredperiodsCreate = lazy(() => import('./Containers/Requiredperiods/RequiredperiodsCreate'));
const RequiredperiodsEdit = lazy(() => import('./Containers/Requiredperiods/RequiredperiodsEdit'));

const Professions = lazy(() => import('./Containers/Professions/Professions'));
const ProfessionsCreate = lazy(() => import('./Containers/Professions/ProfessionsCreate'));
const ProfessionsEdit = lazy(() => import('./Containers/Professions/ProfessionsEdit'));

const Personelpresettings = lazy(() => import('./Containers/Personelpresettings/Personelpresettings'));
const PersonelpresettingsCreate = lazy(() => import('./Containers/Personelpresettings/PersonelpresettingsCreate'));
const PersonelpresettingsEdit = lazy(() => import('./Containers/Personelpresettings/PersonelpresettingsEdit'));

const Professionpresettings = lazy(() => import('./Containers/Professionpresettings/Professionpresettings'));
const ProfessionpresettingsCreate = lazy(() => import('./Containers/Professionpresettings/ProfessionpresettingsCreate'));
const ProfessionpresettingsEdit = lazy(() => import('./Containers/Professionpresettings/ProfessionpresettingsEdit'));

const Personelshifts = lazy(() => import('./Containers/Personelshifts/Personelshifts'));
const PersonelshiftsCreate = lazy(() => import('./Containers/Personelshifts/PersonelshiftsCreate'));
const PersonelshiftsEdit = lazy(() => import('./Containers/Personelshifts/PersonelshiftsEdit'));

const Claimpaymentparameters = lazy(() => import('./Containers/Claimpaymentparameters/Claimpaymentparameters'));
const ClaimpaymentparametersCreate = lazy(() => import('./Containers/Claimpaymentparameters/ClaimpaymentparametersCreate'));
const ClaimpaymentparametersEdit = lazy(() => import('./Containers/Claimpaymentparameters/ClaimpaymentparametersEdit'));

const Claimpayments = lazy(() => import('./Containers/Claimpayments/Claimpayments'));
const ClaimpaymentsCreate = lazy(() => import('./Containers/Claimpayments/ClaimpaymentsCreate'));

const Patientfollowup = lazy(() => import('./Containers/Patientfollowup/Patientfollowup'));

const Log = lazy(() => import('./Containers/Log/Log'));

const Home = lazy(() => import('./Pages/Home'));
const Notfoundpage = lazy(() => import('./Components/Notfoundpage'));

class Routes extends Component {
  render() {

    const { Profile } = this.props

    const roles = Profile?.roles

    const routes = [
      { exact: true, path: "/Login", auth: false, component: Login },
      { exact: true, path: "/Register", auth: false, component: Register },
      { exact: true, path: "/Home", auth: true, component: Home, permission: '' },
      { exact: true, path: "/", auth: true, component: Home, permission: '' },

      { exact: true, path: "/Approve", auth: true, component: Approve, permission: 'roleview' },

      { exact: true, path: "/Roles", auth: true, component: Roles, permission: 'roleview' },
      { exact: true, path: "/Roles/Create", auth: true, component: RolesCreate, permission: 'roleadd' },
      { exact: true, path: "/Roles/:RoleID/Edit", auth: true, component: RolesEdit, permission: 'roleupdate' },

      { exact: true, path: "/Departments", auth: true, component: Departments, permission: 'departmentview' }, ,
      { exact: true, path: "/Departments/Create", auth: true, component: DepartmentsCreate, permission: 'departmentadd' },
      { exact: true, path: "/Departments/:DepartmentID/Edit", auth: true, component: DepartmentsEdit, permission: 'departmentupdate' },

      { exact: true, path: "/Cases", auth: true, component: Cases, permission: 'caseview' },
      { exact: true, path: "/Cases/Create", auth: true, component: CasesCreate, permission: 'caseadd' },
      { exact: true, path: "/Cases/:CaseID/Edit", auth: true, component: CasesEdit, permission: 'caseupdate' },

      { exact: true, path: "/Units", auth: true, component: Units, permission: 'unitview' },
      { exact: true, path: "/Units/Create", auth: true, component: UnitsCreate, permission: 'unitadd' },
      { exact: true, path: "/Units/:UnitID/Edit", auth: true, component: UnitsEdit, permission: 'unitupdate' },

      { exact: true, path: "/Stockdefines", auth: true, component: Stockdefines, permission: 'stockdefineview' },
      { exact: true, path: "/Stockdefines/Create", auth: true, component: StockdefinesCreate, permission: 'stockdefineadd' },
      { exact: true, path: "/Stockdefines/:StockdefineID/Edit", auth: true, component: StockdefinesEdit, permission: 'stockdefineupdate' },

      { exact: true, path: "/Stocks", auth: true, component: Stocks, permission: 'stockview' },
      { exact: true, path: "/Stocks/Create", auth: true, component: StocksCreate, permission: 'stockadd' },
      { exact: true, path: "/Stocks/:StockID/Edit", auth: true, component: StocksEdit, permission: 'stockupdate' },

      { exact: true, path: "/Stocktypes", auth: true, component: Stocktypes, permission: 'stocktypeview' },
      { exact: true, path: "/Stocktypes/Create", auth: true, component: StocktypesCreate, permission: 'stocktypeadd' },
      { exact: true, path: "/Stocktypes/:StocktypeID/Edit", auth: true, component: StocktypesEdit, permission: 'stocktypeupdate' },

      { exact: true, path: "/Stocktypegroups", auth: true, component: Stocktypegroups, permission: 'stocktypegroupview' },
      { exact: true, path: "/Stocktypegroups/Create", auth: true, component: StocktypegroupsCreate, permission: 'stocktypegroupadd' },
      { exact: true, path: "/Stocktypegroups/:StocktypegroupID/Edit", auth: true, component: StocktypegroupsEdit, permission: 'stocktypegroupupdate' },

      { exact: true, path: "/Stockmovements", auth: true, component: Stockmovements, permission: 'stockmovementview' },
      { exact: true, path: "/Stockmovements/Create", auth: true, component: StockmovementsCreate, permission: 'stockmovementadd' },
      { exact: true, path: "/Stockmovements/:StockmovementID", auth: true, component: StockmovementsDetail, permission: 'stockmovementview' },
      { exact: true, path: "/Stockmovements/:StockmovementID/Edit", auth: true, component: StockmovementsEdit, permission: 'stockmovementupdate' },

      { exact: true, path: "/Users", auth: true, component: Users, permission: 'userview' },
      { exact: true, path: "/Users/Create", auth: true, component: UsersCreate, permission: 'useradd' },
      { exact: true, path: "/Users/:UserID", auth: true, component: UsersDetail, permission: 'userview' },
      { exact: true, path: "/Users/:UserID/Edit", auth: true, component: UsersEdit, permission: 'userupdate' },

      { exact: true, path: "/Files", auth: true, component: Files, permission: 'fileview' },
      { exact: true, path: "/Files/Create", auth: true, component: FilesCreate, permission: 'fileadd' },
      { exact: true, path: "/Files/:FileID/Edit", auth: true, component: FilesEdit, permission: 'fileupdate' },

      { exact: true, path: "/Costumertypes", auth: true, component: Costumertypes, permission: 'costumertypeview' },
      { exact: true, path: "/Costumertypes/Create", auth: true, component: CostumertypesCreate, permission: 'costumertypeadd' },
      { exact: true, path: "/Costumertypes/:CostumertypeID/Edit", auth: true, component: CostumertypesEdit, permission: 'costumertypeupdate' },

      { exact: true, path: "/Patienttypes", auth: true, component: Patienttypes, permission: 'patientview' },
      { exact: true, path: "/Patienttypes/Create", auth: true, component: PatienttypesCreate, permission: 'patientadd' },
      { exact: true, path: "/Patienttypes/:PatienttypeID/Edit", auth: true, component: PatienttypesEdit, permission: 'patientupdate' },

      { exact: true, path: "/Patientdefines", auth: true, component: Patientdefines, permission: 'patientdefineview' },
      { exact: true, path: "/Patientdefines/Create", auth: true, component: PatientdefinesCreate, permission: 'patientdefineadd' },
      { exact: true, path: "/Patientdefines/:PatientdefineID/Edit", auth: true, component: PatientdefinesEdit, permission: 'patientdefineupdate' },

      { exact: true, path: "/Patients", auth: true, component: Patients, permission: 'patientview' },
      { exact: true, path: "/Patients/:PatientID", auth: true, component: PatientsDetail, permission: 'patientview' },
      { exact: true, path: "/Patients/:PatientID/Editcash", auth: true, component: PatientsEditcash, permission: 'patientupdate' },
      { exact: true, path: "/Patients/:PatientID/Editsupportplan", auth: true, component: PatientsEditsupportplan, permission: 'patientupdate' },
      { exact: true, path: "/Patients/:PatientID/Editroutine", auth: true, component: PatientsEditroutine, permission: 'patientupdate' },
      { exact: true, path: "/Patients/:PatientID/Editfile", auth: true, component: PatientsFiles, permission: 'patientupdate' },

      { exact: true, path: "/Patientscases", auth: true, component: Patientscases, permission: 'patientview' },
      { exact: true, path: "/Patientfollowup", auth: true, component: Patientfollowup, permission: 'patientview' },

      { exact: true, path: "/Purchaseorders", auth: true, component: Purchaseorders, permission: 'purchaseorderview' },
      { exact: true, path: "/Purchaseorders/Create", auth: true, component: PurchaseordersCreate, permission: 'purchaseorderadd' },
      { exact: true, path: "/Purchaseorders/:PurchaseorderID/Edit", auth: true, component: PurchaseordersEdit, permission: 'purchaseorderupdate' },

      { exact: true, path: "/Warehouses", auth: true, component: Warehouses, permission: 'warehouseview' },
      { exact: true, path: "/Warehouses/Create", auth: true, component: WarehousesCreate, permission: 'warehouseadd' },
      { exact: true, path: "/Warehouses/:WarehouseID/Edit", auth: true, component: WarehousesEdit, permission: 'warehouseupdate' },

      { exact: true, path: "/Tododefines", auth: true, component: Tododefines, permission: 'tododefineview' },
      { exact: true, path: "/Tododefines/Create", auth: true, component: TododefinesCreate, permission: 'tododefineadd' },
      { exact: true, path: "/Tododefines/:TododefineID/Edit", auth: true, component: TododefinesEdit, permission: 'tododefineupdate' },

      { exact: true, path: "/Todogroupdefines", auth: true, component: Todogroupdefines, permission: 'todogroupdefineview' },
      { exact: true, path: "/Todogroupdefines/Create", auth: true, component: TodogroupdefinesCreate, permission: 'todogroupdefineadd' },
      { exact: true, path: "/Todogroupdefines/:TodogroupdefineID/Edit", auth: true, component: TodogroupdefinesEdit, permission: 'todogroupdefineupdate' },

      { exact: true, path: "/Mailsettings", auth: true, component: Mailsettings, permission: 'mailsettingview' },
      { exact: true, path: "/Mailsettings/Create", auth: true, component: MailsettingsCreate, permission: 'mailsettingadd' },
      { exact: true, path: "/Mailsettings/:MailsettingID/Edit", auth: true, component: MailsettingsEdit, permission: 'mailsettingupdate' },

      { exact: true, path: "/Todos", auth: true, component: Todos, permission: 'todoscreen' },

      { exact: true, path: "/Printtemplates", auth: true, component: Printtemplates, permission: 'printtemplateview' },
      { exact: true, path: "/Printtemplates/Create", auth: true, component: PrinttemplatesCreate, permission: 'printtemplateadd' },
      { exact: true, path: "/Printtemplates/:PrinttemplateID/Edit", auth: true, component: PrinttemplatesEdit, permission: 'printtemplateupdate' },

      { exact: true, path: "/Periods", auth: true, component: Periods, permission: 'requiredperiodview' },
      { exact: true, path: "/Periods/Create", auth: true, component: PeriodsCreate, permission: 'requiredperiodadd' },
      { exact: true, path: "/Periods/:PeriodID/Edit", auth: true, component: PeriodsEdit, permission: 'requiredperiodupdate' },

      { exact: true, path: "/Rules", auth: true, component: Rules, permission: 'ruleview' },
      { exact: true, path: "/Rules/Create", auth: true, component: RulesCreate, permission: 'ruleadd' },
      { exact: true, path: "/Rules/:RuleID/Edit", auth: true, component: RulesEdit, permission: 'ruleupdate' },

      { exact: true, path: "/Beds", auth: true, component: Beds, permission: 'bedview' },
      { exact: true, path: "/Beds/Create", auth: true, component: BedsCreate, permission: 'bedadd' },
      { exact: true, path: "/Beds/:BedID/Edit", auth: true, component: BedsEdit, permission: 'bedupdate' },

      { exact: true, path: "/Floors", auth: true, component: Floors, permission: 'floorview' },
      { exact: true, path: "/Floors/Create", auth: true, component: FloorsCreate, permission: 'flooradd' },
      { exact: true, path: "/Floors/:FloorID/Edit", auth: true, component: FloorsEdit, permission: 'floorupdate' },

      { exact: true, path: "/Rooms", auth: true, component: Rooms, permission: 'roomview' },
      { exact: true, path: "/Rooms/Create", auth: true, component: RoomsCreate, permission: 'roomadd' },
      { exact: true, path: "/Rooms/:RoomID/Edit", auth: true, component: RoomsEdit, permission: 'roomupdate' },

      { exact: true, path: "/Shiftdefines", auth: true, component: Shiftdefines, permission: 'shiftdefineview' },
      { exact: true, path: "/Shiftdefines/Create", auth: true, component: ShiftdefinesCreate, permission: 'shiftdefineadd' },
      { exact: true, path: "/Shiftdefines/:ShiftdefineID/Edit", auth: true, component: ShiftdefinesEdit, permission: 'shiftdefineupdate' },

      { exact: true, path: "/Equipmentgroups", auth: true, component: Equipmentgroups, permission: 'equipmentgroupview' },
      { exact: true, path: "/Equipmentgroups/Create", auth: true, component: EquipmentgroupsCreate, permission: 'equipmentgroupadd' },
      { exact: true, path: "/Equipmentgroups/:EquipmentgroupID/Edit", auth: true, component: EquipmentgroupsEdit, permission: 'equipmentgroupupdate' },

      { exact: true, path: "/Equipments", auth: true, component: Equipments, permission: 'equipmentview' },
      { exact: true, path: "/Equipments/Create", auth: true, component: EquipmentsCreate, permission: 'equipmentadd' },
      { exact: true, path: "/Equipments/:EquipmentID/Edit", auth: true, component: EquipmentsEdit, permission: 'equipmentupdate' },

      { exact: true, path: "/Breakdowns", auth: true, component: Breakdowns, permission: 'breakdownview' },
      { exact: true, path: "/Breakdowns/Create", auth: true, component: BreakdownsCreate, permission: 'breakdownadd' },
      { exact: true, path: "/Breakdowns/:BreakdownID/Edit", auth: true, component: BreakdownsEdit, permission: 'breakdownupdate' },

      { exact: true, path: "/Mainteancies", auth: true, component: Mainteancies, permission: 'mainteanceview' },
      { exact: true, path: "/Mainteancies/Create", auth: true, component: MainteanciesCreate, permission: 'mainteanceadd' },
      { exact: true, path: "/Mainteancies/:MainteanceID/Edit", auth: true, component: MainteanciesEdit, permission: 'mainteanceupdate' },

      { exact: true, path: "/Placeviews", auth: true, component: Placeviews, permission: 'placeviewview' },
      { exact: true, path: "/Placeviews/Transfer", auth: true, component: PlaceviewsTransfer, permission: 'placeviewtransfer' },

      { exact: true, path: "/Patientcashregisters", auth: true, component: Patientcashregisters, permission: 'patientcashregisterview' },
      { exact: true, path: "/Patientcashregisters/Create", auth: true, component: PatientcashregistersCreate, permission: 'patientcashregisteradd' },
      { exact: true, path: "/Patientcashregisters/:PatientcashregisterID/Edit", auth: true, component: PatientcashregistersEdit, permission: 'patientcashregisterupdate' },

      { exact: true, path: "/Patientcashmovements", auth: true, component: Patientcashmovements, permission: 'patientcashmovementview' },
      { exact: true, path: "/Patientcashmovements/Create", auth: true, component: PatientcashmovementsCreate, permission: 'patientcashmovementadd' },
      { exact: true, path: "/Patientcashmovements/:PatientcashmovementID/Edit", auth: true, component: PatientcashmovementsEdit, permission: 'patientcashmovementupdate' },

      { exact: true, path: "/Companycashmovements", auth: true, component: Companycashmovements, permission: 'companycashmovementview' },
      { exact: true, path: "/Companycashmovements/Create", auth: true, component: CompanycashmovementsCreate, permission: 'companycashmovementadd' },
      { exact: true, path: "/Companycashmovements/:CompanycashmovementID/Edit", auth: true, component: CompanycashmovementsEdit, permission: 'companycashmovementupdate' },

      { exact: true, path: "/Supportplans", auth: true, component: Supportplans, permission: 'supportplanview' },
      { exact: true, path: "/Supportplans/Create", auth: true, component: SupportplansCreate, permission: 'supportplanadd' },
      { exact: true, path: "/Supportplans/:SupportplanID/Edit", auth: true, component: SupportplansEdit, permission: 'supportplanupdate' },

      { exact: true, path: "/Supportplanlists", auth: true, component: Supportplanlists, permission: 'supportplanlistview' },
      { exact: true, path: "/Supportplanlists/Create", auth: true, component: SupportplanlistsCreate, permission: 'supportplanlistadd' },
      { exact: true, path: "/Supportplanlists/:SupportplanlistID/Edit", auth: true, component: SupportplanlistsEdit, permission: 'supportplanlistupdate' },

      { exact: true, path: "/Careplans", auth: true, component: Careplans, permission: 'careplanview' },
      { exact: true, path: "/Careplans/Create", auth: true, component: CareplansCreate, permission: 'careplanadd' },
      { exact: true, path: "/Careplans/:CareplanID/Edit", auth: true, component: CareplansEdit, permission: 'careplanupdate' },

      { exact: true, path: "/Usagetypes", auth: true, component: Usagetypes, permission: 'usagetypeview' },
      { exact: true, path: "/Usagetypes/Create", auth: true, component: UsagetypesCreate, permission: 'usagetypeadd' },
      { exact: true, path: "/Usagetypes/:UsagetypeID/Edit", auth: true, component: UsagetypesEdit, permission: 'usagetypeupdate' },

      { exact: true, path: "/Helpstatus", auth: true, component: Helpstatus, permission: 'helpstatuview' },
      { exact: true, path: "/Helpstatus/Create", auth: true, component: HelpstatusCreate, permission: 'helpstatuadd' },
      { exact: true, path: "/Helpstatus/:HelpstatuID/Edit", auth: true, component: HelpstatusEdit, permission: 'helpstatuupdate' },

      { exact: true, path: "/Makingtypes", auth: true, component: Makingtypes, permission: 'makingtypeview' },
      { exact: true, path: "/Makingtypes/Create", auth: true, component: MakingtypesCreate, permission: 'makingtypeadd' },
      { exact: true, path: "/Makingtypes/:MakingtypeID/Edit", auth: true, component: MakingtypesEdit, permission: 'makingtypeupdate' },

      { exact: true, path: "/Ratings", auth: true, component: Ratings, permission: 'ratingview' },
      { exact: true, path: "/Ratings/Create", auth: true, component: RatingsCreate, permission: 'ratingadd' },
      { exact: true, path: "/Ratings/:RatingID/Edit", auth: true, component: RatingsEdit, permission: 'ratingupdate' },

      { exact: true, path: "/Professions", auth: true, component: Professions, permission: 'professionview' },
      { exact: true, path: "/Professions/Create", auth: true, component: ProfessionsCreate, permission: 'professionadd' },
      { exact: true, path: "/Professions/:ProfessionID/Edit", auth: true, component: ProfessionsEdit, permission: 'professionupdate' },

      { exact: true, path: "/Personelpresettings", auth: true, component: Personelpresettings, permission: 'personelpresettingview' },
      { exact: true, path: "/Personelpresettings/Create", auth: true, component: PersonelpresettingsCreate, permission: 'personelpresettingadd' },
      { exact: true, path: "/Personelpresettings/:PersonelpresettingID/Edit", auth: true, component: PersonelpresettingsEdit, permission: 'personelpresettingupdate' },

      { exact: true, path: "/Professionpresettings", auth: true, component: Professionpresettings, permission: 'professionpresettingview' },
      { exact: true, path: "/Professionpresettings/Create", auth: true, component: ProfessionpresettingsCreate, permission: 'professionpresettingadd' },
      { exact: true, path: "/Professionpresettings/:ProfessionpresettingID/Edit", auth: true, component: ProfessionpresettingsEdit, permission: 'professionpresettingupdate' },

      { exact: true, path: "/Requiredperiods", auth: true, component: Requiredperiods, permission: 'requiredperiodview' },
      { exact: true, path: "/Requiredperiods/Create", auth: true, component: RequiredperiodsCreate, permission: 'requiredperiodadd' },
      { exact: true, path: "/Requiredperiods/:RequiredperiodID/Edit", auth: true, component: RequiredperiodsEdit, permission: 'requiredperiodupdate' },

      { exact: true, path: "/Personelshifts", auth: true, component: Personelshifts, permission: 'personelshiftview' },
      { exact: true, path: "/Personelshifts/Create", auth: true, component: PersonelshiftsCreate, permission: 'personelshiftadd' },
      { exact: true, path: "/Personelshifts/:PersonelshiftID/Edit", auth: true, component: PersonelshiftsEdit, permission: 'personelshiftupdate' },

      { exact: true, path: "/Appreports", auth: true, component: Appreports, permission: 'admin' },
      { exact: true, path: "/Logs", auth: true, component: Log, permission: 'admin' },

      { exact: true, path: "/Preregistrations", auth: true, component: Preregistrations, permission: 'preregistrationview' },
      { exact: true, path: "/Preregistrations/Create", auth: true, component: PreregistrationsCreate, permission: 'preregistrationadd' },
      { exact: true, path: "/Preregistrations/:PatientID/Edit", auth: true, component: PreregistrationsEdit, permission: 'preregistrationupdate' },

      { exact: true, path: "/Claimpaymentparameters", auth: true, component: Claimpaymentparameters, permission: 'claimpaymentparameterview' },
      { exact: true, path: "/Claimpaymentparameters/Create", auth: true, component: ClaimpaymentparametersCreate, permission: 'claimpaymentparameteradd' },
      { exact: true, path: "/Claimpaymentparameters/:ClaimpaymentparameterID/Edit", auth: true, component: ClaimpaymentparametersEdit, permission: 'claimpaymentparameterupdate' },

      { exact: true, path: "/Claimpayments", auth: true, component: Claimpayments, permission: 'claimpaymentview' },
      { exact: true, path: "/Claimpayments/Create", auth: true, component: ClaimpaymentsCreate, permission: 'claimpaymentadd' },

      { exact: true, path: "/Profile/Edit", auth: true, component: ProfileEdit, permission: 'basic' },
      { exact: true, path: "/Profile/Change-Password", auth: true, component: PasswordChange, permission: 'basic' },
      { exact: true, path: "/About", auth: true, component: About },
      { exact: true, path: "/Passwordreset/:RequestID", auth: false, component: PasswordReset },
      { exact: true, path: "/Forgetpassword", auth: false, component: Passwordforget },

      { exact: false, path: "*", auth: false, component: Notfoundpage }
    ]

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route, index) => {
            return route.auth === true ? (((roles || []).includes('admin') || (roles || []).includes(route.permission)) ? <ProtectedRoute key={index} exact={route.exact} path={route.path} component={route.component} /> : null) :
              <Route key={index} exact={route.exact} path={route.path} component={route.component} />
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default Routes;
