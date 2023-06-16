import { connect } from 'react-redux'
import Mailsettings from '../../Pages/Mailsettings/Mailsettings'
import { GetMailsettings, removeMailsettingnotification, DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting } from "../../Redux/MailsettingSlice"

const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetMailsettings, removeMailsettingnotification, DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting
}

export default connect(mapStateToProps, mapDispatchToProps)(Mailsettings)