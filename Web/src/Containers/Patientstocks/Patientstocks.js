import { connect } from 'react-redux'
import Patientstocks from '../../Pages/Patientstocks/Patientstocks'
import { GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstocks)