console.log('Ok!');
let token = '';
async function getSpotifyToken() {
    const clientId = 'd6409319a2754191a82f9b977a701920';
    const clientSecret = 'bbf768d5dcca49ed8aca46cc87ac0d5e';

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': clientId,
            'client_secret': clientSecret
        })
    });

    if (response.ok) {
        const results = await response.json();
        token = results.access_token;
    } else {
        console.error('Gagal mendapatkan token:', response.statusText);
    }
}
getSpotifyToken();

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

function getApi(q, type, limit){
    return fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&limit=${encodeURIComponent(limit)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => response);
};

const searchButton = document.getElementById('search-button');
const inputKeyword = document.getElementById('search-input');

searchButton.addEventListener('click', function () {
    getArtist(inputKeyword.value, 1);
});

inputKeyword.addEventListener('keyup', function(e) {
    if (e.key === 'Enter'){
            getArtist(inputKeyword.value, 1);
        }
});

async function getArtist(keyword, limit=1) {
    const response = await getApi(keyword, 'artist', limit);
    const artist = response.artists.items;
    updateArtist(artist);
}

function updateArtist(artists) {
    const daftarArtists = document.getElementById('list-artists');
    daftarArtists.innerHTML = '';
    artists.forEach(function(data, i) {
        daftarArtists.innerHTML += `
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
            `;
    });
    document.getElementById('search-input').value = '';
};

function updateSongs(songs) {
    const daftarsongs = document.getElementById('modal-boddy');
    daftarsongs.innerHTML = '';
    songs.forEach(function(data, i) {
    daftarsongs.innerHTML += `
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
        `;
    });
};

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('card-link')) {
        const artistName = e.target.dataset.id;
        const response = await getApi(artistName, 'track', 8);
        const songs = response.tracks.items;
        updateSongs(songs);
    }
});

const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(btn => {
    btn.addEventListener('click', function() {
        const genreText = btn.innerText;
        getArtist(genreText, 8);
    })
});
