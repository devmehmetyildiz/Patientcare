import { connect } from 'react-redux'
import CareplansComplete from '../../Pages/Careplans/CareplansComplete'
import { CompleteCareplans,  } from '../../Redux/CareplanSlice'

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteCareplans, 
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplansComplete)