import { connect } from 'react-redux'
import PrinttemplatesEdit from '../../Pages/Printtemplates/PrinttemplatesEdit'
import { GetPrinttemplate, EditPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification } from '../../Redux/PrinttemplateSlice'

const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrinttemplate, EditPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinttemplatesEdit)