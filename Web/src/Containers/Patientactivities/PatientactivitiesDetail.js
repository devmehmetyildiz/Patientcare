import { connect } from 'react-redux'
import PatientactivitiesDetail from '../../Pages/Patientactivities/PatientactivitiesDetail'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetProfessions } from '../../Redux/ProfessionSlice'

const mapStateToProps = (state) => ({
    Patientactivities: state.Patientactivities,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Users: state.Users,
    Costumertypes: state.Costumertypes,
    Patienttypes: state.Patienttypes,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatienttypes, GetCostumertypes, GetProfessions
}


export default connect(mapStateToProps, mapDispatchToProps)(PatientactivitiesDetail)