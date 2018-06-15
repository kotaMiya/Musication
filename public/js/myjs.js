function searchArtist() {
    var artistName = document.getElementById("artist").value;

    if (artistName === "") {
        window.alert("Please enter an artist name");
    } else {
        window.location.href = location.protocol + "//" + location.hostname + ":" + location.port + "/search/" + artistName;
    }

}

var map;
var addresses = [
    'Brisbane',
    'Kobe',
    'Hawaii',
    'canada'
];

var marker = [];

function initMap() {
    var geocoder = new google.maps.Geocoder();

    var location_name = [];

    var location_length = document.getElementsByTagName('input').length;

    for (var i = 0; i < location_length; i++) {
        if (document.getElementById('location' + i).value !== null) {
            location_name[i] = document.getElementById('location' + i).value;
        }
    }

    geocoder.geocode({'address': 'Brisbane'}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            console.group('Success');
            console.log(results[1]);
            console.log(status);

            map = new google.maps.Map(document.getElementById('sample'), {
                center: results[0].geometry.location,
                zoom: 1
            });
        } else {
            console.group('Error');
            console.log(results);
            console.log(status);
            alert(status);
        }
    });

    for (var i = 0; i < location_name.length; i++) {
        geocoder.geocode({'address': location_name[i]}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                console.group('Success');
                console.log(results[1]);
                console.log(status);
                marker[i] += new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                });
            } else {
                console.group('Error');
                console.log(results);
                console.log(status);
                alert(status);
            }
        });
    }
}






