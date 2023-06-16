import { connect } from 'react-redux'
import StationsEdit from '../../Pages/Stations/StationsEdit'
import { EditStations, GetStation, handleSelectedStation, removeStationnotification, fillStationnotification } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = { EditStations, GetStation, handleSelectedStation, removeStationnotification, fillStationnotification }

export default connect(mapStateToProps, mapDispatchToProps)(StationsEdit)