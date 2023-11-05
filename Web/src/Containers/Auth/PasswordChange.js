import { connect } from 'react-redux'
import PasswordChange from '../../Pages/Auth/PasswordChange'
import { Changepassword, fillnotification } from "../../Redux/ProfileSlice"


const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillnotification, Changepassword
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange)