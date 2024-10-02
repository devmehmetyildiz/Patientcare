import { connect } from 'react-redux'
import CareplanparametersDelete from '../../Pages/Careplanparameters/CareplanparametersDelete'
import { DeleteCareplanparameters, handleDeletemodal, handleSelectedCareplanparameter } from "../../Redux/CareplanparameterSlice"

const mapStateToProps = (state) => ({
    Careplanparameters: state.Careplanparameters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteCareplanparameters, handleDeletemodal, handleSelectedCareplanparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(CareplanparametersDelete)