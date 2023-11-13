import { connect } from 'react-redux'
import PatientstockmovementsCreate from '../../Pages/Patientstockmovements/PatientstockmovementsCreate'
import { AddPatientstockmovements, fillPatientstockmovementnotification } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})


const mapDispatchToProps = {
    AddPatientstockmovements, fillPatientstockmovementnotification,
    GetPatientstocks, GetStockdefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientstockmovementsCreate)