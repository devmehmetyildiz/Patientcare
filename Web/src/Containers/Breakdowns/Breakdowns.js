import { connect } from 'react-redux'
import Breakdowns from '../../Pages/Breakdowns/Breakdowns'
import { GetBreakdowns, fillBreakdownnotification, handleDeletemodal, handleSelectedBreakdown, handleCompletemodal } from '../../Redux/BreakdownSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Users: state.Users,
    Equipments: state.Equipments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetBreakdowns, fillBreakdownnotification, handleDeletemodal, handleSelectedBreakdown, GetEquipments, handleCompletemodal, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Breakdowns)