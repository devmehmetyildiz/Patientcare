import { connect } from 'react-redux'
import Patientstockmovements from '../../Pages/Patientstockmovements/Patientstockmovements'
import {
    GetPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements
} from '../../Redux/PatientstockmovementSlice'


const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstockmovements)