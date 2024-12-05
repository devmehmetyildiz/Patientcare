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
import { removePatientnotification } from "../Redux/PatientSlice"
import { removePatienttypenotification } from "../Redux/PatienttypeSlice"
import { removenotification } from "../Redux/ProfileSlice"
import { removeRolenotification } from "../Redux/RoleSlice"
import { removeRoomnotification } from "../Redux/RoomSlice"
import { removeRulenotification } from "../Redux/RuleSlice"
import { removePrinttemplatenotification } from "../Redux/PrinttemplateSlice"
import { removeStockdefinenotification } from "../Redux/StockdefineSlice"
import { removeStockmovementnotification } from "../Redux/StockmovementSlice"
import { removeStocknotification } from "../Redux/StockSlice"
import { removeTododefinenotification } from "../Redux/TododefineSlice"
import { removeTodogroupdefinenotification } from "../Redux/TodogroupdefineSlice"
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
import { removeProfessionnotification } from "../Redux/ProfessionSlice"
import { removePersonelshiftnotification } from "../Redux/PersonelshiftSlice"
import { removePersonelpresettingnotification } from "../Redux/PersonelpresettingSlice"
import { removeProfessionpresettingnotification } from "../Redux/ProfessionpresettingSlice"
import { removePersonelshiftdetailnotification } from "../Redux/PersonelshiftdetailSlice"
import { removeStocktypenotification } from "../Redux/StocktypeSlice"
import { removeStocktypegroupnotification } from "../Redux/StocktypegroupSlice"
import { removePurchaseordernotification } from "../Redux/PurchaseorderSlice"
import { removeClaimpaymentparameternotification } from "../Redux/ClaimpaymentparameterSlice"
import { removeClaimpaymentnotification } from "../Redux/ClaimpaymentSlice"
import { removeTrainingnotification } from "../Redux/TrainingSlice"
import { removePatienteventdefinenotification } from "../Redux/PatienteventdefineSlice"
import { removeCareplanparameternotification } from "../Redux/CareplanparameterSlice"
import { removeSurveynotification } from "../Redux/SurveySlice"
import Notificationwrapper from './Notification'

export function NotificationHandler(props) {

    const Notification = (notifications, removeFunction) => {
        Notificationwrapper(notifications, removeFunction, props.states.Profile)
    }

    useEffect(() => {
        const {
            removeWarehousenotification, removeUsernotification, removeUnitnotification,
            removeTodogroupdefinenotification, removeTododefinenotification, removeStocknotification,
            removeStockmovementnotification, removeStockdefinenotification,
            removeRulenotification, removePrinttemplatenotification, removeRoomnotification, removeRolenotification,
            removenotification, removePatienttypenotification, removePatientnotification, removePatientdefinenotification, removeMailsettingnotification,
            removeFloornotification, removeFilenotification, removeDepartmentnotification, removeCostumertypenotification,
            removePeriodnotification, removeCasenotification, removeBednotification, removeShiftdefinenotification, removeEquipmentnotification,
            removeEquipmentgroupnotification, removePersonelnotification, removeBreakdownnotification, removeMainteancenotification,
            removePersonelshiftnotification, removeCompanycashmovementnotification, removePatientcashmovementnotification,
            removePatientcashregisternotification, removeUsernotificationnotification, removeReportnotification, removeUsagetypenotification,
            removeSupportplannotification, removeSupportplanlistnotification, removeCareplannotification, removeProfessionnotification, removePersonelpresettingnotification,
            removeProfessionpresettingnotification, removePersonelshiftdetailnotification, removeStocktypenotification,
            removeStocktypegroupnotification, removePurchaseordernotification, removeClaimpaymentparameternotification, removeClaimpaymentnotification,
            removeTrainingnotification, removePatienteventdefinenotification, removeCareplanparameternotification, removeSurveynotification
        } = props

        const {
            Warehouses, Users, Units,
            Todogroupdefines, Tododefines, Stocks, Stockmovements,
            Stockdefines, Rules, Printtemplates, Rooms,
            Roles, Profile, Patienttypes, Patients, Patientdefines, Mailsettings,
            Floors, Files, Departments, Costumertypes, Breakdowns, Mainteancies,
            Periods, Cases, Beds, Shiftdefines, Equipmentgroups, Equipments, Personels,
            Companycashmovements, Patientcashmovements,
            Patientcashregisters, Usernotifications, Reports, Usagetypes, Professions,
            Supportplanlists, Supportplans, Careplans,
            Personelshiftdetails, Personelpresettings, Professionpresettings, Personelshifts, Stocktypes,
            Stocktypegroups, Purchaseorders, Claimpaymentparameters, Claimpayments, Trainings,
            Patienteventdefines, Careplanparameters, Surveys
        } = props.states

        Notification(Warehouses.notifications, removeWarehousenotification)
        Notification(Shiftdefines.notifications, removeShiftdefinenotification)
        Notification(Users.notifications, removeUsernotification)
        Notification(Units.notifications, removeUnitnotification)
        Notification(Todogroupdefines.notifications, removeTodogroupdefinenotification)
        Notification(Tododefines.notifications, removeTododefinenotification)
        Notification(Stocks.notifications, removeStocknotification)
        Notification(Stockmovements.notifications, removeStockmovementnotification)
        Notification(Stockdefines.notifications, removeStockdefinenotification)
        Notification(Rules.notifications, removeRulenotification)
        Notification(Printtemplates.notifications, removePrinttemplatenotification)
        Notification(Rooms.notifications, removeRoomnotification)
        Notification(Roles.notifications, removeRolenotification)
        Notification(Profile.notifications, removenotification)
        Notification(Patienttypes.notifications, removePatienttypenotification)
        Notification(Patients.notifications, removePatientnotification)
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
        Notification(Professions.notifications, removeProfessionnotification)
        Notification(Personelshifts.notifications, removePersonelshiftnotification)
        Notification(Personelpresettings.notifications, removePersonelpresettingnotification)
        Notification(Personelshiftdetails.notifications, removePersonelshiftdetailnotification)
        Notification(Professionpresettings.notifications, removeProfessionpresettingnotification)
        Notification(Stocktypes.notifications, removeStocktypenotification)
        Notification(Stocktypegroups.notifications, removeStocktypegroupnotification)
        Notification(Purchaseorders.notifications, removePurchaseordernotification)
        Notification(Claimpaymentparameters.notifications, removeClaimpaymentparameternotification)
        Notification(Claimpayments.notifications, removeClaimpaymentnotification)
        Notification(Trainings.notifications, removeTrainingnotification)
        Notification(Patienteventdefines.notifications, removePatienteventdefinenotification)
        Notification(Careplanparameters.notifications, removeCareplanparameternotification)
        Notification(Surveys.notifications, removeSurveynotification)
    })

    return null
}

const mapStateToProps = (state) => ({
    states: state
})

const mapDispatchToProps = {
    removeWarehousenotification, removeUsernotification, removeUnitnotification,
    removeTodogroupdefinenotification, removeTododefinenotification, removeStocknotification,
    removeStockmovementnotification, removeStockdefinenotification,
    removeRulenotification, removePrinttemplatenotification, removeRoomnotification, removeRolenotification,
    removenotification, removePatienttypenotification, removePatientnotification,
    removePatientdefinenotification, removeMailsettingnotification,
    removeFloornotification, removeFilenotification, removeDepartmentnotification, removeCostumertypenotification,
    removePeriodnotification, removeCasenotification, removeBednotification, removeShiftdefinenotification,
    removeEquipmentgroupnotification, removeEquipmentnotification, removePersonelnotification, removeBreakdownnotification,
    removeMainteancenotification, removeCompanycashmovementnotification, removePatientcashmovementnotification,
    removePatientcashregisternotification, removeUsernotificationnotification, removeReportnotification, removeUsagetypenotification,
    removeSupportplanlistnotification, removeSupportplannotification, removeCareplannotification, removeProfessionnotification, removePersonelshiftnotification,
    removePersonelpresettingnotification, removeProfessionpresettingnotification, removePersonelshiftdetailnotification,
    removeStocktypenotification, removeStocktypegroupnotification, removePurchaseordernotification, removeClaimpaymentparameternotification,
    removeClaimpaymentnotification, removeTrainingnotification, removePatienteventdefinenotification, removeCareplanparameternotification,
    removeSurveynotification

}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationHandler)
