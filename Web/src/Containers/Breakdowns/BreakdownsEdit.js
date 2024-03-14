import { connect } from 'react-redux'
import BreakdownsEdit from '../../Pages/Breakdowns/BreakdownsEdit'
import { EditBreakdowns, GetBreakdown, handleSelectedBreakdown, fillBreakdownnotification } from '../../Redux/BreakdownSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Users: state.Users,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBreakdowns, GetBreakdown, handleSelectedBreakdown, fillBreakdownnotification, GetEquipments, GetEquipmentgroups, GetUsers }

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsEdit)