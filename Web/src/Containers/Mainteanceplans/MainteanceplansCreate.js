import { connect } from 'react-redux'
import MainteanceplansCreate from '../../Pages/Mainteanceplans/MainteanceplansCreate'
import { AddMainteanceplans, fillMainteanceplannotification } from '../../Redux/MainteanceplanSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddMainteanceplans, fillMainteanceplannotification,
    GetEquipments, GetEquipmentgroups, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansCreate)