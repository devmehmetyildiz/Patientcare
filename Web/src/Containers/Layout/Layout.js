import { connect } from 'react-redux'
import Layout from "../../Pages/Layout/Layout"
import { GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta } from "../../Redux/Actions/ProfileAction"

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetActiveUser, GetUserRoles, logOut, GetTableMeta, GetUserMeta
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)