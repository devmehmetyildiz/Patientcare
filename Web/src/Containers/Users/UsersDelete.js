import { connect } from 'react-redux'
import UsersDelete from "../../Pages/Users/UsersDelete"
import { DeleteUsers, handleDeletemodal, handleSelectedUser } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteUsers, handleDeletemodal, handleSelectedUser

}

export default connect(mapStateToProps, mapDispatchToProps)(UsersDelete)