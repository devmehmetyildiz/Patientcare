import { connect } from 'react-redux'
import ClaimpaymentsSavepreview from '../../Pages/Claimpayments/ClaimpaymentsSavepreview'
import { SavepreviewClaimpayments, handleSavepreviewmodal, handleSelectedClaimpayment } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewClaimpayments, handleSavepreviewmodal, handleSelectedClaimpayment
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsSavepreview)