import { connect } from 'react-redux'
import Appreports from "../../Pages/Appreports/Appreports"
import { GetLogs, } from "../../Redux/ReportSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Reports: state.Reports,
    Users: state.Users
})

const mapDispatchToProps = {
    GetLogs, GetUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Appreports)