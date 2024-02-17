import { connect } from 'react-redux'
import RatingsEdit from '../../Pages/Ratings/RatingsEdit'
import { EditRatings, GetRating, handleSelectedRating, fillRatingnotification } from "../../Redux/RatingSlice"

const mapStateToProps = (state) => ({
    Ratings: state.Ratings,
    Profile: state.Profile
})

const mapDispatchToProps = { EditRatings, GetRating, handleSelectedRating, fillRatingnotification }

export default connect(mapStateToProps, mapDispatchToProps)(RatingsEdit)