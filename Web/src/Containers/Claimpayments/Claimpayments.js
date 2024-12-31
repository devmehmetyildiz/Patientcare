import { connect } from 'react-redux'
import Claimpayments from '../../Pages/Claimpayments/Claimpayments'
import { GetClaimpayments } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetClaimpayments
}

export default connect(mapStateToProps, mapDispatchToProps)(Claimpayments)