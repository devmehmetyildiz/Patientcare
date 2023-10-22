import { connect } from 'react-redux'
import PasswordChange from '../../Pages/Auth/PasswordChange'
import { Changepassword, removenotification, fillnotification } from "../../Redux/ProfileSlice"


const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    removenotification, fillnotification, Changepassword
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange)