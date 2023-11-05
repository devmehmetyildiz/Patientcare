import { connect } from 'react-redux'
import CostumertypesCreate from '../../Pages/Costumertypes/CostumertypesCreate'
import { AddCostumertypes,  fillCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCostumertypes,  fillCostumertypenotification, GetDepartments }

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesCreate)