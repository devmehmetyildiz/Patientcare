import { connect } from 'react-redux'
import HelpstatusDelete from '../../Pages/Helpstatus/HelpstatusDelete'
import { DeleteHelpstatus, handleDeletemodal, handleSelectedHelpstatu } from "../../Redux/HelpstatuSlice"

const mapStateToProps = (state) => ({
    Helpstatus: state.Helpstatus,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteHelpstatus, handleDeletemodal, handleSelectedHelpstatu
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpstatusDelete)