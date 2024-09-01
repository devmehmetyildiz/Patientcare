import { connect } from 'react-redux'
import Log from '../../Pages/Log/Log'
import { GetLogsByQuerry } from "../../Redux/ReportSlice"

const mapStateToProps = (state) => ({
    Reports: state.Reports,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetLogsByQuerry
}

export default connect(mapStateToProps, mapDispatchToProps)(Log)