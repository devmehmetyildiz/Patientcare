import { connect } from 'react-redux'
import PersonelshiftsDelete from "../../Pages/Personelshifts/PersonelshiftsDelete"
import { DeleteShiftrequests, handleDeletemodal, handleSelectedPersonel } from "../../Redux/ShiftSlice"

const mapStateToProps = (state) => ({
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonels, handleDeletemodal, handleSelectedPersonel
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDelete)