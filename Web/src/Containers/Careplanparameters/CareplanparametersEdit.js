import { connect } from 'react-redux'
import CareplanparametersEdit from '../../Pages/Careplanparameters/CareplanparametersEdit'
import { EditCareplanparameters, GetCareplanparameter, handleSelectedCareplanparameter, fillCareplanparameternotification } from "../../Redux/CareplanparameterSlice"

const mapStateToProps = (state) => ({
    Careplanparameters: state.Careplanparameters,
    Profile: state.Profile
})

const mapDispatchToProps = { EditCareplanparameters, GetCareplanparameter, handleSelectedCareplanparameter, fillCareplanparameternotification }

export default connect(mapStateToProps, mapDispatchToProps)(CareplanparametersEdit)