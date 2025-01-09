import { connect } from 'react-redux'
import PersonelshiftsSavepreview from "../../Pages/Personelshifts/PersonelshiftsSavepreview"
import { SavepreviewPersonelshifts } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewPersonelshifts
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsSavepreview)