import { connect } from 'react-redux'
import Passwordforget from "../../Pages/Auth/Passwordforget"
import { removenotification, fillnotification, Createpasswordforget } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    removenotification, fillnotification, Createpasswordforget
}

export default connect(mapStateToProps, mapDispatchToProps)(Passwordforget)