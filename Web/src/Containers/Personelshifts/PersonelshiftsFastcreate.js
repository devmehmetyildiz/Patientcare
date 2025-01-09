import { connect } from 'react-redux'
import PersonelshiftsFastcreate from '../../Pages/Personelshifts/PersonelshiftsFastcreate'


const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsFastcreate)