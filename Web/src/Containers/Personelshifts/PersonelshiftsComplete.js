import { connect } from 'react-redux'
import PersonelshiftsComplete from "../../Pages/Personelshifts/PersonelshiftsComplete"
import { CompletePersonelshifts, handleCompletemodal, handleSelectedPersonelshift } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompletePersonelshifts, handleCompletemodal, handleSelectedPersonelshift
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsComplete)