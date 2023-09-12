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

const Patientstocks = lazy(() => import('./Containers/Patientstocks/Patientstocks'));
const PatientstocksCreate = lazy(() => import('./Containers/Patientstocks/PatientstocksCreate'));
const PatientstocksEdit = lazy(() => import('./Containers/Patientstocks/PatientstocksEdit'));

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

const Stocks = lazy(() => import('./Containers/Stocks/Stocks'));
const StocksCreate = lazy(() => import('./Containers/Stocks/StocksCreate'));
const StocksEdit = lazy(() => import('./Containers/Stocks/StocksEdit'));

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

const Stockmovementsdetail = lazy(() => import('./Containers/Stocks/Stockmovementsdetail'));

const ProfileEdit = lazy(() => import('./Containers/Auth/ProfileEdit'));
const PasswordChange = lazy(() => import('./Containers/Auth/PasswordChange'));
const Passwordforget = lazy(() => import('./Containers/Auth/Passwordforget'));
const Home = lazy(() => import('./Pages/Home'));


class Routes extends Component {
  render() {

    const routes = [
      { exact: true, path: "/Login", auth: false, component: Login },
      { exact: true, path: "/Register", auth: false, component: Register },
      { exact: true, path: "/Home", auth: true, component: Home },
      { exact: true, path: "/", auth: true, component: Home },
      { exact: true, path: "/Roles", auth: true, component: Roles },
      { exact: true, path: "/Roles/Create", auth: true, component: RolesCreate },
      { exact: true, path: "/Roles/:RoleID/Edit", auth: true, component: RolesEdit },
      { exact: true, path: "/Departments", auth: true, component: Departments },
      { exact: true, path: "/Departments/Create", auth: true, component: DepartmentsCreate },
      { exact: true, path: "/Departments/:DepartmentID/Edit", auth: true, component: DepartmentsEdit },
      { exact: true, path: "/Stations", auth: true, component: Stations },
      { exact: true, path: "/Stations/Create", auth: true, component: StationsCreate },
      { exact: true, path: "/Stations/:StationID/Edit", auth: true, component: StationsEdit },
      { exact: true, path: "/Cases", auth: true, component: Cases },
      { exact: true, path: "/Cases/Create", auth: true, component: CasesCreate },
      { exact: true, path: "/Cases/:CaseID/Edit", auth: true, component: CasesEdit },
      { exact: true, path: "/Units", auth: true, component: Units },
      { exact: true, path: "/Units/Create", auth: true, component: UnitsCreate },
      { exact: true, path: "/Units/:UnitID/Edit", auth: true, component: UnitsEdit },
      { exact: true, path: "/Stockdefines", auth: true, component: Stockdefines },
      { exact: true, path: "/Stockdefines/Create", auth: true, component: StockdefinesCreate },
      { exact: true, path: "/Stockdefines/:StockdefineID/Edit", auth: true, component: StockdefinesEdit },
      { exact: true, path: "/Stocks", auth: true, component: Stocks },
      { exact: true, path: "/Stocks/Create", auth: true, component: StocksCreate },
      { exact: true, path: "/Stocks/:StockID/Edit", auth: true, component: StocksEdit },
      { exact: true, path: "/Stockmovements", auth: true, component: Stockmovements },
      { exact: true, path: "/Stockmovements/Create", auth: true, component: StockmovementsCreate },
      { exact: true, path: "/Stockmovements/:StockmovementID/Edit", auth: true, component: StockmovementsEdit },
      { exact: true, path: "/Stockmovement/:StockmovementID", auth: true, component: Stockmovementsdetail },
      { exact: true, path: "/Stockmovement", auth: true, component: Stockmovementsdetail },
      { exact: true, path: "/Users", auth: true, component: Users },
      { exact: true, path: "/Users/Create", auth: true, component: UsersCreate },
      { exact: true, path: "/Users/:UserID/Edit", auth: true, component: UsersEdit },
      { exact: true, path: "/Files", auth: true, component: Files },
      { exact: true, path: "/Files/Create", auth: true, component: FilesCreate },
      { exact: true, path: "/Files/:FileID/Edit", auth: true, component: FilesEdit },
      { exact: true, path: "/Purchaseorders", auth: true, component: Purchaseorders },
      { exact: true, path: "/Purchaseorders/Create", auth: true, component: PurchaseordersCreate },
      { exact: true, path: "/Purchaseorders/:PurchaseorderID/Edit", auth: true, component: PurchaseordersEdit },
      { exact: true, path: "/Costumertypes", auth: true, component: Costumertypes },
      { exact: true, path: "/Costumertypes/Create", auth: true, component: CostumertypesCreate },
      { exact: true, path: "/Costumertypes/:CostumertypeID/Edit", auth: true, component: CostumertypesEdit },
      { exact: true, path: "/Patienttypes", auth: true, component: Patienttypes },
      { exact: true, path: "/Patienttypes/Create", auth: true, component: PatienttypesCreate },
      { exact: true, path: "/Patienttypes/:PatienttypeID/Edit", auth: true, component: PatienttypesEdit },
      { exact: true, path: "/Patientdefines", auth: true, component: Patientdefines },
      { exact: true, path: "/Patientdefines/Create", auth: true, component: PatientdefinesCreate },
      { exact: true, path: "/Patientdefines/:PatientdefineID/Edit", auth: true, component: PatientdefinesEdit },
      { exact: true, path: "/Patients", auth: true, component: Patients },
      { exact: true, path: "/Patients/Create", auth: true, component: PatientsCreate },
      { exact: true, path: "/Patients/:PatientID/Edit", auth: true, component: PatientsEdit },
      { exact: true, path: "/Warehouses", auth: true, component: Warehouses },
      { exact: true, path: "/Warehouses/Create", auth: true, component: WarehousesCreate },
      { exact: true, path: "/Warehouses/:WarehouseID/Edit", auth: true, component: WarehousesEdit },
      { exact: true, path: "/Tododefines", auth: true, component: Tododefines },
      { exact: true, path: "/Tododefines/Create", auth: true, component: TododefinesCreate },
      { exact: true, path: "/Tododefines/:TododefineID/Edit", auth: true, component: TododefinesEdit },
      { exact: true, path: "/Todogroupdefines", auth: true, component: Todogroupdefines },
      { exact: true, path: "/Todogroupdefines/Create", auth: true, component: TodogroupdefinesCreate },
      { exact: true, path: "/Todogroupdefines/:TodogroupdefineID/Edit", auth: true, component: TodogroupdefinesEdit },
      { exact: true, path: "/Patientstocks", auth: true, component: Patientstocks },
      { exact: true, path: "/Patientstocks/Create", auth: true, component: PatientstocksCreate },
      { exact: true, path: "/Patientstocks/:PatientstockID/Edit", auth: true, component: PatientstocksEdit },
      { exact: true, path: "/Patientstockmovements", auth: true, component: Patientstockmovements },
      { exact: true, path: "/Patientstockmovements/Create", auth: true, component: PatientstockmovementsCreate },
      { exact: true, path: "/Patientstockmovements/:PatientstockmovementID/Edit", auth: true, component: PatientstockmovementsEdit },
      { exact: true, path: "/Purchaseorderstocks", auth: true, component: Purchaseorderstocks },
      { exact: true, path: "/Purchaseorderstocks/Create", auth: true, component: PurchaseorderstocksCreate },
      { exact: true, path: "/Purchaseorderstocks/:PurchaseorderstockID/Edit", auth: true, component: PurchaseorderstocksEdit },
      { exact: true, path: "/Purchaseorderstockmovements", auth: true, component: Purchaseorderstockmovements },
      { exact: true, path: "/Purchaseorderstockmovements/Create", auth: true, component: PurchaseorderstockmovementsCreate },
      { exact: true, path: "/Purchaseorderstockmovements/:PurchaseorderstockmovementID/Edit", auth: true, component: PurchaseorderstockmovementsEdit },
      { exact: true, path: "/Patientmovements", auth: true, component: Patientmovements },
      { exact: true, path: "/Patientmovements/Create", auth: true, component: PatientmovementsCreate },
      { exact: true, path: "/Patientmovements/:PatientmovementID/Edit", auth: true, component: PatientmovementsEdit },
      { exact: true, path: "/Mailsettings", auth: true, component: Mailsettings },
      { exact: true, path: "/Mailsettings/Create", auth: true, component: MailsettingsCreate },
      { exact: true, path: "/Mailsettings/:MailsettingID/Edit", auth: true, component: MailsettingsEdit },
      { exact: true, path: "/Todos", auth: true, component: Todos },
      { exact: true, path: "/Checkperiods", auth: true, component: Checkperiods },
      { exact: true, path: "/Checkperiods/Create", auth: true, component: CheckperiodsCreate },
      { exact: true, path: "/Checkperiods/:CheckperiodID/Edit", auth: true, component: CheckperiodsEdit },
      { exact: true, path: "/Printtemplates", auth: true, component: Printtemplates },
      { exact: true, path: "/Printtemplates/Create", auth: true, component: PrinttemplatesCreate },
      { exact: true, path: "/Printtemplates/:PrinttemplateID/Edit", auth: true, component: PrinttemplatesEdit },
      { exact: true, path: "/Periods", auth: true, component: Periods },
      { exact: true, path: "/Periods/Create", auth: true, component: PeriodsCreate },
      { exact: true, path: "/Periods/:PeriodID/Edit", auth: true, component: PeriodsEdit },
      { exact: true, path: "/Rules", auth: true, component: Rules },
      { exact: true, path: "/Rules/Create", auth: true, component: RulesCreate },
      { exact: true, path: "/Rules/:RuleID/Edit", auth: true, component: RulesEdit },
      { exact: true, path: "/Preregistrations", auth: true, component: Preregistrations },
      { exact: true, path: "/Preregistrations/Create", auth: true, component: PreregistrationsCreate },
      { exact: true, path: "/Preregistrations/:PatientID/Edit", auth: true, component: PreregistrationsEdit },
      { exact: true, path: "/Preregistrations/:PatientID/Editfile", auth: true, component: PreregistrationsEditfile },
      { exact: true, path: "/Preregistrations/:PatientID/Editstock", auth: true, component: PreregistrationsEditstock },
      { exact: true, path: "/Profile/Edit", auth: true, component: ProfileEdit },
      { exact: true, path: "/Profile/Change-Password", auth: true, component: PasswordChange },
      { exact: true, path: "/Forgetpassword", auth: false, component: Passwordforget }
    ]

    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {routes.map((route, index) => {
            return route.auth ? <ProtectedRoute key={index} exact={route.exact} path={route.path} component={route.component} /> :
              <Route key={index} exact={route.exact} path={route.path} component={route.component} />
          })}
        </Switch>
      </Suspense>
    );
  }
}

export default Routes;
