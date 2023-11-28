import { connect } from 'react-redux'
import BreakdownsEdit from '../../Pages/Breakdowns/BreakdownsEdit'
import { EditBreakdowns, GetBreakdown, handleSelectedBreakdown, fillBreakdownnotification } from '../../Redux/BreakdownSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetPersonels } from '../../Redux/PersonelSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Personels: state.Personels,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBreakdowns, GetBreakdown, handleSelectedBreakdown, fillBreakdownnotification, GetEquipments, GetEquipmentgroups, GetPersonels }

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsEdit)