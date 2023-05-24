import { connect } from 'react-redux'
import PasswordChange from '../../Pages/Auth/PasswordChange'
import { ChangePassword, removenotification, fillnotification } from "../../Redux/Actions/ProfileAction"


const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    ChangePassword, removenotification, fillnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange)