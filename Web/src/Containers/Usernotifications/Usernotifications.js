import { connect } from 'react-redux'
import Usernotifications from '../../Pages/Usernotifications/Usernotifications'
import { GetUsernotifications, DeleteUsernotifications, DeleteByUserID, DeleteReadByUserID, ShowAllNotificationByUser } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetUsernotifications, DeleteUsernotifications, DeleteByUserID, DeleteReadByUserID, ShowAllNotificationByUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Usernotifications)