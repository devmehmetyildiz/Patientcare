import { connect } from 'react-redux'
import ClaimpaymentsDelete from '../../Pages/Claimpayments/ClaimpaymentsDelete'
import { DeleteClaimpayments, handleDeletemodal, handleSelectedClaimpayment } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteClaimpayments, handleDeletemodal, handleSelectedClaimpayment
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsDelete)