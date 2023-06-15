import { connect } from 'react-redux'
import CostumertypesCreate from '../../Pages/Costumertypes/CostumertypesCreate'
import { AddCostumertypes, removeCostumertypenotification, fillCostumertypenotification } from "../../Redux/Reducers/CostumertypeReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCostumertypes, removeCostumertypenotification, fillCostumertypenotification, GetDepartments, removeDepartmentnotification }

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesCreate)