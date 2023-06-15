import { connect } from 'react-redux'
import UnitsEdit from '../../Pages/Units/UnitsEdit'
import { EditUnits, GetUnit, removeUnitnotification, fillUnitnotification } from "../../Redux/Reducers/UnitReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { EditUnits, GetUnit, removeUnitnotification, fillUnitnotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsEdit)