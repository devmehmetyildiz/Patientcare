import { connect } from 'react-redux'
import HelpstatusEdit from '../../Pages/Helpstatus/HelpstatusEdit'
import { EditHelpstatus, GetHelpstatu, handleSelectedHelpstatu, fillHelpstatunotification } from "../../Redux/HelpstatuSlice"

const mapStateToProps = (state) => ({
    Helpstatus: state.Helpstatus,
    Profile: state.Profile
})

const mapDispatchToProps = { EditHelpstatus, GetHelpstatu, handleSelectedHelpstatu, fillHelpstatunotification }

export default connect(mapStateToProps, mapDispatchToProps)(HelpstatusEdit)