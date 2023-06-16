import { connect } from 'react-redux'
import Mailsettings from '../../Pages/Mailsettings/Mailsettings'
import { GetMailsettings, removeMailsettingnotification, DeleteMailsettings } from "../../Redux/MailsettingSlice"

const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetMailsettings, removeMailsettingnotification, DeleteMailsettings
}

export default connect(mapStateToProps, mapDispatchToProps)(Mailsettings)