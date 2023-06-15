import { connect } from 'react-redux'
import Preregistrations from "../../Pages/Preregistrations/Preregistrations"
import { Getpreregistrations, CompletePrepatients, removePatientnotification, DeletePatients, fillPatientnotification } from "../../Redux/Reducers/PatientReducer"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/Reducers/WarehouseReducer"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Profile: state.Profile,
  Warehouses: state.Warehouses
})

const mapDispatchToProps = { Getpreregistrations, CompletePrepatients, removePatientnotification, DeletePatients, fillPatientnotification, GetWarehouses, removeWarehousenotification }

export default connect(mapStateToProps, mapDispatchToProps)(Preregistrations)