import { connect } from 'react-redux'
import Passwordforget from "../../Pages/Auth/Passwordforget"
import { removenotification, fillnotification } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    removenotification, fillnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Passwordforget)