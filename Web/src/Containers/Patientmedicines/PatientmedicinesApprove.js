import { connect } from 'react-redux'
import PatientmedicinesApprove from '../../Pages/Patientmedicines/PatientmedicinesApprove'
import { ApprovePatientstocks, handleApprovemodal, handleSelectedPatientstock } from "../../Redux/PatientstockSlice"
import { GetStockdefines } from "../../Redux/StockdefineSlice"

const mapStateToProps = (state) => ({
  Patientstocks: state.Patientstocks,
  Stockdefines: state.Stockdefines,
  Profile: state.Profile
})

const mapDispatchToProps = {
  ApprovePatientstocks, handleApprovemodal, handleSelectedPatientstock, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmedicinesApprove)