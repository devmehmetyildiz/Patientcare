import { connect } from 'react-redux'
import ClaimpaymentsDelete from '../../Pages/Claimpayments/ClaimpaymentsDelete'
import { DeleteClaimpayments, } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteClaimpayments,
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsDelete)