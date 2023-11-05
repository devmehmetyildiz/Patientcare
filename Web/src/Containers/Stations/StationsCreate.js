import { connect } from 'react-redux'
import StationsCreate from '../../Pages/Stations/StationsCreate'
import { AddStations,  fillStationnotification } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { AddStations,  fillStationnotification }

export default connect(mapStateToProps, mapDispatchToProps)(StationsCreate)