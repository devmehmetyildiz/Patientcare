import { connect } from 'react-redux'
import PersonelshiftsActivate from "../../Pages/Personelshifts/PersonelshiftsActivate"
import { ActivatePersonelshifts, } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ActivatePersonelshifts,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsActivate)