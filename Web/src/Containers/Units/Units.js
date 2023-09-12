import { connect } from 'react-redux'
import Units from "../../Pages/Units/Units"
import { GetUnits, DeleteUnits, removeUnitnotification, fillUnitnotification, handleDeletemodal, handleSelectedUnit } from "../../Redux/UnitSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetUnits, DeleteUnits, removeUnitnotification, fillUnitnotification,
  handleDeletemodal, handleSelectedUnit, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Units)