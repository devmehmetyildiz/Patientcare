import { connect } from 'react-redux'
import Userincidents from '../../Pages/Userincidents/Userincidents'
import { GetUserincidents } from '../../Redux/UserincidentSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetUserincidents, GetUsers,
}


export default connect(mapStateToProps, mapDispatchToProps)(Userincidents)