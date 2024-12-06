import { connect } from 'react-redux'
import UserincidentsDelete from '../../Pages/Userincidents/UserincidentsDelete'
import { DeleteUserincidents, GetUserincidents } from '../../Redux/UserincidentSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteUserincidents, GetUserincidents
}


export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsDelete)