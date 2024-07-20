$(document).ready(function() {
    const apiKey = '297c4fca07a88b481bdd80b35b50c8d9';
    const apiURL = 'https://api.themoviedb.org/3/';
    const imageBaseURL = 'https://image.tmdb.org/t/p/w500'; // Base URL for movie poster and actor profile images
    let currentPage = 1; // Initialize current page
    const resultsPerPage = 10; // Number of results per page

    // Initial search on page load
    $('#searchBtn').click(function() {
        currentPage = 1; // Reset current page on new search
        searchMovies();
    });

    // Update search on sort selection change
    $('#updateSearchBtn').click(function() {
        currentPage = 1; // Reset current page on new search
        searchMovies();
    });

    // Next page button click handler
    $('#nextBtn').click(function() {
        currentPage++;
        searchMovies();
    });

    // Previous page button click handler
    $('#prevBtn').click(function() {
        if (currentPage > 1) {
            currentPage--;
            searchMovies();
        }
    });

    // Function to search for movies based on user input, sort option, and pagination
    function searchMovies() {
        let query = $('#searchInput').val().trim();
        let sortOption = $('#sortSelect').val();
        let viewMode = $('input[name="viewMode"]:checked').val(); // Get current view mode (grid or list)

        if (query.length === 0) {
            alert('Please enter a movie title to search.');
            return;
        }

        $.ajax({
            url: apiURL + 'search/movie',
            method: 'GET',
            data: {
                api_key: apiKey,
                query: query,
                page: currentPage // Add current page to API request
            },
            success: function(data) {
                let sortedResults = sortMovies(data.results, sortOption);

                $('#movieResults').empty();

                if (sortedResults.length > 0) {
                    let startIndex = (currentPage - 1) * resultsPerPage;
                    let endIndex = startIndex + resultsPerPage;
                    let paginatedResults = sortedResults.slice(startIndex, endIndex);

                    paginatedResults.forEach(movie => {
                        let posterURL = movie.poster_path ? imageBaseURL + movie.poster_path : 'no-image.jpg';

                        if (viewMode === 'grid') {
                            $('#movieResults').append(`
                                <div class="movie-grid">
                                    <a href="movie-details.html?id=${movie.id}" class="movie-title">${movie.title}</a>
                                    <img src="${posterURL}" alt="${movie.title}" />
                                </div>
                            `);
                        } else if (viewMode === 'list') {
                            fetchMovieDetails(movie, posterURL);
                        }
                    });

                    updatePaginationUI(data.total_pages); // Update pagination buttons and page count
                } else {
                    $('#movieResults').append(`<div>No results found.</div>`);
                    updatePaginationUI(0); // Reset pagination UI if no results
                }
            },
            error: function(err) {
                console.error('Error searching movies:', err);
                $('#movieResults').append(`<div>Error searching movies. Please try again later.</div>`);
                updatePaginationUI(0); // Reset pagination UI on error
            }
        });
    }

    // Function to update pagination UI (enable/disable buttons and display current page)
    function updatePaginationUI(totalPages) {
        $('#pageCount').text(`Page ${currentPage}`);

        if (currentPage === 1) {
            $('#prevBtn').prop('disabled', true);
        } else {
            $('#prevBtn').prop('disabled', false);
        }

        if (currentPage === totalPages || totalPages === 0) {
            $('#nextBtn').prop('disabled', true);
        } else {
            $('#nextBtn').prop('disabled', false);
        }
    }

    // Function to sort movies based on the selected sort option
    function sortMovies(movies, sortOption) {
        switch (sortOption) {
            case 'title.asc':
                return movies.sort((a, b) => a.title.localeCompare(b.title));
            case 'title.desc':
                return movies.sort((a, b) => b.title.localeCompare(a.title));
            case 'release_date.asc':
                return movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            case 'release_date.desc':
                return movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            case 'vote_average.desc':
                return movies.sort((a, b) => b.vote_average - a.vote_average);
            default:
                return movies; // Default to no sorting
        }
    }

    // Function to fetch movie details and append to #movieResults in list view
    function fetchMovieDetails(movie, posterURL) {
        $.ajax({
            url: apiURL + `movie/${movie.id}/credits`,
            method: 'GET',
            data: {
                api_key: apiKey
            },
            success: function(castData) {
                let actors = castData.cast.slice(0, 3);
                let actorsHTML = actors.map(actor => `
                    <div class="actor-name" data-actor-id="${actor.id}">
                        <a href="actor-details.html?id=${actor.id}" class="actor-link">${actor.name}</a>
                    </div>
                `).join('');

                $('#movieResults').append(`
                    <div class="movie-list">
                        <div class="movie-details">
                            <div class="title">${movie.title}</div>
                            <div class="overview">${movie.overview}</div>
                            <div class="release-date">Released: ${movie.release_date}</div>
                            <div class="actors">${actorsHTML}</div>
                        </div>
                        <img src="${posterURL}" alt="${movie.title}" />
                    </div>
                `);
            },
            error: function(err) {
                console.error('Error fetching cast:', err);
                $('#movieResults').append(`
                    <div class="movie-list">
                        <div class="movie-details">
                            <div class="title">${movie.title}</div>
                            <div class="overview">${movie.overview}</div>
                            <div class="release-date">Released: ${movie.release_date}</div>
                            <div class="actors">Actors: Not available</div>
                        </div>
                        <img src="${posterURL}" alt="${movie.title}" />
                    </div>
                `);
            }
        });
    }

    // Event handler for view mode toggle (grid or list)
    $('input[name="viewMode"]').change(function() {
        searchMovies(); // Trigger search again when view mode changes
    });

    // Event delegation for actor links in list view mode
    $('#movieResults').on('click', '.actor-link', function(event) {
        event.preventDefault();
        let actorId = $(this).closest('.actor-name').data('actor-id');
        window.location.href = `actor-details.html?id=${actorId}`;
    });

    // Function to calculate age based on birthdate
    function calculateAge(birthdate) {
        if (!birthdate) return 'Unknown';
        let today = new Date();
        let birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Fetch top 5 popular movies on page load
    fetchTop5PopularMovies();

    function fetchTop5PopularMovies() {
        $.ajax({
            url: apiURL + 'movie/popular',
            method: 'GET',
            data: {
                api_key: apiKey,
                page: 1
            },
            success: function(data) {
                displayTop5PopularMovies(data.results);
            },
            error: function(err) {
                console.error('Error fetching top 5 popular movies:', err);
            }
        });
    }

    function displayTop5PopularMovies(movies) {
        // Clear any existing content
        $('#topMovies').empty();

        // Add a big header for top 5 most popular movies
        $('#topMovies').append('<h2>Top 5 Most Popular Movies</h2>');

        // Display each movie as grid
        movies.slice(0, 5).forEach(movie => {
            let posterURL = movie.poster_path ? imageBaseURL + movie.poster_path : 'no-image.jpg';
            $('#topMovies').append(`
                <div class="movie-grid">
                    <a href="movie-details.html?id=${movie.id}" class="movie-title">${movie.title}</a>
                    <img src="${posterURL}" alt="${movie.title}" />
                </div>
            `);
        });
    }
});
