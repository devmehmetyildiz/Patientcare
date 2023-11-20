import { connect } from 'react-redux'
import Equipmentgroups from '../../Pages/Equipmentgroups/Equipmentgroups'
import { GetEquipmentgroups, handleDeletemodal, handleSelectedEquipmentgroup } from '../../Redux/EquipmentgroupSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Equipmentgroups: state.Equipmentgroups,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetEquipmentgroups, handleDeletemodal, handleSelectedEquipmentgroup, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipmentgroups)