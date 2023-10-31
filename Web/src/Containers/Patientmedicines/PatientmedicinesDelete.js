import { connect } from 'react-redux'
import PatientmedicinesDelete from '../../Pages/Patientmedicines/PatientmedicinesDelete'
import { DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock } from '../../Redux/PatientstockSlice'


const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientstocks, handleDeletemodal, handleSelectedPatientstock
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmedicinesDelete)