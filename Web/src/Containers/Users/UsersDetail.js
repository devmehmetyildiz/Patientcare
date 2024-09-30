import { connect } from 'react-redux'
import UsersDetail from "../../Pages/Users/UsersDetail"
import { GetUsers, fillUsernotification, } from "../../Redux/UserSlice"
import { GetRoles } from "../../Redux/RoleSlice"
import { GetProfessions } from "../../Redux/ProfessionSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetFiles } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetPurchaseorders } from '../../Redux/PurchaseorderSlice'
import { GetBreakdowns } from '../../Redux/BreakdownSlice'
import { GetMainteancies } from '../../Redux/MainteanceSlice'
import { GetShiftdefines } from '../../Redux/ShiftdefineSlice'
import { GetFloors } from '../../Redux/FloorSlice'
import { GetRooms } from '../../Redux/RoomSlice'
import { GetBeds } from '../../Redux/BedSlice'
import { GetTrainings, CompleteTrainingusers } from '../../Redux/TrainingSlice'

const mapStateToProps = (state) => ({
    Users: state.Users,
    Roles: state.Roles,
    Professions: state.Professions,
    Files: state.Files,
    Cases: state.Cases,
    Usagetypes: state.Usagetypes,
    Departments: state.Departments,
    Equipmentgroups: state.Equipmentgroups,
    Equipments: state.Equipments,
    Purchaseorders: state.Purchaseorders,
    Breakdowns: state.Breakdowns,
    Mainteancies: state.Mainteancies,
    Shiftdefines: state.Shiftdefines,
    Floors: state.Floors,
    Rooms: state.Rooms,
    Beds: state.Beds,
    Trainings: state.Trainings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, fillUsernotification, GetFiles, GetDepartments,
    GetCases, GetRoles, GetProfessions, GetUsagetypes, GetEquipmentgroups,
    GetEquipments, GetPurchaseorders, GetBreakdowns, GetMainteancies, GetShiftdefines,
    GetFloors, GetRooms, GetBeds, GetTrainings, CompleteTrainingusers
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersDetail)