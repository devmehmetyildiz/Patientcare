import { connect } from 'react-redux'
import UserincidentsComplete from '../../Pages/Userincidents/UserincidentsComplete'
import { CompleteUserincidents, GetUserincidents } from '../../Redux/UserincidentSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteUserincidents, GetUserincidents
}


export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsComplete)