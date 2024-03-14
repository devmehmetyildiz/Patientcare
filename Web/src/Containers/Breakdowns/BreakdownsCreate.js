import { connect } from 'react-redux'
import BreakdownsCreate from '../../Pages/Breakdowns/BreakdownsCreate'
import { AddBreakdowns, fillBreakdownnotification } from '../../Redux/BreakdownSlice'
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

const mapDispatchToProps = { AddBreakdowns, fillBreakdownnotification, GetEquipments, GetEquipmentgroups, GetUsers }

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsCreate)