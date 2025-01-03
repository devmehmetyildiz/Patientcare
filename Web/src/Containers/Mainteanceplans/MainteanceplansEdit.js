import { connect } from 'react-redux'
import MainteanceplansEdit from '../../Pages/Mainteanceplans/MainteanceplansEdit'
import { EditMainteanceplans, GetMainteanceplan, fillMainteanceplannotification } from '../../Redux/MainteanceplanSlice'
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
    EditMainteanceplans, GetMainteanceplan, fillMainteanceplannotification,
    GetEquipments, GetEquipmentgroups, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansEdit)