import { connect } from 'react-redux'
import Printtemplates from '../../Pages/Printtemplates/Printtemplates'
import { GetPrinttemplates,  DeletePrinttemplates, handleDeletemodal, handleSelectedPrinttemplate } from '../../Redux/PrinttemplateSlice'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPrinttemplates,  DeletePrinttemplates,
    handleDeletemodal, handleSelectedPrinttemplate
}

export default connect(mapStateToProps, mapDispatchToProps)(Printtemplates)