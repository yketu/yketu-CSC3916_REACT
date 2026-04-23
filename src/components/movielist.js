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

    handleSelect(selectedIndex, e) {
        const { dispatch } = this.props;

        const list =
            this.state.searchResults !== null
                ? this.state.searchResults
                : this.props.movies;

        if (list && list[selectedIndex]) {
            dispatch(setMovie(list[selectedIndex]));
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
            const res = await fetch(
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

            const data = await res.json();

            if (res.ok) {
                this.setState({ searchResults: data });
            }

        } catch (err) {
            console.error(err);
        }

        this.setState({ isSearching: false });
    };

    clearSearch = () => {
        this.setState({
            searchTerm: '',
            searchResults: null,
            isSearching: false
        });

        this.props.dispatch(fetchMovies());
    };

    render() {
        const movieList =
            this.state.searchResults !== null
                ? this.state.searchResults
                : this.props.movies;

        return (
            <div>

                {/* SEARCH */}
                <Form onSubmit={this.handleSearch} className="d-flex m-3">
                    <Form.Control
                        placeholder="Search movies or actors..."
                        value={this.state.searchTerm}
                        onChange={(e) =>
                            this.setState({ searchTerm: e.target.value })
                        }
                    />

                    <Button type="submit" disabled={this.state.isSearching}>
                        Search
                    </Button>

                    <Button variant="secondary" onClick={this.clearSearch}>
                        Clear
                    </Button>
                </Form>

                {/* COUNT */}
                {this.state.searchResults !== null && (
                    <p className="ms-3">
                        Found {this.state.searchResults.length} result(s)
                    </p>
                )}

                {/* ORIGINAL CAROUSEL (PRESERVED STRUCTURE) */}
                <Carousel onSelect={this.handleSelect}>
                    {movieList &&
                        movieList.map((movie) => (
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

                                    {/* hide rating only in search */}
                                    {this.state.searchResults === null &&
                                        movie.avgRating != null && (
                                            <span>
                                                <BsStarFill /> {movie.avgRating.toFixed(1)} &nbsp;&nbsp;
                                            </span>
                                        )}

                                    {movie.releaseDate}
                                </Carousel.Caption>

                            </Carousel.Item>
                        ))}
                </Carousel>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    movies: state.movie.movies
});

export default connect(mapStateToProps)(MovieList);
