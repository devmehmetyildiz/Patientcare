import { connect } from 'react-redux'
import UnitsEdit from '../../Pages/Units/UnitsEdit'
import { EditUnits, GetUnit, removeUnitnotification, fillUnitnotification } from "../../Redux/Actions/UnitActions"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments
})

const mapDispatchToProps = { EditUnits, GetUnit, removeUnitnotification, fillUnitnotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsEdit)