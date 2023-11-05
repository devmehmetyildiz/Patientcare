import { connect } from 'react-redux'
import Passwordforget from "../../Pages/Auth/Passwordforget"
import { fillnotification, Createpasswordforget } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
     fillnotification, Createpasswordforget
}

export default connect(mapStateToProps, mapDispatchToProps)(Passwordforget)