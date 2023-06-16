import { connect } from 'react-redux'
import UnitsCreate from '../../Pages/Units/UnitsCreate'
import { AddUnits, removeUnitnotification, fillUnitnotification } from "../../Redux/UnitSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddUnits, removeUnitnotification, fillUnitnotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsCreate)