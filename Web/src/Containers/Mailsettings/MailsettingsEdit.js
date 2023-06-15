import { connect } from 'react-redux'
import MailsettingsEdit from '../../Pages/Mailsettings/MailsettingsEdit'
import { GetMailsetting, EditMailsettings, fillMailsettingnotification, removeMailsettingnotification } from "../../Redux/Reducers/MailsettingReducer"


const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetMailsetting, EditMailsettings, fillMailsettingnotification, removeMailsettingnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(MailsettingsEdit)