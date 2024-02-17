import { connect } from 'react-redux'
import HelpstatusCreate from '../../Pages/Helpstatus/HelpstatusCreate'
import { AddHelpstatus, fillHelpstatunotification } from "../../Redux/HelpstatuSlice"

const mapStateToProps = (state) => ({
    Helpstatus: state.Helpstatus,
    Profile: state.Profile
})

const mapDispatchToProps = { AddHelpstatus, fillHelpstatunotification }

export default connect(mapStateToProps, mapDispatchToProps)(HelpstatusCreate)