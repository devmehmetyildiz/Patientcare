import { connect } from 'react-redux'
import MailsettingsEdit from '../../Pages/Mailsettings/MailsettingsEdit'
import { GetMailsetting, EditMailsettings, fillMailsettingnotification, removeMailsettingnotification,handleSelectedMailsetting } from "../../Redux/MailsettingSlice"


const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetMailsetting, EditMailsettings, fillMailsettingnotification, removeMailsettingnotification,handleSelectedMailsetting
}

export default connect(mapStateToProps, mapDispatchToProps)(MailsettingsEdit)