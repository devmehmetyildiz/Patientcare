import { connect } from 'react-redux'
import PrinttemplatesEdit from '../../Pages/Printtemplates/PrinttemplatesEdit'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/DepartmentSlice'
import { GetPrinttemplate, EditPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification } from '../../Redux/PrinttemplateSlice'

const mapStateToProps = (state) => ({
    Departments: state.Departments,
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrinttemplate, GetDepartments, removeDepartmentnotification, EditPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinttemplatesEdit)