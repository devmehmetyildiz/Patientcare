import { connect } from 'react-redux'
import UnitsCreate from '../../Pages/Units/UnitsCreate'
import { AddUnits, removeUnitnotification, fillUnitnotification } from "../../Redux/Reducers/UnitReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddUnits, removeUnitnotification, fillUnitnotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(UnitsCreate)