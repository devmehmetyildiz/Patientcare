import { connect } from 'react-redux'
import PatientstockmovementsDelete from '../../Pages/Patientstockmovements/PatientstockmovementsDelete'
import { DeletePatientstockmovements, handleDeletemodal, handleSelectedPatientstockmovement } from '../../Redux/PatientstockmovementSlice'


const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientstockmovements, handleDeletemodal, handleSelectedPatientstockmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsDelete)