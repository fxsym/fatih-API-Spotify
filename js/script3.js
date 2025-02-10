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

function ubahFollowes(data){
    if (data >= 1000000) {
        return (data / 1000000).toFixed(1) + 'M';  // Format untuk juta
    } else if (data >= 1000) {
        return (data / 1000).toFixed(1) + 'k';  // Format untuk ribuan
    }
    return data;
}

function ubahGenre(data){
    let genre = data;
        genre = genre.map(g => 
            g.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        ).join(", ");
    return genre;
}


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
            'type': 'artist',
            'limit': 1
        },
        success: function (result) {
            let artists = result.artists.items;

            if( artists && artists.length > 0) {
                let artists = result.artists.items;
                console.log(artists);
                $.each(artists, function(i, data) {
                    $('#daftar-album').append(`
                        <div class="col-md-5">
                            <div class="card mb-3" style="max-width: 540px;">
                                <div class="row g-0 d-flex align-items-center"> <!-- Tambahkan d-flex align-items-center -->
                                    <div class="col-4">
                                        <img src="`+ data.images[0].url +`" class="img-fluid rounded-start" style="height: 100%; object-fit: cover;" alt="...">
                                    </div>
                                    <div class="col-8">
                                        <div class="card-body">
                                            <h5 class="card-title">`+ data.name +`</h5>
                                            <h6 class="card-title">`+ ubahFollowes(data.followers.total) +`</h6>
                                            <p>`+ ubahGenre(data.genres) +`</p>
                                            <a href="#" class="card-link lihat-lagu text-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="`+ data.name +`">Lihat Lagu</a>
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


$('.dropdown-item').on('click', function() {
    $('#daftar-album').html('');
    let kategori = $(this).html();
    
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        type: 'get',
        dataType: 'json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            'q': kategori,
            'type': 'artist',
            'limit': 8
        },
        success: function (result) {
            let artists = result.artists.items;

            if( artists && artists.length > 0) {
                let artists = result.artists.items;
                console.log(artists);
                $.each(artists, function(i, data) {
                    $('#daftar-album').append(`
                        <div class="col-md-5">
                            <div class="card mb-3" style="max-width: 540px;">
                                <div class="row g-0 d-flex align-items-center"> <!-- Tambahkan d-flex align-items-center -->
                                    <div class="col-4">
                                        <img src="`+ data.images[0].url +`" class="img-fluid rounded-start" style="height: 100%; object-fit: cover;" alt="...">
                                    </div>
                                    <div class="col-8">
                                        <div class="card-body">
                                            <h5 class="card-title">`+ data.name +`</h5>
                                            <h6 class="card-title">`+ ubahFollowes(data.followers.total) +`</h6>
                                            <p>`+ ubahGenre(data.genres) +`</p>
                                            <a href="#" class="card-link lihat-lagu text-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="`+ data.name +`">Lihat Lagu</a>
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
    });

    $.getJSON('../JSON/film2.json', function(data) {
        let film = data.movies;
        let content = '';

        $.each(film, function(i, data) {
            let genre = data.Genre;
            let genreArray = genre.split(", ");

            if (genreArray.includes(kategori)) {

            }
        });

        $('#daftar-film').html(content);
    });
});

$('#daftar-album').on('click', '.lihat-lagu', function() {
    $('#modal-boddy').html('');
    hasil = $(this).data('id');
    console.log(hasil);

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
            'limit': 8
        },
        success: function (result) {
            let tracks = result.tracks.items;
            console.log(tracks);

            if( tracks && tracks.length > 0) {
                let tracks = result.tracks.items;
                $.each(tracks, function(i, data) {
                    $('#modal-boddy').append(`
                        <div class="col-md-10 m-3">
                            <div class="card h-100 d-flex flex-row" style="max-width: 540px;">
                                <img src="`+ data.album.images[0].url +`" class="img-fluid rounded-start" style="width: 150px; height: 100%; object-fit: cover;" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">`+ data.name +`</h5>
                                    <h6 class="card-title">`+ data.artists[0].name +`</h6>
                                    <p>`+ ubahDurasi(data.duration_ms) +`</p>
                                    <a href="`+ data.external_urls.spotify +`" target="_blank">
                                        <button type="button" class="btn btn-outline-success">Putar di Spotify</button>
                                    </a>
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
});