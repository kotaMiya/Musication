var https = require('https');
var express = require('express');
var app = express();
const hostname = '127.0.0.1';
const port = 3000;




// Spotify API
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : 'f276c2bb1e9942b79907de2e43095722',
    clientSecret : 'aef45086f56347a8b9a4c957b500b578',
    redirectUri : 'http://www.example.com/callback'
});

spotifyApi.setAccessToken('BQD-EpRdanhqPzzLnDdW6Q5AQ4uaTxYn5f-k2PfH3kPneJsyfaVh4bD_9V0ZYx0EJn2xBaN8ebmwqEyKkV13HwCfH-6mpLBABEkZ3bNcrxZlJVAqRGdZ5mLmFho-_azK5gGsKKVcU_9hE5bE4T_H7VpNRyvEJP6yY3afjHLaPJmNFnv2F5Q&refresh_token=AQDNXEcJkb5MkkuevMkQdx20AovCP8g0AqLnxnvCQGx4nhXsksfk1CD-MNbmNPrnWjtuHdVap0T6-brJgcep3nuvbGDwhFNBB9-t-oVDgiN0CshY_4H_s0LSP2BzoEjExPo');

// Set an access token.
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
    });


// Twitter API
var twit = require('twit');
var tw = new twit({
    consumer_key: 'eEICXPXVbzaIF7B1BI6tg5KsL',
    consumer_secret: 'dvWEhnetHOw8huZHdwQD0kzXiuGiDX2YgRZagO0jsPCZFRThzM',
    access_token: '391443422-8ZIdgYwaSZ9Z87QVCvALpHQ5816QdsU5iMjjhBBY',
    access_token_secret:'6KIdOhGTzAVkKeeNEyogdFxCICYEMsBpQVDT8EZiCvdU6'
});


app.use(express.static((__dirname, 'public')));

app.get('/', function (req, res) {

    var header = '<!DOCTYPE html>' +
        '<html>' +
        '<head><title>Musication</title><meta charset="utf-8">' +
        '<title>Musication</title>' +
        '<script src="/js/myjs.js" type="text/javascript"></script>' +
        '<link rel="stylesheet" type="text/css" href="/css/mycss.css">' +
        '</head>';

    var body = '<body><div class="container"><div class="top-content">' +
               '<h1>Musication</h1>' +
               '<h3>Meet awesome music♪</h3>' +
               '<input class="search-box" id="artist" type="text" placeholder="Search for an artist" name="artistName">' +
               '<button class="search-box" onclick="searchArtist();">Go</button>' +
               '</div>';



    var footer = '<footer><h5>By Kota Miyamoto, n9567496</h5></footer></div></body></html>';

    var all = header + body + footer;

    res.writeHead(200,{'content-type': 'text/html'});
    res.write(all);
    res.end();
});


var artistID = [];
var artist_name = "";
var image = "";

app.get('/search/:artistName', function (req, res) {

    var getArtistName = req.params.artistName;

    spotifyApi.searchArtists(getArtistName)
        .then(function(data) {

            var header = '<!DOCTYPE html>' +
                '<html>' +
                '<head><title>Musication</title><meta charset="utf-8">' +
                '<title>Musication</title>' +
                '<script src="/js/myjs.js" type="text/javascript"></script>' +
                '<link rel="stylesheet" type="text/css" href="/css/mycss.css">' +
                '</head>';

            var body = '<body><div class="container"><div class="main">' +
                       '<h1><a href="/">Musication</a></h1>' +
                       '<h2 class="artist-result">Result</h2>';

            var footer = '<footer><h5>By Kota Miyamoto, n9567496</h5></footer></div></body></html>';

            var all;
            var f_start = '';
            var listOfArtists = "";
            artistID = [];
            var path = req.protocol + '://' + req.headers.host + req.url + '/track';

            if (data.body.artists.items.length === 0) {
                var message = "There is no artists";
                all = header + body  + message + footer;
            } else {
                for (var i = 0; i < data.body.artists.items.length; i++) {
                    artist_name = data.body.artists.items[i].name;
                    artistID.push(data.body.artists.items[i].id);
                    if (data.body.artists.items[i].images[2] !== undefined) {
                        image = data.body.artists.items[i].images[2].url;
                    } else {
                        image = '/images/artwork.jpg';
                    }

                    f_start = '<form name="form1" method="post" action="' + path + '/' + artistID[i] + '">';

                    listOfArtists += '<div class="artist-data">' +
                                     '<img class="artwork" src="' + image + '">' +
                                     '<input type="hidden" name="artistID" value="' + artistID[i] + '">' +
                                     '<a class="artistName" href="' + path + '/' + artistID[i] + '">' + artist_name  + '</a><br>' +
                                     '</form></div>';
                }

                listOfArtists += '</div>';

                all = header + body + f_start + listOfArtists + footer;
            }

            res.writeHead(200,{'content-type': 'text/html'});
            res.write(all);
            res.end();
        }, function(err) {
            console.error(err);
        });
});

var test = "this is the test";


app.get('/search/:artistName/track/:aritstID', function(req, res) {

    var whole_url = req.url;
    var current_artist_id = whole_url.split('/');
    var current_artist_name = "";
    var current_artist_image = "";
    var spotify_url = "";

    spotifyApi.getArtist(current_artist_id[4])
        .then(function(data) {
            current_artist_name = data.body.name;
            current_artist_image = data.body.images[2].url;
            spotify_url = data.body.external_urls.spotify;
        }, function(err) {
            console.error(err);
        });


    spotifyApi.getArtistTopTracks(current_artist_id[4], 'GB')
        .then(function(data) {

            var header = '<!DOCTYPE html>' +
                '<html>' +
                '<head><title>Musication</title><meta charset="utf-8">' +
                '<title>Musication</title>' +
                '<script src="/js/myjs.js" type="text/javascript"></script>' +
                // '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBCV9AOJ7QFMIm7yzlgHsYR9vRXmPKrMAA&callback=initMap"></script>' +
                '<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyBCV9AOJ7QFMIm7yzlgHsYR9vRXmPKrMAA"></script>' +
                '<link rel="stylesheet" type="text/css" href="/css/mycss.css">' +
                '</head>';



            var body = '<body onload="initMap()"><div class="container"><div class="main">' +
                       '<h1><a href="/">Musication</a></h1>' +
                       '<div class="individual-page">' +
                       '<h1>Top 10 tracks</h1>' +
                       '<h2><a href="' + spotify_url + '">' + current_artist_name + '</a></h2>' +
                       '<img class="artwork" src="' + current_artist_image + '"></div>';

            var footer = '<footer><h5>By Kota Miyamoto, n9567496</h5></footer></div></body></html>';

            var testMap = '<div id="sample"></div>';



            var tracks = "<div class='chunk-tracks'>";


            if (data.body.tracks.length > 10) {
                for (var i = 0; i < 10; i++) {
                    if (data.body.tracks[i].preview_url === null) {
                        tracks += data.body.tracks[i].name + '<br>';
                    } else {
                        tracks += '<a href="' + data.body.tracks[i].preview_url + '">' + data.body.tracks[i].name + '</a>';
                        tracks += '<br>';
                    }
                }
            } else {
                for (var i = 0; i < data.body.tracks.length; i++) {
                    if (data.body.tracks[i].preview_url === null) {
                        tracks += data.body.tracks[i].name + '<br>';
                    } else {
                        tracks += '<a href="' + data.body.tracks[i].preview_url + '">' + data.body.tracks[i].name + '</a>';
                        tracks += '<br>';
                    }
                }
            }

            tracks += '</div>';

            var tweets = "<div class='chunk-tweets'><ul>";

            var twitter_location = [];

            tw.get('search/tweets', { q: '#nowPlaying ' + current_artist_name, count: 30 },
                function(err, data, response) {

                    var c = 0;

                    for (var i = 0; i < data.statuses.length; i++) {
                        if (data.statuses[i].text !== undefined) {
                            tweets += '<li><img src="' + data.statuses[i].user.profile_image_url + '">' +
                                      '<h4>' + data.statuses[i].user.name + '</h4>' +
                                      '<h3>' + data.statuses[i].text + '</h3>' +
                                      '<p>' + data.statuses[i].created_at + '</p></li>';

                            if (data.statuses[i].place !== null) {
                                twitter_location[c] = '<input type="hidden" id=location' + c + ' value="' + data.statuses[i].place.full_name + '">';
                                c++;
                            }

                        }
                    }

                    tweets += '</ul></div></div>';


                    var all = header + body + tracks + testMap + tweets + twitter_location + footer;

                    res.writeHead(200,{'content-type': 'text/html'});
                    res.write(all);
                    res.end();
                }
            );


        }, function(err) {
            console.log('Something went wrong!', err);
        });
});


app.listen(port, function () {
    console.log('Express app listening at http://' + hostname + ':' + port + '/');
});
