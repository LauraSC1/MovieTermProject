$(document).ready(function() {
    // API URL and key
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = 'https://api.themoviedb.org/3/';

    // Function to fetch top 5 movies and populate grid
    function fetchTopMovies() {
        $.ajax({
            url: apiUrl + 'movie/popular',
            method: 'GET',
            data: {
                api_key: apiKey,
                page: 1
            },
            success: function(data) {
                // Process data and populate top movies grid
                // Example: 
                // data.results.forEach(movie => {
                //     $('.top-movies').append(`<div class="movie">${movie.title}</div>`);
                // });
            },
            error: function(err) {
                console.error('Error fetching top movies:', err);
            }
        });
    }

    // Fetch top movies on page load
    fetchTopMovies();

    // Function to handle movie search
    $('#searchBtn').click(function() {
        let query = $('#searchInput').val();
        let genreId = $('#genreSelect').val();
        let sortBy = $('#sortSelect').val();

        // Make API call to search movies
        $.ajax({
            url: apiUrl + 'search/movie',
            method: 'GET',
            data: {
                api_key: apiKey,
                query: query,
                with_genres: genreId,
                sort_by: sortBy
            },
            success: function(data) {
                // Process search results and display
                // Example:
                // $('#movieResults').empty();
                // data.results.forEach(movie => {
                //     $('#movieResults').append(`<div class="movie">${movie.title}</div>`);
                // });
            },
            error: function(err) {
                console.error('Error searching movies:', err);
            }
        });
    });

    // Additional event handlers and functions for detailed view, cast details, etc.
});
