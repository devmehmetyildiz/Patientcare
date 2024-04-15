import { connect } from 'react-redux'
import PersonelshiftsDeactive from "../../Pages/Personelshifts/PersonelshiftsDeactive"
import { DeactivePersonelshifts, handleDeactivemodal, handleSelectedPersonelshift } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeactivePersonelshifts, handleDeactivemodal, handleSelectedPersonelshift
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDeactive)