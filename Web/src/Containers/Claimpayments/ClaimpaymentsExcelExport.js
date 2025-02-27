import { connect } from 'react-redux'
import ClaimpaymentsExcelExport from '../../Pages/Claimpayments/ClaimpaymentsExcelExport'
import { fillClaimpaymentnotification } from '../../Redux/ClaimpaymentSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillClaimpaymentnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsExcelExport)