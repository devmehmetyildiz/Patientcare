import { connect } from 'react-redux'
import PrinttemplatesDelete from '../../Pages/Printtemplates/PrinttemplatesDelete'
import { DeletePrinttemplates, handleDeletemodal, handleSelectedPrinttemplate } from '../../Redux/PrinttemplateSlice'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePrinttemplates, handleDeletemodal, handleSelectedPrinttemplate
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinttemplatesDelete)