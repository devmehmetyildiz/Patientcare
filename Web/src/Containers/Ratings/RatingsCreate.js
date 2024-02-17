import { connect } from 'react-redux'
import RatingsCreate from '../../Pages/Ratings/RatingsCreate'
import { AddRatings, fillRatingnotification } from "../../Redux/RatingSlice"

const mapStateToProps = (state) => ({
    Ratings: state.Ratings,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRatings, fillRatingnotification }

export default connect(mapStateToProps, mapDispatchToProps)(RatingsCreate)