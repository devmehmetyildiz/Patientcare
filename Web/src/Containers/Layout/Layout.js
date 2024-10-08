import { connect } from 'react-redux'
import Layout from "../../Pages/Layout/Layout"
import { GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification, handlemobile, Checktoken, handleFocus, fillnotification } from "../../Redux/ProfileSlice"
import { removeUsernotification } from "../../Redux/UserSlice"
import { handleViewmodal, handleOpen } from "../../Redux/UsernotificationSlice"
import { GetFiles, GetPPFiles, removeFilenotification } from "../../Redux/FileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Usernotifications: state.Usernotifications,
})

const mapDispatchToProps = {
    GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification, removeUsernotification, fillnotification,
    GetFiles, removeFilenotification, handlemobile, handleViewmodal, Checktoken, GetUsagetypes, handleFocus, handleOpen, GetPPFiles
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)