import { connect } from 'react-redux'
import Patientsrollcall from '../../Pages/Patientsrollcall/Patientsrollcall'
import { GetPatienttypes } from '../../Redux/PatienttypeSlice'
import { GetCostumertypes } from '../../Redux/CostumertypeSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetPatientsRollCall } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patienttypes: state.Patienttypes,
    Costumertypes: state.Costumertypes,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatienttypes, GetCostumertypes, GetCases, GetPatientsRollCall
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientsrollcall)