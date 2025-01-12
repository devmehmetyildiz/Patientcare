import { connect } from 'react-redux'
import PersonelshiftsFastcreate from '../../Pages/Personelshifts/PersonelshiftsFastcreate'
import { GetFastCreatedPersonelshift, removeFastCreatedList } from '../../Redux/PersonelshiftSlice'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetFastCreatedPersonelshift, removeFastCreatedList
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsFastcreate)