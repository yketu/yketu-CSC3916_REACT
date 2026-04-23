import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail";

function Movie(props) {
    const params = useParams();
    const movieId = params.movieId;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMovie(movieId));
    }, [dispatch, movieId]);

    return <MovieDetail movieId={movieId} />;
}

export default Movie;
