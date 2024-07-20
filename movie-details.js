$(document).ready(function() {
    const apiKey = '297c4fca07a88b481bdd80b35b50c8d9';
    const apiURL = 'https://api.themoviedb.org/3/';
    const imageBaseURL = 'https://image.tmdb.org/t/p/w500'; // Base URL for images

    // Function to fetch and display movie details
    function fetchMovieDetails(movieId) {
        $.ajax({
            url: apiURL + `movie/${movieId}`,
            method: 'GET',
            data: {
                api_key: apiKey
            },
            success: function(movieData) {
                let movieDetailsHTML = `
                    <div class="movie-details-container">
                        <img src="${imageBaseURL}${movieData.poster_path}" alt="${movieData.title}" />
                        <div class="movie-info">
                            <h2>${movieData.title}</h2>
                            <p><strong>Release Date:</strong> ${movieData.release_date}</p>
                            <p><strong>Rating:</strong> ${movieData.vote_average}</p>
                            <p><strong>Overview:</strong> ${movieData.overview}</p>
                        </div>
                    </div>
                `;
                $('#movieDetails').append(movieDetailsHTML);

                // Fetch and display actors for the movie
                fetchActorsForMovie(movieId);
            },
            error: function(err) {
                console.error('Error fetching movie details:', err);
                $('#movieDetails').html('<div>Error fetching movie details. Please try again later.</div>');
            }
        });
    }

    // Function to fetch and display actors for the movie
    function fetchActorsForMovie(movieId) {
        $.ajax({
            url: apiURL + `movie/${movieId}/credits`,
            method: 'GET',
            data: {
                api_key: apiKey
            },
            success: function(castData) {
                let actorsHTML = `
                    <div class="actors-container">
                        <h3>Actors:</h3>
                        <ul class="actor-list">
                `;
                castData.cast.slice(0, 5).forEach(actor => {
                    // Create a link to actor details page with actor ID as query parameter
                    actorsHTML += `
                        <li>
                            <img src="${imageBaseURL}${actor.profile_path}" alt="${actor.name}" />
                            <div>
                                <h4><a href="actor-details.html?id=${actor.id}" class="actor-link">${actor.name}</a></h4>
                                <p><strong>Character:</strong> ${actor.character}</p>
                            </div>
                        </li>
                    `;
                });
                actorsHTML += `</ul></div>`;
                $('#movieDetails').append(actorsHTML);
            },
            error: function(err) {
                console.error('Error fetching cast details:', err);
                $('#movieDetails').append('<div>Error fetching cast details. Please try again later.</div>');
            }
        });
    }

    // Extract movieId from URL query parameters
    function getMovieIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Load movie details when the page is ready
    let movieId = getMovieIdFromUrl();
    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        $('#movieDetails').html('<div>No movie ID found in URL.</div>');
    }
});
