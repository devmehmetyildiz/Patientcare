import { connect } from 'react-redux'
import CareplansSavepreview from '../../Pages/Careplans/CareplansSavepreview'
import { SavepreviewCareplans, } from '../../Redux/CareplanSlice'

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewCareplans,
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansSavepreview)