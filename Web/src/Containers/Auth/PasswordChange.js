import { connect } from 'react-redux'
import PasswordChange from '../../Pages/Auth/PasswordChange'
import { removenotification, fillnotification } from "../../Redux/ProfileSlice"


const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    removenotification, fillnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordChange)