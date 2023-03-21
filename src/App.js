import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const apiKey = process.env.REACT_APP_WEATHER_API;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}`;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      axios.get(url)
        .then((response) => {
          // Handle successful response
          console.log(response.data);
          setData(response.data);

        })
        .catch((error) => {
          // Handle error
          console.log(error);
        });
    }
  }, [latitude, longitude]);


  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(searchUrl)
        .then((response) => {
          // Handle successful response
          console.log(response.data);
          setData(response.data);

        })
        .catch((error) => {
          // Handle error
          console.log(error);
        });
      setSearchInput("");
    }
  };

  if (longitude) {
    if (data) {
      return (
        <div className='App'>
          <div className='search'>
            <input
              type="text"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="Search city"
            />
          </div>
          <div className='container'>
            <div className='top'>
              <div className='location'>
                <p>{data.name}</p>
              </div>
              <div className='temp'>
                {data.main ? <h1>{data.main.temp}°F</h1> : null}
              </div>
              <div className='description'>
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>


            {data.name !== undefined &&
              <div className='bottom'>
                <div className='feels'>
                  {data.main ? <p className='bold'>{data.main.feels_like}°F</p> : null}
                  <p>Feels Like</p>
                </div>
                <div className='humidity'>
                  {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                  <p>Humidity</p>
                </div>
                <div className='wind'>
                  {data.wind ? <p className='bold'>{data.wind.speed} MPH</p> : null}
                  <p>Wind Speed</p>
                </div>
              </div>
            }


          </div>
        </div>

      );
    } else {
      return (
        <div className='App'>
          <div className='container'>
            <div className='fetching'>
              <h3>Error</h3>
              <p>Cannot read the state data</p>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className='App'>
        <div className='container'>
          <div className='fetching'>
            <h3>Fetching your location</h3>
            <p>Please allow permision to access your location to display the weather of your location</p>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
