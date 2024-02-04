import { connect } from 'react-redux'
import Patientusemedicines from '../../Pages/Patientusemedicines/Patientusemedicines'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetPatientstockmovements, AddPatientstockmovements, fillPatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'


const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatients, GetPatientstocks, GetPatientstockmovements, GetPatientdefines, GetUnits, GetStockdefines, AddPatientstockmovements, fillPatientstockmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientusemedicines)