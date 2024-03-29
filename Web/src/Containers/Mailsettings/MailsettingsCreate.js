import { connect } from 'react-redux'
import MailsettingsCreate from '../../Pages/Mailsettings/MailsettingsCreate'
import { AddMailsettings, fillMailsettingnotification } from "../../Redux/MailsettingSlice"


const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddMailsettings, fillMailsettingnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(MailsettingsCreate)