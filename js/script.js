let token = '';
$.ajax({
    url: 'https://accounts.spotify.com/api/token',
        type: 'post',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: $.param({
            'grant_type': 'client_credentials',
            'client_id': 'd6409319a2754191a82f9b977a701920',
            'client_secret': 'bbf768d5dcca49ed8aca46cc87ac0d5e'
        }),
        success: function(results){
            token = results.access_token;
        }
});

function ubahDurasi(data){
    let durationMs = data; // Durasi dalam milidetik

    let minutes = Math.floor(durationMs / 60000); // Konversi ke menit
    let seconds = ((durationMs % 60000) / 1000).toFixed(0); // Sisa detik

    // Format menjadi "menit:detik" (misal: "3:05")
    let formattedDuration = `${minutes}:${seconds.padStart(2, '0')}`;

    return formattedDuration;
};


function searchTrack() {
    $('#daftar-album').html('');
    let hasil = $('#search-input').val();

    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        type: 'get',
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            'q': hasil,
            'type': 'track',
            'limit': 6
        },
        success: function (result) {
            let tracks = result.tracks.items;
            console.log(tracks);

            if( tracks && tracks.length > 0) {
                let tracks = result.tracks.items;
                console.log("OK");
                console.log(tracks);
                $.each(tracks, function(i, data) {
                    $('#daftar-album').append(`
                        <div class="col-md-5">
                            <div class="card mb-3" style="max-width: 540px;">
                                <div class="row g-0">
                                    <div class="col-md-4">
                                    <img src="`+ data.album.images[0].url +`" class="img-fluid img-fill rounded-start" alt="...">
                                    </div>
                                    <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">`+ data.name +`</h5>
                                        <h6 class="card-title">`+ data.artists[0].name +`</h6>
                                        <p>`+ ubahDurasi(data.duration_ms) +`<p>
                                        <a href=`+ data.external_urls.spotify +` target="_blank"><button type="button" class="btn btn-outline-success">Putar di Spotify</button></a>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `)
                })
            $('#search-input').val('');

            } else {
                console.log("Gagal");
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    })
};


$('#search-button').on('click', function() {
    searchTrack();
});

$('#search-input').on('keyup', function(e) {
    if (e.which === 13){
        searchTrack();
    }
});