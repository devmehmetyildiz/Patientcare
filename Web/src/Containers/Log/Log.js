import { connect } from 'react-redux'
import Log from '../../Pages/Log/Log'
import { GetLogsByQuerry } from "../../Redux/ReportSlice"
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Reports: state.Reports,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetLogsByQuerry, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Log)