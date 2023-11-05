import { connect } from 'react-redux'
import PatientstockmovementsEdit from '../../Pages/Patientstockmovements/PatientstockmovementsEdit'
import { EditPatientstockmovements, GetPatientstockmovement, handleSelectedPatientstockmovement,  fillPatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Profile: state.Profile,
    Stockdefines: state.Stockdefines
})

const mapDispatchToProps = {
    EditPatientstockmovements, GetPatientstockmovement, handleSelectedPatientstockmovement, fillPatientstockmovementnotification,
    GetPatientstocks,  GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsEdit)