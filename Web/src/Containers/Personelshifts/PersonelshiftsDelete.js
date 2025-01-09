import { connect } from 'react-redux'
import PersonelshiftsDelete from "../../Pages/Personelshifts/PersonelshiftsDelete"
import { DeletePersonelshifts,  } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePersonelshifts, 
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsDelete)