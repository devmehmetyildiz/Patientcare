import { connect } from 'react-redux'
import Layout from "../../Pages/Layout/Layout"
import { GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification } from "../../Redux/Actions/ProfileAction"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta, removenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)