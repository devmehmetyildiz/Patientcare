import { connect } from 'react-redux'
import CostumertypesEdit from '../../Pages/Costumertypes/CostumertypesEdit'
import { EditCostumertypes, GetCostumertype, RemoveSelectedCostumertype, removeCostumertypenotification, fillCostumertypenotification } from "../../Redux/Reducers/CostumertypeReducer"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Reducers/DepartmentReducer"

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCostumertypes, GetCostumertype, RemoveSelectedCostumertype, removeCostumertypenotification, fillCostumertypenotification,
  GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesEdit)