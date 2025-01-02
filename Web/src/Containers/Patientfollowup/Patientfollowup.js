import { connect } from 'react-redux'
import Patientfollowup from '../../Pages/Patientfollowup/Patientfollowup'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetBeds } from '../../Redux/BedSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes,
    Cases: state.Cases,
    Beds: state.Beds,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetPatients, GetPatientdefines, GetCostumertypes, GetPatienttypes, GetCases, GetBeds
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientfollowup)