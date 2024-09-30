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
import PatienttypeSlice from "./PatienttypeSlice"
import CostumertypeSlice from "./CostumertypeSlice"
import PatientdefineSlice from "./PatientdefineSlice"
import PatientSlice from "./PatientSlice";
import WarehouseSlice from "./WarehouseSlice"
import TododefineSlice from "./TododefineSlice";
import TodogroupdefineSlice from "./TodogroupdefineSlice";
import PeriodSlice from "./PeriodSlice";
import MailsettingSlice from "./MailsettingSlice";
import PrinttemplateSlice from "./PrinttemplateSlice";
import RuleSlice from "./RuleSlice";
import RoomSlice from "./RoomSlice";
import BedSlice from "./BedSlice";
import FloorSlice from "./FloorSlice";
import ShiftdefineSlice from "./ShiftdefineSlice";
import EquipmentSlice from "./EquipmentSlice";
import EquipmentgroupSlice from "./EquipmentgroupSlice";
import PersonelSlice from "./PersonelSlice";
import BreakdownSlice from "./BreakdownSlice";
import MainteanceSlice from "./MainteanceSlice";
import CompanycashmovementSlice from "./CompanycashmovementSlice";
import PatientcashmovementSlice from "./PatientcashmovementSlice";
import PatientcashregisterSlice from "./PatientcashregisterSlice";
import UsernotificationSlice from "./UsernotificationSlice";
import ReportSlice from "./ReportSlice";
import UsagetypeSlice from "./UsagetypeSlice";
import SupportplanSlice from "./SupportplanSlice";
import SupportplanlistSlice from "./SupportplanlistSlice";
import CareplanSlice from "./CareplanSlice";
import HelpstatuSlice from "./HelpstatuSlice";
import MakingtypeSlice from "./MakingtypeSlice";
import RequiredperiodSlice from "./RequiredperiodSlice";
import RatingSlice from "./RatingSlice";
import ProfessionSlice from "./ProfessionSlice";
import PersonelpresettingSlice from "./PersonelpresettingSlice";
import PersonelshiftSlice from "./PersonelshiftSlice";
import PersonelshiftdetailSlice from "./PersonelshiftdetailSlice";
import ProfessionpresettingSlice from "./ProfessionpresettingSlice";
import StocktypeSlice from "./StocktypeSlice";
import StocktypegroupSlice from "./StocktypegroupSlice";
import PurchaseorderSlice from "./PurchaseorderSlice";
import ClaimpaymentparameterSlice from "./ClaimpaymentparameterSlice";
import ClaimpaymentSlice from "./ClaimpaymentSlice";
import TrainingSlice from "./TrainingSlice";
import PatienteventdefineSlice from "./PatienteventdefineSlice";

const Slices = combineReducers({
    Rooms: RoomSlice,
    Beds: BedSlice,
    Floors: FloorSlice,
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
    Costumertypes: CostumertypeSlice,
    Patienttypes: PatienttypeSlice,
    Patientdefines: PatientdefineSlice,
    Patients: PatientSlice,
    Warehouses: WarehouseSlice,
    Tododefines: TododefineSlice,
    Todogroupdefines: TodogroupdefineSlice,
    Periods: PeriodSlice,
    Mailsettings: MailsettingSlice,
    Printtemplates: PrinttemplateSlice,
    Shiftdefines: ShiftdefineSlice,
    Rules: RuleSlice,
    Equipments: EquipmentSlice,
    Equipmentgroups: EquipmentgroupSlice,
    Personels: PersonelSlice,
    Breakdowns: BreakdownSlice,
    Mainteancies: MainteanceSlice,
    Companycashmovements: CompanycashmovementSlice,
    Patientcashmovements: PatientcashmovementSlice,
    Patientcashregisters: PatientcashregisterSlice,
    Usernotifications: UsernotificationSlice,
    Reports: ReportSlice,
    Usagetypes: UsagetypeSlice,
    Supportplans: SupportplanSlice,
    Supportplanlists: SupportplanlistSlice,
    Careplans: CareplanSlice,
    Helpstatus: HelpstatuSlice,
    Makingtypes: MakingtypeSlice,
    Ratings: RatingSlice,
    Requiredperiods: RequiredperiodSlice,
    Professions: ProfessionSlice,
    Personelshifts: PersonelshiftSlice,
    Personelshiftdetails: PersonelshiftdetailSlice,
    Professionpresettings: ProfessionpresettingSlice,
    Personelpresettings: PersonelpresettingSlice,
    Stocktypes: StocktypeSlice,
    Stocktypegroups: StocktypegroupSlice,
    Purchaseorders: PurchaseorderSlice,
    Claimpaymentparameters: ClaimpaymentparameterSlice,
    Claimpayments: ClaimpaymentSlice,
    Trainings: TrainingSlice,
    Patienteventdefines: PatienteventdefineSlice
});

export default Slices;