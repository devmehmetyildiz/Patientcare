import { connect } from 'react-redux'
import Register from '../../Pages/Auth/Register'
import { register, removenotification, fillnotification } from "../../Redux/Actions/ProfileAction"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = { register, removenotification, fillnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Register)