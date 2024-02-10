import { connect } from 'react-redux'
import Supportplanlists from '../../Pages/Supportplanlists/Supportplanlists'
import { GetSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist } from '../../Redux/SupportplanlistSlice'
import { GetSupportplans } from '../../Redux/SupportplanSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Profile: state.Profile,
    Supportplans: state.Supportplans,
    Departments: state.Departments
})

const mapDispatchToProps = {
    GetSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist, GetSupportplans, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(Supportplanlists)