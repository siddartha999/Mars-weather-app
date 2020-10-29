import { useEffect, useState } from 'react';
import './App.css';
import Switch from '@material-ui/core/Switch';

const MARS_WEATHER_API = "https://api.nasa.gov/insight_weather/?api_key=X2PStRUu074qO3nryemPnAZ2h4ehVyGzi6yv8rKs&feedtype=json&ver=1.0"; 
const TEMPERATURE_UNIT = {
  CELCIUS : "°C",
  FAHRENHEIT: "°F"
};

function App() {
  const [data, setData] = useState([]);
  const [temperatureUnit, setTemperatureUnit] = useState(TEMPERATURE_UNIT.CELCIUS);
  //Load the data from NASA API.
  useEffect(() => {
    fetch(MARS_WEATHER_API)
    .then(res => res.json())
    .then(data => {
      const {sol_keys, validity_checks, ...solData} = data;
      //Retrieve the info in the desired format.
      const temp = Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: (data.AT)?.mx,
          minTemp: (data.AT)?.mn,
          date: new Date(data.First_UTC)
        }
      });
      setData(temp);
    });
  }, []);

  /**
   * Function to format the date.
   */
  const formatDate = (date) => {
    if(date instanceof Date) {
      return new Intl.DateTimeFormat("en-GB", {
        month: "short",
        day: "2-digit"
      }).format(date)
    }
  };

  /**
   * Function to format the temperature.
   */
  const formatTemperature = (temperature) => {
    if(temperatureUnit === TEMPERATURE_UNIT.FAHRENHEIT) {
      temperature = temperature * 1.8 + 32;
    }
    return Math.round(temperature);
  };

  /**
   * Handler to handle the temperature unit toggle between Celcius and Fahrenheit.
   */
  const handleTemperatureUnitToggle = () => {
      if(temperatureUnit === TEMPERATURE_UNIT.CELCIUS) {
        setTemperatureUnit(TEMPERATURE_UNIT.FAHRENHEIT);
      }
      else {
        setTemperatureUnit(TEMPERATURE_UNIT.CELCIUS);
      }
  };

  return (
    <div className="App">
      <div className="App-bg-img"></div>
      <div className="App-info-panel">
        <div className="App-info-panel-header">
          <div className="App-info-panel-main-header">
              Latest Weather at Elysium Planitia
            </div>
            <div className="App-info-panel-sub-header">
                InSight is taking daily weather measurements (temperature, wind, pressure) on the surface 
                of Mars at Elysium Planitia, a flat, smooth plain near Mars’ equator.
            </div>
            <div className="App-temperature-unit-toggle-wrapper">
              <p>{TEMPERATURE_UNIT.CELCIUS}</p>
              <Switch
                checked={temperatureUnit === TEMPERATURE_UNIT.FAHRENHEIT ? true : false}
                onChange={handleTemperatureUnitToggle}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <p>{TEMPERATURE_UNIT.FAHRENHEIT}</p>
            </div>
        </div>
        <div className="App-info-panel-content">
          <div className="App-info-panel-current-day-content">
              <div>
                  <p className="Sol">SOL {data.length ? data[data.length - 1].sol : ""}</p>
                  <p>{data.length ? formatDate(data[data.length - 1].date) : ""}</p>
              </div>
              <div>
                  <p>High: {data.length ? formatTemperature(data[data.length - 1].maxTemp) + " " + temperatureUnit : ""}</p>
                  <p>Low: {data.length ? formatTemperature(data[data.length - 1].minTemp) + " " + temperatureUnit : ""}</p>
              </div>
          </div>
          <div className="App-info-panel-previous-days-content">
              {data.map(obj => 
                  <div className="App-info-panel-info-box" key={obj.sol}>
                      <div className="App-info-panel-info-box-top-content">
                          <p className="Sol">SOL {obj.sol}</p>
                          <p style={{fontWeight: "bolder", color: "floralwhite"}}>{formatDate(obj.date)}</p>
                      </div>
                      <div className="App-info-panel-info-box-bottom-content">
                          <p className="App-info-box-temp">High: {formatTemperature(obj.maxTemp) + " " + temperatureUnit}</p>
                          <p className="App-info-box-temp">Low: {formatTemperature(obj.minTemp) + " " + temperatureUnit}</p>
                      </div>
                  </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
