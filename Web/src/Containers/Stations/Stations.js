import { connect } from 'react-redux'
import Stations from '../../Pages/Stations/Stations'
import { GetStations,  fillStationnotification, DeleteStations, handleDeletemodal, handleSelectedStation } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStations,  fillStationnotification, DeleteStations,
    handleDeletemodal, handleSelectedStation
}

export default connect(mapStateToProps, mapDispatchToProps)(Stations)