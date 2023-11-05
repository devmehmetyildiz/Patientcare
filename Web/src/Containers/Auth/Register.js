import { connect } from 'react-redux'
import Register from '../../Pages/Auth/Register'
import { register,  fillnotification } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = { register,  fillnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Register)