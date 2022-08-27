import React, { useEffect} from 'react';
import './App.css';
import Login from './Login';
import Player from './Player';
import { getTokenFromResponse } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import { useDataLayerValue } from './DataLayer';


const spotify = new SpotifyWebApi();

function App() {
const [{ user, token }, dispatch] = useDataLayerValue();

useEffect(() => {
  // Set token
  const hash = getTokenFromResponse();
  window.location.hash = "";
  let _token = hash.access_token;

  if (_token) {
    spotify.setAccessToken(_token);

    dispatch({
      type: "SET_TOKEN",
      token: _token,
    });

    spotify.getPlaylist("37i9dQZEVXcGRGF60kspdA").then((response) =>
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: response,
      })
    );

    spotify.getMyTopArtists().then((response) =>
      dispatch({
        type: "SET_TOP_ARTISTS",
        top_artists: response,
      })
    );

    dispatch({
      type: "SET_SPOTIFY",
      spotify: spotify,
    });

    spotify.getMe().then((user) => {
      dispatch({
        type: "SET_USER",
        user : user,
      });
    });

    spotify.getUserPlaylists().then((playlists) => {
      dispatch({
        type: "SET_PLAYLISTS",
        playlists : playlists,
      });
    });
  }
}, [token, dispatch]);

return (
  <div className="app">
    {!token && <Login />}
    {token && <Player spotify={spotify} />}
  </div>
);
}

export default App;