import { connect } from 'react-redux'
import UnitsEdit from '../../Pages/Units/UnitsEdit'
import { EditUnits, GetUnit,  fillUnitnotification } from "../../Redux/UnitSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { EditUnits, GetUnit, fillUnitnotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsEdit)