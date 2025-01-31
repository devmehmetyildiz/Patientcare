import { connect } from 'react-redux'
import EquipmentgroupsDelete from '../../Pages/Equipmentgroups/EquipmentgroupsDelete'
import { DeleteEquipmentgroups, } from "../../Redux/EquipmentgroupSlice"

const mapStateToProps = (state) => ({
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteEquipmentgroups,
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentgroupsDelete)