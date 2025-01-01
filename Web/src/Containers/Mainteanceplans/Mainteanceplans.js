import { connect } from 'react-redux'
import Mainteanceplans from '../../Pages/Mainteanceplans/Mainteanceplans'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetMainteanceplans } from '../../Redux/MainteanceplanSlice'
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
    GetMainteanceplans, GetEquipments, GetEquipmentgroups, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Mainteanceplans)