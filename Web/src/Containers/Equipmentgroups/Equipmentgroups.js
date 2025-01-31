import { connect } from 'react-redux'
import Equipmentgroups from '../../Pages/Equipmentgroups/Equipmentgroups'
import { GetEquipmentgroups, } from '../../Redux/EquipmentgroupSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Equipmentgroups: state.Equipmentgroups,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetEquipmentgroups, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipmentgroups)