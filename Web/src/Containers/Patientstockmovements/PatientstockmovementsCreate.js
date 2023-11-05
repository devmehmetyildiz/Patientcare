import { connect } from 'react-redux'
import PatientstockmovementsCreate from '../../Pages/Patientstockmovements/PatientstockmovementsCreate'
import { AddPatientstockmovements, fillPatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Profile: state.Profile
})


const mapDispatchToProps = {
    AddPatientstockmovements, fillPatientstockmovementnotification,
    GetPatientstocks
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsCreate)