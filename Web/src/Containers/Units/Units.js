import { connect } from 'react-redux'
import Units from "../../Pages/Units/Units"
import { GetUnits, DeleteUnits,  fillUnitnotification, handleDeletemodal, handleSelectedUnit } from "../../Redux/UnitSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetUnits, DeleteUnits,  fillUnitnotification,
  handleDeletemodal, handleSelectedUnit, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Units)