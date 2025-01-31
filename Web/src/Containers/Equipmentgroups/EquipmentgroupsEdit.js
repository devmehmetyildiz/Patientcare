import { connect } from 'react-redux'
import EquipmentgroupsEdit from '../../Pages/Equipmentgroups/EquipmentgroupsEdit'
import { GetEquipmentgroup, EditEquipmentgroups, fillEquipmentgroupnotification } from "../../Redux/EquipmentgroupSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { GetEquipmentgroup, EditEquipmentgroups, fillEquipmentgroupnotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentgroupsEdit)