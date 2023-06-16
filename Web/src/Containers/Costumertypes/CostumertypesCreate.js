import { connect } from 'react-redux'
import CostumertypesCreate from '../../Pages/Costumertypes/CostumertypesCreate'
import { AddCostumertypes, removeCostumertypenotification, fillCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCostumertypes, removeCostumertypenotification, fillCostumertypenotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesCreate)