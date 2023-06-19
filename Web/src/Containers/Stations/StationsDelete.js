import { connect } from 'react-redux'
import StationsDelete from '../../Pages/Stations/StationsDelete'
import { DeleteStations, handleDeletemodal, handleSelectedStation } from '../../Redux/StationSlice'

const mapStateToProps = (state) => ({
    Stations: state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = {
     DeleteStations, handleDeletemodal, handleSelectedStation
}

export default connect(mapStateToProps, mapDispatchToProps)(StationsDelete)