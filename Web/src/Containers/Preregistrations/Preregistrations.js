import { connect } from 'react-redux'
import Preregistrations from "../../Pages/Preregistrations/Preregistrations"
import { Getpreregistrations, CompletePrepatients, removePatientnotification, DeletePatients, fillPatientnotification } from "../../Redux/Actions/PatientAction"
import { GetWarehouses, removeWarehousenotification } from "../../Redux/Actions/WarehouseAction"

const mapStateToProps = (state) => ({
  Patients: state.Patients,
  Profile: state.Profile,
  Warehouses: state.Warehouses
})

const mapDispatchToProps = { Getpreregistrations, CompletePrepatients, removePatientnotification, DeletePatients, fillPatientnotification, GetWarehouses, removeWarehousenotification }

export default connect(mapStateToProps, mapDispatchToProps)(Preregistrations)