import { connect } from 'react-redux'
import PasswordReset from '../../Pages/Auth/PasswordReset'
import { GetPasswordresetuser, Resetpassword, removenotification, fillnotification } from "../../Redux/ProfileSlice"


const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    removenotification, fillnotification, Resetpassword, GetPasswordresetuser
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset)