import { connect } from 'react-redux'
import Costumertypes from "../../Pages/Costumertypes/Costumertypes"
import {
  GetCostumertypes, DeleteCostumertypes, fillCostumertypenotification
  , handleDeletemodal, handleSelectedCostumertype
} from "../../Redux/CostumertypeSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Profile: state.Profile,
  Departments: state.Departments
})

const mapDispatchToProps = {
  GetCostumertypes, DeleteCostumertypes, fillCostumertypenotification,
  handleDeletemodal, handleSelectedCostumertype, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Costumertypes)