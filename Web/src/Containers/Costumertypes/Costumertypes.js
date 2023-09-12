import { connect } from 'react-redux'
import Costumertypes from "../../Pages/Costumertypes/Costumertypes"
import {
  GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification
  , handleDeletemodal, handleSelectedCostumertype
} from "../../Redux/CostumertypeSlice"
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetCostumertypes, DeleteCostumertypes, removeCostumertypenotification, fillCostumertypenotification,
  handleDeletemodal, handleSelectedCostumertype,
  GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Costumertypes)