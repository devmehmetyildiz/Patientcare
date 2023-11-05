import { connect } from 'react-redux'
import Mailsettings from '../../Pages/Mailsettings/Mailsettings'
import { GetMailsettings,  DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting } from "../../Redux/MailsettingSlice"

const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetMailsettings,  DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting
}

export default connect(mapStateToProps, mapDispatchToProps)(Mailsettings)