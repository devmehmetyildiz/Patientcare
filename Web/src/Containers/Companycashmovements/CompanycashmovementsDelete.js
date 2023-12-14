import { connect } from 'react-redux'
import CompanycashmovementsDelete from '../../Pages/Companycashmovements/CompanycashmovementsDelete'
import { DeleteCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement } from '../../Redux/CompanycashmovementSlice'


const mapStateToProps = (state) => ({
    Companycashmovements: state.Companycashmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanycashmovementsDelete)