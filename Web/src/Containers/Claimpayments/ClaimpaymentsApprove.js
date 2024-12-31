import { connect } from 'react-redux'
import ClaimpaymentsApprove from '../../Pages/Claimpayments/ClaimpaymentsApprove'
import { ApproveClaimpayments, } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveClaimpayments,
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsApprove)