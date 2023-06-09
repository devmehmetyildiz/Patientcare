import { connect } from 'react-redux'
import CostumertypesEdit from '../../Pages/Costumertypes/CostumertypesEdit'
import { EditCostumertypes, GetCostumertype, RemoveSelectedCostumertype, removeCostumertypenotification, fillCostumertypenotification } from "../../Redux/Actions/CostumertypeAction"
import { GetDepartments, removeDepartmentnotification } from "../../Redux/Actions/DepartmentAction"

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