import { connect } from 'react-redux'
import CareplanparametersCreate from '../../Pages/Careplanparameters/CareplanparametersCreate'
import { AddCareplanparameters, fillCareplanparameternotification } from "../../Redux/CareplanparameterSlice"

const mapStateToProps = (state) => ({
    Careplanparameters: state.Careplanparameters,
    Profile: state.Profile
})

const mapDispatchToProps = { AddCareplanparameters, fillCareplanparameternotification }

export default connect(mapStateToProps, mapDispatchToProps)(CareplanparametersCreate)