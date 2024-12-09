import { connect } from 'react-redux'
import UsersLeft from "../../Pages/Users/UsersLeft"
import { RemoveUsers, fillUsernotification } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    RemoveUsers, fillUsernotification

}

export default connect(mapStateToProps, mapDispatchToProps)(UsersLeft)