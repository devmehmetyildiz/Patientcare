import { connect } from 'react-redux'
import Stations from '../../Pages/Stations/Stations'
import { GetStations,removeStationnotification ,fillStationnotification,DeleteStations } from '../../Redux/Actions/StationAction'

const mapStateToProps = (state) => ({
    Stations:state.Stations,
    Profile: state.Profile
})

const mapDispatchToProps = {GetStations,removeStationnotification ,fillStationnotification,DeleteStations}

export default connect(mapStateToProps, mapDispatchToProps)(Stations)