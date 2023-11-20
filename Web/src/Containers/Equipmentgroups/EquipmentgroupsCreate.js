import { connect } from 'react-redux'
import EquipmentgroupsCreate from '../../Pages/Equipmentgroups/EquipmentgroupsCreate'
import { AddEquipmentgroups, fillEquipmentgroupnotification } from "../../Redux/EquipmentgroupSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { AddEquipmentgroups, fillEquipmentgroupnotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentgroupsCreate)