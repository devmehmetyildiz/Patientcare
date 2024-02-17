import { connect } from 'react-redux'
import Ratings from '../../Pages/Ratings/Ratings'
import { GetRatings, handleDeletemodal, handleSelectedRating } from "../../Redux/RatingSlice"

const mapStateToProps = (state) => ({
    Ratings: state.Ratings,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetRatings, handleDeletemodal, handleSelectedRating
}

export default connect(mapStateToProps, mapDispatchToProps)(Ratings)