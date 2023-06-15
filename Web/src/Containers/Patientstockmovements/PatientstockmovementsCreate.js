import { connect } from 'react-redux'
import PatientstockmovementsCreate from '../../Pages/Patientstockmovements/PatientstockmovementsCreate'
import { AddPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification } from '../../Redux/Reducers/PatientstockmovementReducer'
import { GetPatientstocks, removePatientstocknotification } from '../../Redux/Reducers/PatientstockReducer'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})


const mapDispatchToProps = {
    AddPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    GetPatientstocks, removePatientstocknotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsCreate)