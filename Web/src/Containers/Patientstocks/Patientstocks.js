import { connect } from 'react-redux'
import Patientstocks from '../../Pages/Patientstocks/Patientstocks'
import { GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, DeletePatientstocks } from '../../Redux/Actions/PatientstockAction'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, DeletePatientstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstocks)