import { connect } from 'react-redux'
import PersonelshiftsApprove from "../../Pages/Personelshifts/PersonelshiftsApprove"
import { ApprovePersonelshifts, handleApprovemodal, handleSelectedPersonelshift } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePersonelshifts, handleApprovemodal, handleSelectedPersonelshift
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsApprove)