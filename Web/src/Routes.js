import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ProtectedRoute, Spinner } from './Components'
import validator from './Utils/Validator';
import privileges from './Constants/Privileges';

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
const UsersMovements = lazy(() => import('./Containers/Users/UsersMovements'));
const UsersCreate = lazy(() => import('./Containers/Users/UsersCreate'));
const UsersEdit = lazy(() => import('./Containers/Users/UsersEdit'));

const Files = lazy(() => import('./Containers/Files/Files'));

const Companyfiles = lazy(() => import('./Containers/Companyfiles/Companyfiles'));
const CompanyfilesCreate = lazy(() => import('./Containers/Companyfiles/CompanyfilesCreate'));

const Costumertypes = lazy(() => import('./Containers/Costumertypes/Costumertypes'));
const CostumertypesCreate = lazy(() => import('./Containers/Costumertypes/CostumertypesCreate'));
const CostumertypesEdit = lazy(() => import('./Containers/Costumertypes/CostumertypesEdit'));

const Patients = lazy(() => import('./Containers/Patients/Patients'));
const PatientsDetail = lazy(() => import('./Containers/Patients/PatientsDetail'));
const PatientsEditcash = lazy(() => import('./Containers/Patients/PatientsEditcash'));
const PatientsMovements = lazy(() => import('./Containers/Patients/PatientMovements'));
const PatientEventmovements = lazy(() => import('./Containers/Patients/PatientEventmovements'));
const PatientsEditsupportplan = lazy(() => import('./Containers/Patients/PatientsEditsupportplan'));
const PatientsEditroutine = lazy(() => import('./Containers/Patients/PatientsEditroutine'));
const PatientsFiles = lazy(() => import('./Containers/Patients/PatientsFiles'));

const Preregistrations = lazy(() => import('./Containers/Preregistrations/Preregistrations'));
const PreregistrationsCreate = lazy(() => import('./Containers/Preregistrations/PreregistrationsCreate'));
const PreregistrationsEdit = lazy(() => import('./Containers/Preregistrations/PreregistrationsEdit'));

const Patientdefines = lazy(() => import('./Containers/Patientdefines/Patientdefines'));
const PatientdefinesCreate = lazy(() => import('./Containers/Patientdefines/PatientdefinesCreate'));
const PatientdefinesEdit = lazy(() => import('./Containers/Patientdefines/PatientdefinesEdit'));

const Patienttypes = lazy(() => import('./Containers/Patienttypes/Patienttypes'));
const PatienttypesCreate = lazy(() => import('./Containers/Patienttypes/PatienttypesCreate'));
const PatienttypesEdit = lazy(() => import('./Containers/Patienttypes/PatienttypesEdit'));

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

const Tododefines = lazy(() => import('./Containers/Tododefines/Tododefines'));
const TododefinesCreate = lazy(() => import('./Containers/Tododefines/TododefinesCreate'));
const TododefinesEdit = lazy(() => import('./Containers/Tododefines/TododefinesEdit'));

const Todogroupdefines = lazy(() => import('./Containers/Todogroupdefines/Todogroupdefines'));
const TodogroupdefinesCreate = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesCreate'));
const TodogroupdefinesEdit = lazy(() => import('./Containers/Todogroupdefines/TodogroupdefinesEdit'));

const Periods = lazy(() => import('./Containers/Periods/Periods'));
const PeriodsCreate = lazy(() => import('./Containers/Periods/PeriodsCreate'));
const PeriodsEdit = lazy(() => import('./Containers/Periods/PeriodsEdit'));

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

const Patienteventdefines = lazy(() => import('./Containers/Patienteventdefines/Patienteventdefines'));
const PatienteventdefinesCreate = lazy(() => import('./Containers/Patienteventdefines/PatienteventdefinesCreate'));
const PatienteventdefinesEdit = lazy(() => import('./Containers/Patienteventdefines/PatienteventdefinesEdit'));

const Patienthealthcasedefines = lazy(() => import('./Containers/Patienthealthcasedefines/Patienthealthcasedefines'));
const PatienthealthcasedefinesCreate = lazy(() => import('./Containers/Patienthealthcasedefines/PatienthealthcasedefinesCreate'));
const PatienthealthcasedefinesEdit = lazy(() => import('./Containers/Patienthealthcasedefines/PatienthealthcasedefinesEdit'));

const Patienthealthcases = lazy(() => import('./Containers/Patienthealthcases/Patienthealthcases'));
const PatienthealthcasesCreate = lazy(() => import('./Containers/Patienthealthcases/PatienthealthcasesCreate'));
const PatienthealthcasesEdit = lazy(() => import('./Containers/Patienthealthcases/PatienthealthcasesEdit'));

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

const Careplanparameters = lazy(() => import('./Containers/Careplanparameters/Careplanparameters'));
const CareplanparametersCreate = lazy(() => import('./Containers/Careplanparameters/CareplanparametersCreate'));
const CareplanparametersEdit = lazy(() => import('./Containers/Careplanparameters/CareplanparametersEdit'));

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
const ClaimpaymentsDetail = lazy(() => import('./Containers/Claimpayments/ClaimpaymentsDetail'));

const Trainings = lazy(() => import('./Containers/Trainings/Trainings'));
const TrainingsCreate = lazy(() => import('./Containers/Trainings/TrainingsCreate'));
const TrainingsEdit = lazy(() => import('./Containers/Trainings/TrainingsEdit'));

const Patientactivities = lazy(() => import('./Containers/Patientactivities/Patientactivities'));
const PatientactivitiesCreate = lazy(() => import('./Containers/Patientactivities/PatientactivitiesCreate'));
const PatientactivitiesEdit = lazy(() => import('./Containers/Patientactivities/PatientactivitiesEdit'));

const Patientvisits = lazy(() => import('./Containers/Patientvisits/Patientvisits'));
const PatientvisitsCreate = lazy(() => import('./Containers/Patientvisits/PatientvisitsCreate'));
const PatientvisitsEdit = lazy(() => import('./Containers/Patientvisits/PatientvisitsEdit'));

const Userincidents = lazy(() => import('./Containers/Userincidents/Userincidents'));
const UserincidentsCreate = lazy(() => import('./Containers/Userincidents/UserincidentsCreate'));
const UserincidentsEdit = lazy(() => import('./Containers/Userincidents/UserincidentsEdit'));

const Patientfollowup = lazy(() => import('./Containers/Patientfollowup/Patientfollowup'));

const Patientsrollcall = lazy(() => import('./Containers/Patientsrollcall/Patientsrollcall'));

const Usernotifications = lazy(() => import('./Containers/Usernotifications/Usernotifications'));

const Log = lazy(() => import('./Containers/Log/Log'));

const Overview = lazy(() => import('./Containers/Overview/Overview'));
const Overviewcard = lazy(() => import('./Containers/Overviewcard/Overviewcard'));
const Overviewhealthcarecards = lazy(() => import('./Containers/Overviewhealthcarecards/Overviewhealthcarecards'));

const Surveys = lazy(() => import('./Containers/Surveys/Surveys'));
const SurveysCreate = lazy(() => import('./Containers/Surveys/SurveysCreate'));
const SurveysEdit = lazy(() => import('./Containers/Surveys/SurveysEdit'));

const Patienteventmovements = lazy(() => import('./Containers/Patienteventmovements/Patienteventmovements'));
const PatienteventmovementsCreate = lazy(() => import('./Containers/Patienteventmovements/PatienteventmovementsCreate'));
const PatienteventmovementsEdit = lazy(() => import('./Containers/Patienteventmovements/PatienteventmovementsEdit'));

const Mainteanceplans = lazy(() => import('./Containers/Mainteanceplans/Mainteanceplans'));
const MainteanceplansCreate = lazy(() => import('./Containers/Mainteanceplans/MainteanceplansCreate'));
const MainteanceplansEdit = lazy(() => import('./Containers/Mainteanceplans/MainteanceplansEdit'));

const Home = lazy(() => import('./Pages/Home'));
const Notfoundpage = lazy(() => import('./Components/Notfoundpage'));

class Routes extends Component {
  render() {

    const { Profile } = this.props

    const roles = Profile?.roles

    const routes = [
      { exact: true, path: "/Login", auth: false, component: Login },
      { exact: true, path: "/Register", auth: false, component: Register },
      { exact: true, path: "/Home", auth: true, component: Home, permission: privileges.basic },
      { exact: true, path: "/", auth: true, component: Home, permission: privileges.basic },

      { exact: true, path: "/Approve", auth: true, component: Approve, permission: privileges.approveview },

      { exact: true, path: "/Roles", auth: true, component: Roles, permission: privileges.roleview },
      { exact: true, path: "/Roles/Create", auth: true, component: RolesCreate, permission: privileges.roleadd },
      { exact: true, path: "/Roles/:RoleID/Edit", auth: true, component: RolesEdit, permission: privileges.roleupdate },

      { exact: true, path: "/Departments", auth: true, component: Departments, permission: privileges.departmentview }, ,
      { exact: true, path: "/Departments/Create", auth: true, component: DepartmentsCreate, permission: privileges.departmentadd },
      { exact: true, path: "/Departments/:DepartmentID/Edit", auth: true, component: DepartmentsEdit, permission: privileges.departmentupdate },

      { exact: true, path: "/Cases", auth: true, component: Cases, permission: privileges.caseview },
      { exact: true, path: "/Cases/Create", auth: true, component: CasesCreate, permission: privileges.caseadd },
      { exact: true, path: "/Cases/:CaseID/Edit", auth: true, component: CasesEdit, permission: privileges.caseupdate },

      { exact: true, path: "/Units", auth: true, component: Units, permission: privileges.unitview },
      { exact: true, path: "/Units/Create", auth: true, component: UnitsCreate, permission: privileges.unitadd },
      { exact: true, path: "/Units/:UnitID/Edit", auth: true, component: UnitsEdit, permission: privileges.unitupdate },

      { exact: true, path: "/Stockdefines", auth: true, component: Stockdefines, permission: privileges.stockdefineview },
      { exact: true, path: "/Stockdefines/Create", auth: true, component: StockdefinesCreate, permission: privileges.stockdefineadd },
      { exact: true, path: "/Stockdefines/:StockdefineID/Edit", auth: true, component: StockdefinesEdit, permission: privileges.stockdefineupdate },

      { exact: true, path: "/Stocks", auth: true, component: Stocks, permission: privileges.stockview },
      { exact: true, path: "/Stocks/Create", auth: true, component: StocksCreate, permission: privileges.stockadd },
      { exact: true, path: "/Stocks/:StockID/Edit", auth: true, component: StocksEdit, permission: privileges.stockupdate },

      { exact: true, path: "/Stocktypes", auth: true, component: Stocktypes, permission: privileges.stocktypeview },
      { exact: true, path: "/Stocktypes/Create", auth: true, component: StocktypesCreate, permission: privileges.stocktypeadd },
      { exact: true, path: "/Stocktypes/:StocktypeID/Edit", auth: true, component: StocktypesEdit, permission: privileges.stocktypeupdate },

      { exact: true, path: "/Stocktypegroups", auth: true, component: Stocktypegroups, permission: privileges.stocktypegroupview },
      { exact: true, path: "/Stocktypegroups/Create", auth: true, component: StocktypegroupsCreate, permission: privileges.stocktypegroupadd },
      { exact: true, path: "/Stocktypegroups/:StocktypegroupID/Edit", auth: true, component: StocktypegroupsEdit, permission: privileges.stocktypegroupupdate },

      { exact: true, path: "/Stockmovements", auth: true, component: Stockmovements, permission: privileges.stockmovementview },
      { exact: true, path: "/Stockmovements/Create", auth: true, component: StockmovementsCreate, permission: privileges.stockmovementadd },
      { exact: true, path: "/Stockmovements/:StockmovementID/Edit", auth: true, component: StockmovementsEdit, permission: privileges.stockmovementupdate },

      { exact: true, path: "/Users", auth: true, component: Users, permission: privileges.userview },
      { exact: true, path: "/Users/Create", auth: true, component: UsersCreate, permission: privileges.useradd },
      { exact: true, path: "/Users/:UserID/Movements", auth: true, component: UsersMovements, permission: privileges.userupdate },
      { exact: true, path: "/Users/:UserID", auth: true, component: UsersDetail, permission: privileges.userview },
      { exact: true, path: "/Users/:UserID/Edit", auth: true, component: UsersEdit, permission: privileges.userupdate },

      { exact: true, path: "/Files", auth: true, component: Files, permission: privileges.fileview },
      { exact: true, path: "/Companyfiles", auth: true, component: Companyfiles, permission: privileges.companyfileview },
      { exact: true, path: "/Companyfiles/Create", auth: true, component: CompanyfilesCreate, permission: privileges.fileadd },

      { exact: true, path: "/Costumertypes", auth: true, component: Costumertypes, permission: privileges.costumertypeview },
      { exact: true, path: "/Costumertypes/Create", auth: true, component: CostumertypesCreate, permission: privileges.costumertypeadd },
      { exact: true, path: "/Costumertypes/:CostumertypeID/Edit", auth: true, component: CostumertypesEdit, permission: privileges.costumertypeupdate },

      { exact: true, path: "/Patienttypes", auth: true, component: Patienttypes, permission: privileges.patienttypeview },
      { exact: true, path: "/Patienttypes/Create", auth: true, component: PatienttypesCreate, permission: privileges.patienttypeadd },
      { exact: true, path: "/Patienttypes/:PatienttypeID/Edit", auth: true, component: PatienttypesEdit, permission: privileges.patienttypeupdate },

      { exact: true, path: "/Patientdefines", auth: true, component: Patientdefines, permission: privileges.patientdefineview },
      { exact: true, path: "/Patientdefines/Create", auth: true, component: PatientdefinesCreate, permission: privileges.patientdefineadd },
      { exact: true, path: "/Patientdefines/:PatientdefineID/Edit", auth: true, component: PatientdefinesEdit, permission: privileges.patientdefineupdate },

      { exact: true, path: "/Patients", auth: true, component: Patients, permission: privileges.patientview },
      { exact: true, path: "/Patients/:PatientID", auth: true, component: PatientsDetail, permission: privileges.patientview },
      { exact: true, path: "/Patients/:PatientID/Editcash", auth: true, component: PatientsEditcash, permission: privileges.patientupdate },
      { exact: true, path: "/Patients/:PatientID/Movements", auth: true, component: PatientsMovements, permission: privileges.patientupdate },
      { exact: true, path: "/Patients/:PatientID/Eventmovements", auth: true, component: PatientEventmovements, permission: privileges.patientupdate },
      { exact: true, path: "/Patients/:PatientID/Editsupportplan", auth: true, component: PatientsEditsupportplan, permission: privileges.patientupdate },
      { exact: true, path: "/Patients/:PatientID/Editroutine", auth: true, component: PatientsEditroutine, permission: privileges.patientupdate },
      { exact: true, path: "/Patients/:PatientID/Editfile", auth: true, component: PatientsFiles, permission: privileges.patientupdate },

      { exact: true, path: "/Patientsrollcall", auth: true, component: Patientsrollcall, permission: privileges.patientsrollcallview },
      { exact: true, path: "/Patientfollowup", auth: true, component: Patientfollowup, permission: privileges.patientfollowupview },

      { exact: true, path: "/Purchaseorders", auth: true, component: Purchaseorders, permission: privileges.purchaseorderview },
      { exact: true, path: "/Purchaseorders/Create", auth: true, component: PurchaseordersCreate, permission: privileges.purchaseorderadd },
      { exact: true, path: "/Purchaseorders/:PurchaseorderID/Edit", auth: true, component: PurchaseordersEdit, permission: privileges.purchaseorderupdate },

      { exact: true, path: "/Warehouses", auth: true, component: Warehouses, permission: privileges.warehouseview },
      { exact: true, path: "/Warehouses/Create", auth: true, component: WarehousesCreate, permission: privileges.warehouseadd },
      { exact: true, path: "/Warehouses/:WarehouseID/Edit", auth: true, component: WarehousesEdit, permission: privileges.warehouseupdate },

      { exact: true, path: "/Tododefines", auth: true, component: Tododefines, permission: privileges.tododefineview },
      { exact: true, path: "/Tododefines/Create", auth: true, component: TododefinesCreate, permission: privileges.tododefineadd },
      { exact: true, path: "/Tododefines/:TododefineID/Edit", auth: true, component: TododefinesEdit, permission: privileges.tododefineupdate },

      { exact: true, path: "/Todogroupdefines", auth: true, component: Todogroupdefines, permission: privileges.todogroupdefineview },
      { exact: true, path: "/Todogroupdefines/Create", auth: true, component: TodogroupdefinesCreate, permission: privileges.todogroupdefineadd },
      { exact: true, path: "/Todogroupdefines/:TodogroupdefineID/Edit", auth: true, component: TodogroupdefinesEdit, permission: privileges.todogroupdefineupdate },

      { exact: true, path: "/Mailsettings", auth: true, component: Mailsettings, permission: privileges.mailsettingview },
      { exact: true, path: "/Mailsettings/Create", auth: true, component: MailsettingsCreate, permission: privileges.mailsettingadd },
      { exact: true, path: "/Mailsettings/:MailsettingID/Edit", auth: true, component: MailsettingsEdit, permission: privileges.mailsettingupdate },

      { exact: true, path: "/Printtemplates", auth: true, component: Printtemplates, permission: privileges.printtemplateview },
      { exact: true, path: "/Printtemplates/Create", auth: true, component: PrinttemplatesCreate, permission: privileges.printtemplateadd },
      { exact: true, path: "/Printtemplates/:PrinttemplateID/Edit", auth: true, component: PrinttemplatesEdit, permission: privileges.printtemplateupdate },

      { exact: true, path: "/Periods", auth: true, component: Periods, permission: privileges.requiredperiodview },
      { exact: true, path: "/Periods/Create", auth: true, component: PeriodsCreate, permission: privileges.requiredperiodadd },
      { exact: true, path: "/Periods/:PeriodID/Edit", auth: true, component: PeriodsEdit, permission: privileges.requiredperiodupdate },

      { exact: true, path: "/Rules", auth: true, component: Rules, permission: privileges.ruleview },
      { exact: true, path: "/Rules/Create", auth: true, component: RulesCreate, permission: privileges.ruleadd },
      { exact: true, path: "/Rules/:RuleID/Edit", auth: true, component: RulesEdit, permission: privileges.ruleupdate },

      { exact: true, path: "/Beds", auth: true, component: Beds, permission: privileges.bedview },
      { exact: true, path: "/Beds/Create", auth: true, component: BedsCreate, permission: privileges.bedadd },
      { exact: true, path: "/Beds/:BedID/Edit", auth: true, component: BedsEdit, permission: privileges.bedupdate },

      { exact: true, path: "/Floors", auth: true, component: Floors, permission: privileges.floorview },
      { exact: true, path: "/Floors/Create", auth: true, component: FloorsCreate, permission: privileges.flooradd },
      { exact: true, path: "/Floors/:FloorID/Edit", auth: true, component: FloorsEdit, permission: privileges.floorupdate },

      { exact: true, path: "/Rooms", auth: true, component: Rooms, permission: privileges.roomview },
      { exact: true, path: "/Rooms/Create", auth: true, component: RoomsCreate, permission: privileges.roomadd },
      { exact: true, path: "/Rooms/:RoomID/Edit", auth: true, component: RoomsEdit, permission: privileges.roomupdate },

      { exact: true, path: "/Shiftdefines", auth: true, component: Shiftdefines, permission: privileges.shiftdefineview },
      { exact: true, path: "/Shiftdefines/Create", auth: true, component: ShiftdefinesCreate, permission: privileges.shiftdefineadd },
      { exact: true, path: "/Shiftdefines/:ShiftdefineID/Edit", auth: true, component: ShiftdefinesEdit, permission: privileges.shiftdefineupdate },

      { exact: true, path: "/Equipmentgroups", auth: true, component: Equipmentgroups, permission: privileges.equipmentgroupview },
      { exact: true, path: "/Equipmentgroups/Create", auth: true, component: EquipmentgroupsCreate, permission: privileges.equipmentgroupadd },
      { exact: true, path: "/Equipmentgroups/:EquipmentgroupID/Edit", auth: true, component: EquipmentgroupsEdit, permission: privileges.equipmentgroupupdate },

      { exact: true, path: "/Equipments", auth: true, component: Equipments, permission: privileges.equipmentview },
      { exact: true, path: "/Equipments/Create", auth: true, component: EquipmentsCreate, permission: privileges.equipmentadd },
      { exact: true, path: "/Equipments/:EquipmentID/Edit", auth: true, component: EquipmentsEdit, permission: privileges.equipmentupdate },

      { exact: true, path: "/Breakdowns", auth: true, component: Breakdowns, permission: privileges.breakdownview },
      { exact: true, path: "/Breakdowns/Create", auth: true, component: BreakdownsCreate, permission: privileges.breakdownadd },
      { exact: true, path: "/Breakdowns/:BreakdownID/Edit", auth: true, component: BreakdownsEdit, permission: privileges.breakdownupdate },

      { exact: true, path: "/Mainteancies", auth: true, component: Mainteancies, permission: privileges.mainteanceview },
      { exact: true, path: "/Mainteancies/Create", auth: true, component: MainteanciesCreate, permission: privileges.mainteanceadd },
      { exact: true, path: "/Mainteancies/:MainteanceID/Edit", auth: true, component: MainteanciesEdit, permission: privileges.mainteanceupdate },

      { exact: true, path: "/Placeviews", auth: true, component: Placeviews, permission: privileges.placeviewview },

      { exact: true, path: "/Patientcashregisters", auth: true, component: Patientcashregisters, permission: privileges.patientcashregisterview },
      { exact: true, path: "/Patientcashregisters/Create", auth: true, component: PatientcashregistersCreate, permission: privileges.patientcashregisteradd },
      { exact: true, path: "/Patientcashregisters/:PatientcashregisterID/Edit", auth: true, component: PatientcashregistersEdit, permission: privileges.patientcashregisterupdate },

      { exact: true, path: "/Patientcashmovements", auth: true, component: Patientcashmovements, permission: privileges.patientcashmovementview },
      { exact: true, path: "/Patientcashmovements/Create", auth: true, component: PatientcashmovementsCreate, permission: privileges.patientcashmovementadd },
      { exact: true, path: "/Patientcashmovements/:PatientcashmovementID/Edit", auth: true, component: PatientcashmovementsEdit, permission: privileges.patientcashmovementupdate },

      { exact: true, path: "/Companycashmovements", auth: true, component: Companycashmovements, permission: privileges.companycashmovementview },
      { exact: true, path: "/Companycashmovements/Create", auth: true, component: CompanycashmovementsCreate, permission: privileges.companycashmovementadd },
      { exact: true, path: "/Companycashmovements/:CompanycashmovementID/Edit", auth: true, component: CompanycashmovementsEdit, permission: privileges.companycashmovementupdate },

      { exact: true, path: "/Supportplans", auth: true, component: Supportplans, permission: privileges.supportplanview },
      { exact: true, path: "/Supportplans/Create", auth: true, component: SupportplansCreate, permission: privileges.supportplanadd },
      { exact: true, path: "/Supportplans/:SupportplanID/Edit", auth: true, component: SupportplansEdit, permission: privileges.supportplanupdate },

      { exact: true, path: "/Supportplanlists", auth: true, component: Supportplanlists, permission: privileges.supportplanlistview },
      { exact: true, path: "/Supportplanlists/Create", auth: true, component: SupportplanlistsCreate, permission: privileges.supportplanlistadd },
      { exact: true, path: "/Supportplanlists/:SupportplanlistID/Edit", auth: true, component: SupportplanlistsEdit, permission: privileges.supportplanlistupdate },

      { exact: true, path: "/Careplans", auth: true, component: Careplans, permission: privileges.careplanview },
      { exact: true, path: "/Careplans/Create", auth: true, component: CareplansCreate, permission: privileges.careplanadd },
      { exact: true, path: "/Careplans/:CareplanID/Edit", auth: true, component: CareplansEdit, permission: privileges.careplanupdate },

      { exact: true, path: "/Usagetypes", auth: true, component: Usagetypes, permission: privileges.usagetypeview },
      { exact: true, path: "/Usagetypes/Create", auth: true, component: UsagetypesCreate, permission: privileges.usagetypeadd },
      { exact: true, path: "/Usagetypes/:UsagetypeID/Edit", auth: true, component: UsagetypesEdit, permission: privileges.usagetypeupdate },

      { exact: true, path: "/Careplanparameters", auth: true, component: Careplanparameters, permission: privileges.careplanparameterview },
      { exact: true, path: "/Careplanparameters/Create", auth: true, component: CareplanparametersCreate, permission: privileges.careplanparameteradd },
      { exact: true, path: "/Careplanparameters/:CareplanparameterID/Edit", auth: true, component: CareplanparametersEdit, permission: privileges.careplanparameterupdate },

      { exact: true, path: "/Professions", auth: true, component: Professions, permission: privileges.professionview },
      { exact: true, path: "/Professions/Create", auth: true, component: ProfessionsCreate, permission: privileges.professionadd },
      { exact: true, path: "/Professions/:ProfessionID/Edit", auth: true, component: ProfessionsEdit, permission: privileges.professionupdate },

      { exact: true, path: "/Personelpresettings", auth: true, component: Personelpresettings, permission: privileges.personelpresettingview },
      { exact: true, path: "/Personelpresettings/Create", auth: true, component: PersonelpresettingsCreate, permission: privileges.personelpresettingadd },
      { exact: true, path: "/Personelpresettings/:PersonelpresettingID/Edit", auth: true, component: PersonelpresettingsEdit, permission: privileges.personelpresettingupdate },

      { exact: true, path: "/Professionpresettings", auth: true, component: Professionpresettings, permission: privileges.professionpresettingview },
      { exact: true, path: "/Professionpresettings/Create", auth: true, component: ProfessionpresettingsCreate, permission: privileges.professionpresettingadd },
      { exact: true, path: "/Professionpresettings/:ProfessionpresettingID/Edit", auth: true, component: ProfessionpresettingsEdit, permission: privileges.professionpresettingupdate },

      { exact: true, path: "/Personelshifts", auth: true, component: Personelshifts, permission: privileges.personelshiftview },
      { exact: true, path: "/Personelshifts/Create", auth: true, component: PersonelshiftsCreate, permission: privileges.personelshiftadd },
      { exact: true, path: "/Personelshifts/:PersonelshiftID/Edit", auth: true, component: PersonelshiftsEdit, permission: privileges.personelshiftupdate },

      { exact: true, path: "/Patienteventdefines", auth: true, component: Patienteventdefines, permission: privileges.patienteventdefineview },
      { exact: true, path: "/Patienteventdefines/Create", auth: true, component: PatienteventdefinesCreate, permission: privileges.patienteventdefineadd },
      { exact: true, path: "/Patienteventdefines/:PatienteventdefineID/Edit", auth: true, component: PatienteventdefinesEdit, permission: privileges.patienteventdefineupdate },

      { exact: true, path: "/Patienthealthcasedefines", auth: true, component: Patienthealthcasedefines, permission: privileges.patienthealthcasedefineview },
      { exact: true, path: "/Patienthealthcasedefines/Create", auth: true, component: PatienthealthcasedefinesCreate, permission: privileges.patienthealthcasedefineadd },
      { exact: true, path: "/Patienthealthcasedefines/:PatienthealthcasedefineID/Edit", auth: true, component: PatienthealthcasedefinesEdit, permission: privileges.patienthealthcasedefineupdate },

      { exact: true, path: "/Patienthealthcases", auth: true, component: Patienthealthcases, permission: privileges.patienthealthcaseview },
      { exact: true, path: "/Patienthealthcases/Create", auth: true, component: PatienthealthcasesCreate, permission: privileges.patienthealthcaseadd },
      { exact: true, path: "/Patienthealthcases/:PatienthealthcaseID/Edit", auth: true, component: PatienthealthcasesEdit, permission: privileges.patienthealthcaseupdate },

      { exact: true, path: "/Appreports", auth: true, component: Appreports, permission: privileges.admin },
      { exact: true, path: "/Logs", auth: true, component: Log, permission: privileges.admin },

      { exact: true, path: "/Preregistrations", auth: true, component: Preregistrations, permission: privileges.preregistrationview },
      { exact: true, path: "/Preregistrations/Create", auth: true, component: PreregistrationsCreate, permission: privileges.preregistrationadd },
      { exact: true, path: "/Preregistrations/:PatientID/Edit", auth: true, component: PreregistrationsEdit, permission: privileges.preregistrationupdate },

      { exact: true, path: "/Claimpaymentparameters", auth: true, component: Claimpaymentparameters, permission: privileges.claimpaymentparameterview },
      { exact: true, path: "/Claimpaymentparameters/Create", auth: true, component: ClaimpaymentparametersCreate, permission: privileges.claimpaymentparameteradd },
      { exact: true, path: "/Claimpaymentparameters/:ClaimpaymentparameterID/Edit", auth: true, component: ClaimpaymentparametersEdit, permission: privileges.claimpaymentparameterupdate },

      { exact: true, path: "/Claimpayments", auth: true, component: Claimpayments, permission: privileges.claimpaymentview },
      { exact: true, path: "/Claimpayments/Create", auth: true, component: ClaimpaymentsCreate, permission: privileges.claimpaymentadd },
      { exact: true, path: "/Claimpayments/:ClaimpaymentID", auth: true, component: ClaimpaymentsDetail, permission: privileges.claimpaymentadd },

      { exact: true, path: "/Trainings", auth: true, component: Trainings, permission: privileges.trainingview },
      { exact: true, path: "/Trainings/Create", auth: true, component: TrainingsCreate, permission: privileges.trainingadd },
      { exact: true, path: "/Trainings/:TrainingID/Edit", auth: true, component: TrainingsEdit, permission: privileges.trainingupdate },

      { exact: true, path: "/Surveys", auth: true, component: Surveys, permission: privileges.surveyview },
      { exact: true, path: "/Surveys/Create", auth: true, component: SurveysCreate, permission: privileges.surveyadd },
      { exact: true, path: "/Surveys/:SurveyID/Edit", auth: true, component: SurveysEdit, permission: privileges.surveyupdate },

      { exact: true, path: "/Patientactivities", auth: true, component: Patientactivities, permission: privileges.patientactivityview },
      { exact: true, path: "/Patientactivities/Create", auth: true, component: PatientactivitiesCreate, permission: privileges.patientactivityadd },
      { exact: true, path: "/Patientactivities/:PatientactivityID/Edit", auth: true, component: PatientactivitiesEdit, permission: privileges.patientactivityupdate },

      { exact: true, path: "/Patientvisits", auth: true, component: Patientvisits, permission: privileges.patientvisitview },
      { exact: true, path: "/Patientvisits/Create", auth: true, component: PatientvisitsCreate, permission: privileges.patientvisitadd },
      { exact: true, path: "/Patientvisits/:PatientvisitID/Edit", auth: true, component: PatientvisitsEdit, permission: privileges.patientvisitupdate },

      { exact: true, path: "/Userincidents", auth: true, component: Userincidents, permission: privileges.userincidentview },
      { exact: true, path: "/Userincidents/Create", auth: true, component: UserincidentsCreate, permission: privileges.userincidentadd },
      { exact: true, path: "/Userincidents/:UserincidentID/Edit", auth: true, component: UserincidentsEdit, permission: privileges.userincidentupdate },

      { exact: true, path: "/Patienteventmovements", auth: true, component: Patienteventmovements, permission: privileges.patienteventmovementview },
      { exact: true, path: "/Patienteventmovements/Create", auth: true, component: PatienteventmovementsCreate, permission: privileges.patienteventmovementadd },
      { exact: true, path: "/Patienteventmovements/:PatienteventmovementID/Edit", auth: true, component: PatienteventmovementsEdit, permission: privileges.patienteventmovementupdate },

      { exact: true, path: "/Mainteanceplans", auth: true, component: Mainteanceplans, permission: privileges.mainteanceplanview },
      { exact: true, path: "/Mainteanceplans/Create", auth: true, component: MainteanceplansCreate, permission: privileges.mainteanceplanadd },
      { exact: true, path: "/Mainteanceplans/:MainteanceplanID/Edit", auth: true, component: MainteanceplansEdit, permission: privileges.mainteanceplanupdate },

      { exact: true, path: "/Overview", auth: true, component: Overview, permission: privileges.overviewview },
      { exact: true, path: "/Overviewcard", auth: true, component: Overviewcard, permission: privileges.overviewcardview },
      { exact: true, path: "/Overviewhealthcarecard", auth: true, component: Overviewhealthcarecards, permission: privileges.overviewhealthcarecardview },

      { exact: true, path: "/Usernotifications", auth: true, component: Usernotifications, permission: privileges.basic },

      { exact: true, path: "/Profile/Change-Password", auth: true, component: PasswordChange, permission: privileges.basic },
      { exact: true, path: "/About", auth: true, component: About },
      { exact: true, path: "/Passwordreset/:RequestID", auth: false, component: PasswordReset },
      { exact: true, path: "/Forgetpassword", auth: false, component: Passwordforget },

      { exact: false, path: "*", auth: false, component: Notfoundpage }
    ]

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route, index) => {
            return route.auth === true ? validator.isHavePermission(route.permission, roles) ? <ProtectedRoute key={index} exact={route.exact} path={route.path} component={route.component} /> : null :
              <Route key={index} exact={route.exact} path={route.path} component={route.component} />
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default Routes;
