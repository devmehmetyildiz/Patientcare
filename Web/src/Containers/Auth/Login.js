import { connect } from 'react-redux'
import Login from "../../Pages/Auth/Login"
import { logIn, logOut, fillnotification } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = { logIn, logOut, fillnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Login)
