import { connect } from 'react-redux'
import MailsettingsDelete from '../../Pages/Mailsettings/MailsettingsDelete'
import { DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting } from "../../Redux/MailsettingSlice"

const mapStateToProps = (state) => ({
    Mailsettings: state.Mailsettings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteMailsettings, handleDeletemodal, handleSelectedMailsetting
}

export default connect(mapStateToProps, mapDispatchToProps)(MailsettingsDelete)