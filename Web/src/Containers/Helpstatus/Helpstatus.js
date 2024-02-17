import { connect } from 'react-redux'
import Helpstatus from '../../Pages/Helpstatus/Helpstatus'
import { GetHelpstatus, handleDeletemodal, handleSelectedHelpstatu } from "../../Redux/HelpstatuSlice"

const mapStateToProps = (state) => ({
    Helpstatus: state.Helpstatus,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetHelpstatus, handleDeletemodal, handleSelectedHelpstatu
}

export default connect(mapStateToProps, mapDispatchToProps)(Helpstatus)