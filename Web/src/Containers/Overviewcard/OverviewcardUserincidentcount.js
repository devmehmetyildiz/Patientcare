import { connect } from 'react-redux'
import OverviewcardUserincidentcount from '../../Pages/Overviewcard/OverviewcardUserincidentcount'
import { GetUserincidentcount } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetUserincidentcount
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardUserincidentcount)