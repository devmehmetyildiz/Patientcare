import { connect } from 'react-redux'
import Layout from "../../Pages/Layout/Layout"
import { GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification } from "../../Redux/ProfileSlice"
import { removeUsernotification } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users
})

const mapDispatchToProps = {
    GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification, removeUsernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)