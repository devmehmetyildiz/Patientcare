import { connect } from 'react-redux'
import PersonelshiftsComplete from "../../Pages/Personelshifts/PersonelshiftsComplete"
import { CompletePersonelshifts } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompletePersonelshifts
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsComplete)