import { connect } from 'react-redux'
import PatientstockmovementsEdit from '../../Pages/Patientstockmovements/PatientstockmovementsEdit'
import { EditPatientstockmovements, GetPatientstockmovement, RemoveSelectedPatientstockmovement, removePatientstockmovementnotification, fillPatientstockmovementnotification } from '../../Redux/Actions/PatientstockmovementAction'
import { GetPatientstocks, removePatientstocknotification } from '../../Redux/Actions/PatientstockAction'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks
})

const mapDispatchToProps = {
    EditPatientstockmovements, GetPatientstockmovement, RemoveSelectedPatientstockmovement, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    GetPatientstocks, removePatientstocknotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsEdit)