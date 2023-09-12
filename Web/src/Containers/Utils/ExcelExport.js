import { connect } from 'react-redux'
import ExcelExport from '../../Pages/Utils/ExcelExport'

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ExcelExport)