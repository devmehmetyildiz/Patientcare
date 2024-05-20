import { connect } from 'react-redux'
import PersonelshiftsFastcreate from '../../Pages/Personelshifts/PersonelshiftsFastcreate'
import { GetfastcreatedPersonelshifts } from "../../Redux/PersonelshiftSlice"


const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetfastcreatedPersonelshifts
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsFastcreate)