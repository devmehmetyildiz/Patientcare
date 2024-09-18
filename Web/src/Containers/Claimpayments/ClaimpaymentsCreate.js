import { connect } from 'react-redux'
import ClaimpaymentsCreate from '../../Pages/Claimpayments/ClaimpaymentsCreate'
import { AddClaimpayments, fillClaimpaymentnotification } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddClaimpayments, fillClaimpaymentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsCreate)