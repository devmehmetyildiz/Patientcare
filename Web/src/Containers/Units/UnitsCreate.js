import { connect } from 'react-redux'
import UnitsCreate from '../../Pages/Units/UnitsCreate'
import { AddUnits, fillUnitnotification } from "../../Redux/UnitSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddUnits,  fillUnitnotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsCreate)