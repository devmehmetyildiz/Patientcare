import { connect } from 'react-redux'
import SupportplanlistsEdit from '../../Pages/Supportplanlists/SupportplanlistsEdit'
import { GetSupportplans } from '../../Redux/SupportplanSlice'
import { GetSupportplanlist, EditSupportplanlists, fillSupportplanlistnotification } from '../../Redux/SupportplanlistSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Supportplans: state.Supportplans,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplans, GetSupportplanlist, EditSupportplanlists, fillSupportplanlistnotification, GetDepartments

}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplanlistsEdit)