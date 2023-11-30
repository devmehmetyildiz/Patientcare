import { connect } from 'react-redux'
import PersonelshiftsDelete from "../../Pages/Personelshifts/PersonelshiftsDelete"
import { DeletePersonelshifts, handleDeletemodal, handleSelectedPersonelshift } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonelshifts, handleDeletemodal, handleSelectedPersonelshift
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDelete)