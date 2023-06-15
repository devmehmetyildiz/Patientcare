import { connect } from 'react-redux'
import ProfileEdit from '../../Pages/Auth/ProfileEdit'
import { GetUserMeta, removenotification, fillnotification } from "../../Redux/Actions/ProfileAction"
import { EditUsers, removeUsernotification } from "../../Redux/Reducers/UserReducer"
import { EditFiles, removeFilenotification, fillFilenotification } from "../../Redux/Reducers/FileReducer"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Files: state.Files
})

const mapDispatchToProps = {
    GetUserMeta, EditUsers, EditFiles, removeFilenotification,
    fillFilenotification, removenotification, fillnotification, removeUsernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)