import { connect } from 'react-redux'
import FloorsFastcreate from '../../Pages/Floors/FloorsFastcreate'
import { handleFastcreatemodal, FastcreateFloors } from '../../Redux/FloorSlice'

const mapStateToProps = (state) => ({
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = { handleFastcreatemodal, FastcreateFloors }

export default connect(mapStateToProps, mapDispatchToProps)(FloorsFastcreate)