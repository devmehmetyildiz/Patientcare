import { connect } from 'react-redux'
import UsersMovements from '../../Pages/Users/UsersMovements'
import { GetUser, GetUsers, DeleteUsermovements, EditUsermovements, fillUsernotification } from "../../Redux/UserSlice"
import { GetCases } from "../../Redux/CaseSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUser, DeleteUsermovements, EditUsermovements, fillUsernotification, GetCases, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersMovements)