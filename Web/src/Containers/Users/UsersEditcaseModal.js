import { connect } from 'react-redux'
import UsersEditcaseModal from '../../Pages/Users/UsersEditcaseModal'
import { fillUsernotification, EditUsercase, GetUser, GetUsers } from "../../Redux/UserSlice"
import { GetCases } from "../../Redux/CaseSlice"
import { GetDepartments } from "../../Redux/DepartmentSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Cases: state.Cases,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillUsernotification, EditUsercase, GetUser, GetUsers, GetCases, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersEditcaseModal)