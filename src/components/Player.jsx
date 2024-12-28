import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Player.css';

const Player = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentItem, setCurrentItem] = useState(''); // Stores track or album ID
  const [isAlbum, setIsAlbum] = useState(false); // To track if current item is an album
  const [albumTracks, setAlbumTracks] = useState([]); // Tracks of the current album
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track'); // 'track' or 'album'

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tokenFromHash = hash
        .substring(1)
        .split('&')
        .find(param => param.startsWith('access_token'))
        ?.split('=')[1];
      setToken(tokenFromHash);
    } else {
      console.error('URL hash is empty');
    }
  }, []);

  // Fetch user's tracks or albums based on search type
  const searchSpotify = () => {
    if (!token) {
      console.error('Access token is missing');
      setLoading(false); // Reset loading if no token
      return;
    }
  
    const endpoint = searchType === 'track'
      ? `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`
      : `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`;
  
    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        if (searchType === 'track') {
          setTracks(response.data.tracks.items);
          setAlbums([]);
        } else {
          setAlbums(response.data.albums.items);
          setTracks([]); // Clear tracks if switching to albums
        }
      })
      .catch(error => {
        console.error(`Error fetching ${searchType}s:`, error);
      })
      .finally(() => {
        setLoading(false); // Always reset loading
      });
  };
  

  const handleOnTrackClick = (track) => {
    setCurrentItem(track.id);
    setIsAlbum(false);
  };

  const handleOnAlbumClick = (album) => {
    setCurrentItem(album.id);
    setIsAlbum(true);
    fetchAlbumTracks(album.id); // Fetch tracks of the clicked album
  };

  const fetchAlbumTracks = (albumId) => {
    axios
      .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setAlbumTracks(response.data.items);
      })
      .catch(error => {
        console.error('Error fetching album tracks:', error);
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter a search query.");
      return;
    }
    setLoading(true);
    searchSpotify();
  };
  

  return (
    <div className='music-app'>
      <h1 className='header'>My Music Player</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name='search-query'
          placeholder='Search ...'
          className="searchbox"
          onChange={handleChange}
        />
        <select className="search-type" onChange={handleSearchTypeChange}>
          <option value="track">Tracks</option>
          <option value="album">Albums</option>
        </select>
        <button type='submit'>{loading ? 'Loading...' : 'Search' }</button>
      </form>

  
  <div className="player">

      <div className="results-container">
        {tracks.length > 0 && (
          <div className='track-list'>
            <h2>Tracks</h2>
            {tracks.map(track => (
              <div key={track.id} className='track-item' onClick={() => handleOnTrackClick(track)} style={{ cursor: 'pointer' }}>
                <img
                  className='track-image'
                  src={track.album.images[2]?.url || ''}
                  alt={track.name}
                />
                <div className="about-track">
                  <p>{track.name}</p>
                  <span>by {track.artists[0].name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {albums.length > 0 && (
          <div className='album-list'>
            <h2>Albums</h2>
            {albums.map(album => (
              <div key={album.id} className='album-item' onClick={() => handleOnAlbumClick(album)}>
                <img
                  className='album-image'
                  src={album.images[1]?.url || ''}
                  alt={album.name}
                />
                <div className="about-album">
                  <p>{album.name}</p>
                  <span>by {album.artists[0].name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentItem && (
        <iframe
          className='music-player'
          src={`https://open.spotify.com/embed/${isAlbum ? 'album' : 'track'}/${currentItem}`}
          width="700"
          height="600"
          allow="encrypted-media"
          title="Music Player"
        ></iframe>
      )}
    </div>
  </div>
  );
};

export default Player;

