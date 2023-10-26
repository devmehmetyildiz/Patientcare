import { connect } from 'react-redux'
import Layout from "../../Pages/Layout/Layout"
import { GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification, handlemobile } from "../../Redux/ProfileSlice"
import { removeUsernotification } from "../../Redux/UserSlice"
import { GetFiles, removeFilenotification } from "../../Redux/FileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Files: state.Files
})

const mapDispatchToProps = {
    GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification, removeUsernotification, GetFiles, removeFilenotification, handlemobile
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)