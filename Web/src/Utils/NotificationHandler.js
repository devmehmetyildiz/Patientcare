import { connect } from 'react-redux'
import { useEffect } from 'react'
import { removeBednotification } from "../Redux/BedSlice"
import { removeCasenotification } from "../Redux/CaseSlice"
import { removePeriodnotification } from "../Redux/PeriodSlice"
import { removeCostumertypenotification } from "../Redux/CostumertypeSlice"
import { removeDepartmentnotification } from "../Redux/DepartmentSlice"
import { removeFilenotification } from "../Redux/FileSlice"
import { removeFloornotification } from "../Redux/FloorSlice"
import { removeMailsettingnotification } from "../Redux/MailsettingSlice"
import { removePatientdefinenotification } from "../Redux/PatientdefineSlice"
import { removePatientmovementnotification } from "../Redux/PatientmovementSlice"
import { removePatientnotification } from "../Redux/PatientSlice"
import { removePatientstockmovementnotification } from "../Redux/PatientstockmovementSlice"
import { removePatientstocknotification } from "../Redux/PatientstockSlice"
import { removePatienttypenotification } from "../Redux/PatienttypeSlice"
import { removenotification } from "../Redux/ProfileSlice"
import { removePurchaseordernotification } from "../Redux/PurchaseorderSlice"
import { removePurchaseorderstocknotification } from "../Redux/PurchaseorderstockSlice"
import { removePurchaseorderstockmovementnotification } from "../Redux/PurchaseorderstockmovementSlice"
import { removeRolenotification } from "../Redux/RoleSlice"
import { removeRoomnotification } from "../Redux/RoomSlice"
import { removeRulenotification } from "../Redux/RuleSlice"
import { removePrinttemplatenotification } from "../Redux/PrinttemplateSlice"
import { removeStationnotification } from "../Redux/StationSlice"
import { removeStockdefinenotification } from "../Redux/StockdefineSlice"
import { removeStockmovementnotification } from "../Redux/StockmovementSlice"
import { removeStocknotification } from "../Redux/StockSlice"
import { removeTododefinenotification } from "../Redux/TododefineSlice"
import { removeTodogroupdefinenotification } from "../Redux/TodogroupdefineSlice"
import { removeTodonotification } from "../Redux/TodoSlice"
import { removeUnitnotification } from "../Redux/UnitSlice"
import { removeUsernotification } from "../Redux/UserSlice"
import { removeWarehousenotification } from "../Redux/WarehouseSlice"
import { removeShiftdefinenotification } from "../Redux/ShiftdefineSlice"
import { removeEquipmentnotification } from "../Redux/EquipmentSlice"
import { removeEquipmentgroupnotification } from "../Redux/EquipmentgroupSlice"
import { removePersonelnotification } from "../Redux/PersonelSlice"
import { removeBreakdownnotification } from "../Redux/BreakdownSlice"
import { removeMainteancenotification } from "../Redux/MainteanceSlice"
import { removeCompanycashmovementnotification } from "../Redux/CompanycashmovementSlice"
import { removePatientcashmovementnotification } from "../Redux/PatientcashmovementSlice"
import { removePatientcashregisternotification } from "../Redux/PatientcashregisterSlice"
import { removeUsernotificationnotification } from "../Redux/UsernotificationSlice"
import { removeReportnotification } from "../Redux/ReportSlice"
import { removeUsagetypenotification } from "../Redux/UsagetypeSlice"
import { removeSupportplannotification } from "../Redux/SupportplanSlice"
import { removeSupportplanlistnotification } from "../Redux/SupportplanlistSlice"
import { removeCareplannotification } from "../Redux/CareplanSlice"
import { removeHelpstatunotification } from "../Redux/HelpstatuSlice"
import { removeMakingtypenotification } from "../Redux/MakingtypeSlice"
import { removeRatingnotification } from "../Redux/RatingSlice"
import { removeRequiredperiodnotification } from "../Redux/RequiredperiodSlice"
import { removeProfessionnotification } from "../Redux/ProfessionSlice"
import { removePersonelshiftnotification } from "../Redux/PersonelshiftSlice"
import { removePersonelpresettingnotification } from "../Redux/PersonelpresettingSlice"
import { removeProfessionpresettingnotification } from "../Redux/ProfessionpresettingSlice"
import { removePersonelshiftdetailnotification } from "../Redux/PersonelshiftdetailSlice"
import Notificationwrapper from './Notification'

export function NotificationHandler(props) {

    const Notification = (notifications, removeFunction) => {
        Notificationwrapper(notifications, removeFunction, props.states.Profile)
    }

    useEffect(() => {
        const {
            removeWarehousenotification, removeUsernotification, removeUnitnotification, removeTodonotification,
            removeTodogroupdefinenotification, removeTododefinenotification, removeStocknotification,
            removeStockmovementnotification, removeStockdefinenotification, removeStationnotification,
            removeRulenotification, removePrinttemplatenotification, removeRoomnotification, removeRolenotification,
            removePurchaseorderstockmovementnotification, removePurchaseorderstocknotification,
            removePurchaseordernotification, removenotification, removePatienttypenotification,
            removePatientstocknotification, removePatientstockmovementnotification, removePatientnotification,
            removePatientmovementnotification, removePatientdefinenotification, removeMailsettingnotification,
            removeFloornotification, removeFilenotification, removeDepartmentnotification, removeCostumertypenotification,
            removePeriodnotification, removeCasenotification, removeBednotification, removeShiftdefinenotification, removeEquipmentnotification,
            removeEquipmentgroupnotification, removePersonelnotification, removeBreakdownnotification, removeMainteancenotification,
            removePersonelshiftnotification, removeCompanycashmovementnotification, removePatientcashmovementnotification,
            removePatientcashregisternotification, removeUsernotificationnotification, removeReportnotification, removeUsagetypenotification,
            removeSupportplannotification, removeSupportplanlistnotification, removeCareplannotification, removeHelpstatunotification,
            removeMakingtypenotification, removeRatingnotification, removeRequiredperiodnotification, removeProfessionnotification, removePersonelpresettingnotification,
            removeProfessionpresettingnotification, removePersonelshiftdetailnotification
        } = props

        const {
            Warehouses, Users, Units, Todos,
            Todogroupdefines, Tododefines, Stocks, Stockmovements,
            Stockdefines, Stations, Rules, Printtemplates, Rooms,
            Roles, Purchaseorderstockmovements, Purchaseorderstocks, Purchaseorders,
            Profile, Patienttypes, Patientstocks, Patientstockmovements,
            Patients, Patientmovements, Patientdefines, Mailsettings,
            Floors, Files, Departments, Costumertypes, Breakdowns, Mainteancies,
            Periods, Cases, Beds, Shiftdefines, Equipmentgroups, Equipments, Personels,
            Companycashmovements, Patientcashmovements,
            Patientcashregisters, Usernotifications, Reports, Usagetypes, Professions,
            Supportplanlists, Supportplans, Careplans, Helpstatus, Makingtypes, Ratings, Requiredperiods,
            Personelshiftdetails, Personelpresettings, Professionpresettings, Personelshifts,
        } = props.states

        Notification(Warehouses.notifications, removeWarehousenotification)
        Notification(Shiftdefines.notifications, removeShiftdefinenotification)
        Notification(Users.notifications, removeUsernotification)
        Notification(Units.notifications, removeUnitnotification)
        Notification(Todos.notifications, removeTodonotification)
        Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
        Notification(Tododefines.notifications, removeTododefinenotification)
        Notification(Stocks.notifications, removeStocknotification)
        Notification(Stockmovements.notifications, removeStockmovementnotification)
        Notification(Stockdefines.notifications, removeStockdefinenotification)
        Notification(Stations.notifications, removeStationnotification)
        Notification(Rules.notifications, removeRulenotification)
        Notification(Printtemplates.notifications, removePrinttemplatenotification)
        Notification(Rooms.notifications, removeRoomnotification)
        Notification(Roles.notifications, removeRolenotification)
        Notification(Purchaseorderstockmovements.notifications, removePurchaseorderstockmovementnotification)
        Notification(Purchaseorderstocks.notifications, removePurchaseorderstocknotification)
        Notification(Purchaseorders.notifications, removePurchaseordernotification)
        Notification(Profile.notifications, removenotification)
        Notification(Patienttypes.notifications, removePatienttypenotification)
        Notification(Patientstocks.notifications, removePatientstocknotification)
        Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
        Notification(Patients.notifications, removePatientnotification)
        Notification(Patientmovements.notifications, removePatientmovementnotification)
        Notification(Patientdefines.notifications, removePatientdefinenotification)
        Notification(Mailsettings.notifications, removeMailsettingnotification)
        Notification(Floors.notifications, removeFloornotification)
        Notification(Files.notifications, removeFilenotification)
        Notification(Departments.notifications, removeDepartmentnotification)
        Notification(Costumertypes.notifications, removeCostumertypenotification)
        Notification(Periods.notifications, removePeriodnotification)
        Notification(Cases.notifications, removeCasenotification)
        Notification(Beds.notifications, removeBednotification)
        Notification(Equipmentgroups.notifications, removeEquipmentgroupnotification)
        Notification(Equipments.notifications, removeEquipmentnotification)
        Notification(Personels.notifications, removePersonelnotification)
        Notification(Breakdowns.notifications, removeBreakdownnotification)
        Notification(Mainteancies.notifications, removeMainteancenotification)
        Notification(Companycashmovements.notifications, removeCompanycashmovementnotification)
        Notification(Patientcashmovements.notifications, removePatientcashmovementnotification)
        Notification(Patientcashregisters.notifications, removePatientcashregisternotification)
        Notification(Usernotifications.notifications, removeUsernotificationnotification)
        Notification(Reports.notifications, removeReportnotification)
        Notification(Usagetypes.notifications, removeUsagetypenotification)
        Notification(Supportplanlists.notifications, removeSupportplanlistnotification)
        Notification(Supportplans.notifications, removeSupportplannotification)
        Notification(Careplans.notifications, removeCareplannotification)
        Notification(Helpstatus.notifications, removeHelpstatunotification)
        Notification(Makingtypes.notifications, removeMakingtypenotification)
        Notification(Ratings.notifications, removeRatingnotification)
        Notification(Requiredperiods.notifications, removeRequiredperiodnotification)
        Notification(Professions.notifications, removeProfessionnotification)
        Notification(Personelshifts.notifications, removePersonelshiftnotification)
        Notification(Personelpresettings.notifications, removePersonelpresettingnotification)
        Notification(Personelshiftdetails.notifications, removePersonelshiftdetailnotification)
        Notification(Professionpresettings.notifications, removeProfessionpresettingnotification)
    })

    return null
}

const mapStateToProps = (state) => ({
    states: state
})

const mapDispatchToProps = {
    removeWarehousenotification, removeUsernotification, removeUnitnotification, removeTodonotification,
    removeTodogroupdefinenotification, removeTododefinenotification, removeStocknotification,
    removeStockmovementnotification, removeStockdefinenotification, removeStationnotification,
    removeRulenotification, removePrinttemplatenotification, removeRoomnotification, removeRolenotification,
    removePurchaseorderstockmovementnotification, removePurchaseorderstocknotification,
    removePurchaseordernotification, removenotification, removePatienttypenotification,
    removePatientstocknotification, removePatientstockmovementnotification, removePatientnotification,
    removePatientmovementnotification, removePatientdefinenotification, removeMailsettingnotification,
    removeFloornotification, removeFilenotification, removeDepartmentnotification, removeCostumertypenotification,
    removePeriodnotification, removeCasenotification, removeBednotification, removeShiftdefinenotification,
    removeEquipmentgroupnotification, removeEquipmentnotification, removePersonelnotification, removeBreakdownnotification,
    removeMainteancenotification, removeCompanycashmovementnotification, removePatientcashmovementnotification,
    removePatientcashregisternotification, removeUsernotificationnotification, removeReportnotification, removeUsagetypenotification,
    removeSupportplanlistnotification, removeSupportplannotification, removeCareplannotification, removeHelpstatunotification, removeRequiredperiodnotification,
    removeRatingnotification, removeMakingtypenotification, removeProfessionnotification, removePersonelshiftnotification,
    removePersonelpresettingnotification, removeProfessionpresettingnotification, removePersonelshiftdetailnotification

}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationHandler)
