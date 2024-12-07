import { connect } from 'react-redux'
import Overviewcard from '../../Pages/Overviewcard/Overviewcard'


const mapStateToProps = (state) => ({
    Profile: state.Profile,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Overviewcard)