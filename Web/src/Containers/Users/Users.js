import { connect } from 'react-redux'
import Users from "../../Pages/Users/Users"
import { GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal,handleSelectedUser } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, DeleteUsers, fillUsernotification, handleDeletemodal,handleSelectedUser
   
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)