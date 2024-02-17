import { connect } from 'react-redux'
import RatingsDelete from '../../Pages/Ratings/RatingsDelete'
import { DeleteRatings, handleDeletemodal, handleSelectedRating } from "../../Redux/RatingSlice"

const mapStateToProps = (state) => ({
    Ratings: state.Ratings,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteRatings, handleDeletemodal, handleSelectedRating
}

export default connect(mapStateToProps, mapDispatchToProps)(RatingsDelete)