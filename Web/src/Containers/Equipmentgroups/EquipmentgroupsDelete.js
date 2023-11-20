import { connect } from 'react-redux'
import EquipmentgroupsDelete from '../../Pages/Equipmentgroups/EquipmentgroupsDelete'
import { DeleteEquipmentgroups, handleDeletemodal, handleSelectedEquipmentgroup } from "../../Redux/EquipmentgroupSlice"

const mapStateToProps = (state) => ({
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteEquipmentgroups, handleDeletemodal, handleSelectedEquipmentgroup
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentgroupsDelete)