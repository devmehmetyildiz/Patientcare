import { connect } from 'react-redux'
import Careplanparameters from '../../Pages/Careplanparameters/Careplanparameters'
import { GetCareplanparameters, handleDeletemodal, handleSelectedCareplanparameter } from "../../Redux/CareplanparameterSlice"

const mapStateToProps = (state) => ({
    Careplanparameters: state.Careplanparameters,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetCareplanparameters, handleDeletemodal, handleSelectedCareplanparameter
}

export default connect(mapStateToProps, mapDispatchToProps)(Careplanparameters)