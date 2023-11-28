import { connect } from 'react-redux'
import BreakdownsCreate from '../../Pages/Breakdowns/BreakdownsCreate'
import { AddBreakdowns, fillBreakdownnotification } from '../../Redux/BreakdownSlice'
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

const mapDispatchToProps = { AddBreakdowns, fillBreakdownnotification, GetEquipments, GetEquipmentgroups, GetPersonels }

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsCreate)