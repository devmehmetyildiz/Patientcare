import { connect } from 'react-redux'
import CostumertypesEdit from '../../Pages/Costumertypes/CostumertypesEdit'
import { EditCostumertypes, GetCostumertype, handleSelectedCostumertype, fillCostumertypenotification } from "../../Redux/CostumertypeSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
  Costumertypes: state.Costumertypes,
  Departments: state.Departments,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCostumertypes, GetCostumertype, handleSelectedCostumertype, fillCostumertypenotification, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(CostumertypesEdit)