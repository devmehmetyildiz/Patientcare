import { connect } from 'react-redux'
import Passwordforget from "../../Pages/Auth/Passwordforget"
import { Passwordresetrequest, removenotification, fillnotification } from "../../Redux/Actions/ProfileAction"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    Passwordresetrequest, removenotification, fillnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Passwordforget)