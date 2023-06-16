import { connect } from 'react-redux'
import Users from "../../Pages/Users/Users"
import { GetUsers, DeleteUsers, fillUsernotification, removeUsernotification } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers, DeleteUsers, fillUsernotification, removeUsernotification
   
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)