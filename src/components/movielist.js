import React, { Component } from 'react';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { connect } from 'react-redux';
import { Image, Nav, Form, Button } from 'react-bootstrap';
import { Carousel } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchResults: null,
            isSearching: false
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchMovies());
    }

    handleSelect(selectedIndex) {
        const { dispatch } = this.props;

        const moviesToUse =
            this.state.searchResults !== null
                ? this.state.searchResults
                : this.props.movies;

        if (moviesToUse && moviesToUse[selectedIndex]) {
            dispatch(setMovie(moviesToUse[selectedIndex]));
        }
    }

    handleClick = (movie) => {
        const { dispatch } = this.props;
        dispatch(setMovie(movie));
    };

    handleSearch = async (e) => {
        e.preventDefault();

        if (!this.state.searchTerm.trim()) return;

        this.setState({ isSearching: true });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/movies/search`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({
                        searchTerm: this.state.searchTerm
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                this.setState({ searchResults: data });
            } else {
                alert(data.message || "Search failed");
            }

        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ isSearching: false });
        }
    };

    clearSearch = () => {
        this.setState({
            searchTerm: '',
            searchResults: null
        });
    };

    render() {
        const moviesToShow =
            this.state.searchResults !== null
                ? this.state.searchResults
                : this.props.movies;

        return (
            <div>

                {/* 🔍 SEARCH BAR */}
                <Form onSubmit={this.handleSearch} className="d-flex gap-2 m-3">
                    <Form.Control
                        type="text"
                        placeholder="Search movie or actor..."
                        value={this.state.searchTerm}
                        onChange={(e) =>
                            this.setState({ searchTerm: e.target.value })
                        }
                    />

                    <Button type="submit" disabled={this.state.isSearching}>
                        {this.state.isSearching ? "Searching..." : "Search"}
                    </Button>

                    <Button variant="secondary" onClick={this.clearSearch}>
                        Clear
                    </Button>
                </Form>

                {/* 🎯 SHOW RESULT COUNT (optional but good) */}
                {this.state.searchResults !== null && (
                    <p className="ms-3">
                        Found {this.state.searchResults.length} result(s)
                    </p>
                )}

                {/* 🎬 MOVIE CAROUSEL */}
                <Carousel onSelect={this.handleSelect}>
                    {moviesToShow &&
                        moviesToShow.map((movie) => (
                            <Carousel.Item key={movie._id}>
                                <div>
                                    <LinkContainer
                                        to={'/movie/' + movie._id}
                                        onClick={() => this.handleClick(movie)}
                                    >
                                        <Nav.Link>
                                            <Image
                                                className="image"
                                                src={movie.imageUrl}
                                                thumbnail
                                            />
                                        </Nav.Link>
                                    </LinkContainer>
                                </div>

                                <Carousel.Caption>
                                    <h3>{movie.title}</h3>
                                    <BsStarFill />{" "}
                                    {movie.avgRating?.toFixed(1) || "No rating"}{" "}
                                    &nbsp;&nbsp; {movie.releaseDate}
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                </Carousel>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        movies: state.movie.movies
    };
};

export default connect(mapStateToProps)(MovieList);
