import { connect } from 'react-redux'
import PreregistrationsEdit from "../../Pages/Preregistrations/PreregistrationsEdit"
import { GetPatient, EditPatients, fillPatientnotification } from "../../Redux/PatientSlice"
import { GetStocks } from '../../Redux/StockSlice'
import { GetFiles } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Stocks: state.Stocks,
  Files: state.Files,
  Stockdefines: state.Stockdefines,
  Stocktypes: state.Stocktypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatient, EditPatients, fillPatientnotification, GetStocks, GetFiles
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsEdit)