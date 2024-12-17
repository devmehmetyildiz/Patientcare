import { connect } from 'react-redux'
import OverviewcardUserleftcount from '../../Pages/Overviewcard/OverviewcardUserleftcount'
import { GetUserleftcount } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetUserleftcount
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardUserleftcount)