import { connect } from 'react-redux'
import Appreports from "../../Pages/Appreports/Appreports"
import { GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily ,GetLogByUser} from "../../Redux/ReportSlice"
import { GetUsers } from "../../Redux/UserSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Reports: state.Reports,
    Users: state.Users
})

const mapDispatchToProps = {
    GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily, GetUsers,GetLogByUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Appreports)