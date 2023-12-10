import { connect } from 'react-redux'
import Notifications from '../../Pages/Notifications/Notifications'
import { GetUsernotifications, handleViewmodal, handleDeletemodal, handleSelectedUsernotification } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetUsernotifications, handleViewmodal, handleDeletemodal, handleSelectedUsernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)