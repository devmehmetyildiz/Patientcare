import { connect } from 'react-redux'
import Claimpayments from '../../Pages/Claimpayments/Claimpayments'
import { GetClaimpayments, handleApprovemodal, handleDeletemodal, handleSelectedClaimpayment } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetClaimpayments, handleApprovemodal, handleDeletemodal, handleSelectedClaimpayment
}

export default connect(mapStateToProps, mapDispatchToProps)(Claimpayments)