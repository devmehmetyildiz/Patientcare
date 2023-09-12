import { connect } from 'react-redux'
import ExcelImport from '../../Pages/Utils/ExcelImport'

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ExcelImport)