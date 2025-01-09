import { connect } from 'react-redux'
import PersonelshiftsDeactivate from "../../Pages/Personelshifts/PersonelshiftsDeactivate"
import { DeactivatePersonelshifts, } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivatePersonelshifts,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDeactivate)