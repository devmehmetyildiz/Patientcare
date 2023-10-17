import { connect } from 'react-redux'
import Printtemplates from '../../Pages/Printtemplates/Printtemplates'
import { GetPrinttemplates, removePrinttemplatenotification, DeletePrinttemplates, handleDeletemodal, handleSelectedPrinttemplate } from '../../Redux/PrinttemplateSlice'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrinttemplates, removePrinttemplatenotification, DeletePrinttemplates,
    handleDeletemodal, handleSelectedPrinttemplate, GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Printtemplates)