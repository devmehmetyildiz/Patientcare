import { connect } from 'react-redux'
import SupportplanlistsCreate from '../../Pages/Supportplanlists/SupportplanlistsCreate'
import { GetSupportplans } from '../../Redux/SupportplanSlice'
import { AddSupportplanlists, fillSupportplanlistnotification } from '../../Redux/SupportplanlistSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Supportplans: state.Supportplans,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplans, AddSupportplanlists, fillSupportplanlistnotification, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplanlistsCreate)