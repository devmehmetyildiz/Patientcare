import { connect } from 'react-redux'
import PatientstocksDelete from '../../Pages/Patientstocks/PatientstocksDelete'
import { DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstocksDelete)