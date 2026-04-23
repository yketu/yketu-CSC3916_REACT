import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import {connect} from 'react-redux';
import {Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs'
import { Image } from 'react-bootstrap';

class MovieDetail extends Component {
    state = {
        rating: 5,
        reviewText: '',
        message: ''
    };

    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/reviews`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    movieId: this.props.movieId,
                    rating: this.state.rating,
                    review: this.state.reviewText
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            this.setState({
                message: "Review added!",
                reviewText: "",
                rating: 5
            });

            this.props.dispatch(fetchMovie(this.props.movieId));
        } else {
            this.setState({ message: data.message });
        }
    };

    render() {
        if (!this.props.selectedMovie) {
            return <div>Loading....</div>;
        }
    
        return (
            <Card>
                <Card.Header>Movie Detail</Card.Header>
    
                <Card.Body>
                    <Image
                        className="image"
                        src={this.props.selectedMovie.imageUrl}
                        thumbnail
                    />
                </Card.Body>
    
                <ListGroup>
                    <ListGroupItem>
                        {this.props.selectedMovie.title}
                    </ListGroupItem>
    
                    <ListGroupItem>
                        {this.props.selectedMovie.actors.map((actor, i) =>
                            <p key={i}>
                                <b>{actor.actorName}</b> {actor.characterName}
                            </p>
                        )}
                    </ListGroupItem>
    
                    <ListGroupItem>
                        <h4>
                            <BsStarFill /> {this.props.selectedMovie.avgRating}
                        </h4>
                    </ListGroupItem>
                </ListGroup>
    
                {/* EXISTING REVIEWS */}
                <Card.Body>
                    {this.props.selectedMovie.reviews.map((review, i) =>
                        <p key={i}>
                            <b>{review.username}</b> {review.review}
                            &nbsp; <BsStarFill /> {review.rating}
                        </p>
                    )}
                </Card.Body>
    
                {/* ADD REVIEW FORM */}
                <Card.Body>
                    <h5>Add Review</h5>
    
                    {this.state.message && (
                        <p>{this.state.message}</p>
                    )}
    
                    <form onSubmit={this.handleSubmit}>
    
                        {/* Rating */}
                        <select
                            value={this.state.rating}
                            onChange={(e) =>
                                this.setState({ rating: Number(e.target.value) })
                            }
                        >
                            <option value="5">5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </select>
    
                        {/* Review text */}
                        <textarea
                            value={this.state.reviewText}
                            onChange={(e) =>
                                this.setState({ reviewText: e.target.value })
                            }
                            required
                        />
    
                        {/* Submit button */}
                        <button type="submit">
                            Submit Review
                        </button>
    
                    </form>
                </Card.Body>
    
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedMovie: state.movie.selectedMovie
    };
};

export default connect(mapStateToProps)(MovieDetail);

