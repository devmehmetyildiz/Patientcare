import { connect } from 'react-redux'
import PatientstockmovementsApprove from '../../Pages/Patientstockmovements/PatientstockmovementsApprove'
import { ApprovePatientstockmovements, handleApprovemodal, handleSelectedPatientstockmovement } from '../../Redux/PatientstockmovementSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApprovePatientstockmovements, handleApprovemodal, handleSelectedPatientstockmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsApprove)