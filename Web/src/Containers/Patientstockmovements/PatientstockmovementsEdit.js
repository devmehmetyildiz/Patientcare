import { connect } from 'react-redux'
import PatientstockmovementsEdit from '../../Pages/Patientstockmovements/PatientstockmovementsEdit'
import { EditPatientstockmovements, GetPatientstockmovement, handleSelectedPatientstockmovement, removePatientstockmovementnotification, fillPatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks, removePatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Profile: state.Profile,
    Stockdefines: state.Stockdefines
})

const mapDispatchToProps = {
    EditPatientstockmovements, GetPatientstockmovement, handleSelectedPatientstockmovement, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    GetPatientstocks, removePatientstocknotification, GetStockdefines, removeStockdefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsEdit)