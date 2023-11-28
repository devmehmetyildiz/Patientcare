import { connect } from 'react-redux'
import Breakdowns from '../../Pages/Breakdowns/Breakdowns'
import { GetBreakdowns, fillBreakdownnotification, handleDeletemodal, handleSelectedBreakdown, handleCompletemodal } from '../../Redux/BreakdownSlice'
import { GetPersonels } from '../../Redux/PersonelSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Personels: state.Personels,
    Equipments: state.Equipments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetBreakdowns, fillBreakdownnotification, handleDeletemodal, handleSelectedBreakdown, GetPersonels, GetEquipments, handleCompletemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Breakdowns)