import { connect } from 'react-redux'
import PrinttemplatesCreate from '../../Pages/Printtemplates/PrinttemplatesCreate'
import { AddPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification } from '../../Redux/Actions/PrinttemplateAction'
import { GetDepartments, removeDepartmentnotification } from '../../Redux/Actions/DepartmentAction'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification,GetDepartments, removeDepartmentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinttemplatesCreate)