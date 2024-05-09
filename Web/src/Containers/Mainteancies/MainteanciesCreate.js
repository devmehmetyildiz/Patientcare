import { connect } from 'react-redux'
import MainteanciesCreate from '../../Pages/Mainteancies/MainteanciesCreate'
import { AddMainteancies, fillMainteancenotification } from "../../Redux/MainteanceSlice"
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Mainteancies: state.Mainteancies,
    Users: state.Users,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { GetUsagetypes, AddMainteancies, fillMainteancenotification, GetEquipments, GetEquipmentgroups, GetUsers }

export default connect(mapStateToProps, mapDispatchToProps)(MainteanciesCreate)