import { connect } from 'react-redux'
import MainteanciesCreate from '../../Pages/Mainteancies/MainteanciesCreate'
import { AddMainteancies, fillMainteancenotification } from "../../Redux/MainteanceSlice"
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetPersonels } from '../../Redux/PersonelSlice'

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Personels: state.Personels,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { AddMainteancies, fillMainteancenotification, GetEquipments, GetEquipmentgroups, GetPersonels }

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesCreate)