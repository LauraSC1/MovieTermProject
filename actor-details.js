$(document).ready(function() {
    const apiKey = '297c4fca07a88b481bdd80b35b50c8d9';
    const apiURL = 'https://api.themoviedb.org/3/';
    const imageBaseURL = 'https://image.tmdb.org/t/p/w500'; // Base URL for actor profile images

    // Function to fetch and display actor details
    function fetchActorDetails(actorId) {
        $.ajax({
            url: apiURL + `person/${actorId}`,
            method: 'GET',
            data: {
                api_key: apiKey
            },
            success: function(actorData) {
                let actorDetailsHTML = `
                    <div class="actor-profile">
                        <img src="${imageBaseURL}${actorData.profile_path}" alt="${actorData.name}" />
                        <div class="actor-info">
                            <h2>${actorData.name}</h2>
                            <p>Birthday: ${actorData.birthday}</p>
                            <p>Place of Birth: ${actorData.place_of_birth}</p>
                            <p>Biography: ${actorData.biography}</p>
                        </div>
                    </div>
                `;
                $('#actorDetails').html(actorDetailsHTML);
            },
            error: function(err) {
                console.error('Error fetching actor details:', err);
                $('#actorDetails').html('<div>Error fetching actor details. Please try again later.</div>');
            }
        });
    }

    // Extract actorId from URL query parameters
    function getActorIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Load actor details when the page is ready
    let actorId = getActorIdFromUrl();
    if (actorId) {
        fetchActorDetails(actorId);
    } else {
        $('#actorDetails').html('<div>No actor ID found in URL.</div>');
    }
});
