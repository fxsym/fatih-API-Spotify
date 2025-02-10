$('#search-button').on('click', function() {
    hasil = $('#search-input').val();
    console.log(hasil);


    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        type: 'get',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer BQBKcdTVkhV8-GVHWpKv2tLiFJBj3cqTf5oxxWnWvLP2qZigvuyH_WF7I_Skg7AyAczd4zSWxObJW__k3m-GXCm_bz0aKaz3_JREMutwFRZaIyNS1Rf1yBNOOSLK1owY48ta-JBZ3YQ'
        },
        data: {
            'q': hasil,
            'type': 'artist',
            'limit': 1
        },
        success: function (result) {
            let artistId = result.artists.items[0].id; // Ambil ID artis
            console.log("Artist ID:", artistId);
            
            // Setelah dapat ID, cari album berdasarkan ID artis
            cariAlbum(artistId);
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    })

    function cariAlbum(artistId) {
        $.ajax({
            url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer BQBKcdTVkhV8-GVHWpKv2tLiFJBj3cqTf5oxxWnWvLP2qZigvuyH_WF7I_Skg7AyAczd4zSWxObJW__k3m-GXCm_bz0aKaz3_JREMutwFRZaIyNS1Rf1yBNOOSLK1owY48ta-JBZ3YQ'
            },
            data: {
                'include_groups': 'album', // Bisa diganti 'single' kalau mau cari single
                'limit': 10 // Batas jumlah album
            },
            success: function (result) {
                console.log("Album List:", result);
            },
            error: function (xhr, status, error) {
                console.error('Error:', xhr.responseText);
            }
        });
    }    

});