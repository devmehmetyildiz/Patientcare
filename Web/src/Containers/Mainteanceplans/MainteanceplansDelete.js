import { connect } from 'react-redux'
import MainteanceplansDelete from '../../Pages/Mainteanceplans/MainteanceplansDelete'
import { DeleteMainteanceplans } from '../../Redux/MainteanceplanSlice'

const mapStateToProps = (state) => ({
    Mainteanceplans: state.Mainteanceplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteMainteanceplans
}

export default connect(mapStateToProps, mapDispatchToProps)(MainteanceplansDelete)