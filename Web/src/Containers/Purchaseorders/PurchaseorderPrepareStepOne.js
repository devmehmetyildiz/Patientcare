import { connect } from 'react-redux'
import PurchaseorderPrepareStepOne from "../../Pages/Purchaseorders/PurchaseorderPrepareStepOne"
import { GetUsers } from '../../Redux/UserSlice'
import { GetWarehouses } from '../../Redux/WarehouseSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetCases } from '../../Redux/CaseSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Users: state.Users,
    Warehouses: state.Warehouses,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Cases: state.Cases,
    Departments: state.Departments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUsers,
    GetWarehouses,
    GetPatients,
    GetPatientdefines,
    GetCases,
    GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderPrepareStepOne)