import { connect } from 'react-redux'
import PatientsuppliesDelete from '../../Pages/Patientsupplies/PatientsuppliesDelete'
import { DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsuppliesDelete)