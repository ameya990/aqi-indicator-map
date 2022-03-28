import React, { useRef, useEffect } from 'react';
import './App.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1leWEyMDE1IiwiYSI6ImNreGtzdndsdjM2ZTIycHBnNGpmNW01MzEifQ.KMLgSeKJMzdyHMFdpOPXbQ';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const apiData =  useRef(null);
  const dummyRef = useRef(null);
  let timedAPIPolling;  

  // function for getting the data for individual stations in the given geographical bounds for the current date   
  function getStationData() {
    console.log(++dummyRef.current); //console log to verify auto refresh functionality every 10 seconds
    const today = new Date().toISOString().substring(0, 10);
  
    for (let sta of apiData.current) {       
      const lat = (sta.lat).toString();
      const lon = (sta.lon).toString();
      const url = "https://api.waqi.info/feed/geo:"+ lat + ";" + lon + "/?token=edd5ed0e29943baa4f713c19d773e17f7b9d2ad6";
      const el = document.createElement('div');

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false ,
        offset: 25
        });

      fetch(url)
        .then(res => res.json())
        .then(info => {          
          for(let f of info.data.forecast.daily.pm25){
            if(f.day === today){
              const description = "<div><strong>" + info.data.city.name + "</strong><br /> Avg: " + f.avg + " | Min: " + f.min + " | Max: " + f.max + " </div>";
              popup.setHTML(description);
              break;
            }
          }
        })

      if (parseInt(sta.aqi) < 15) {
        el.className = 'excellent';
        popup.addClassName('excellent-popup');            
      }           
  
      else if (parseInt(sta.aqi) < 30){
        el.className = 'good';
        popup.addClassName('good-popup');
      }
  
      else if (parseInt(sta.aqi) < 55){
        el.className = 'moderate';
        popup.addClassName('moderate-popup');
      }
  
      else if (parseInt(sta.aqi) < 110){
        el.className = 'unhealthy';
        popup.addClassName('unhealthy-popup');
      }
      
      else{
        el.className = 'extUnhealthy';
        popup.addClassName('extUnhealthy-popup');
      }        
    
      new mapboxgl.Marker(el)
        .setLngLat([lon, lat])
        .addTo(map.current);

        el.addEventListener('mouseenter', e => {
          popup.setLngLat([lon, lat]).addTo(map.current);
        });

        el.addEventListener('mouseleave', e => {
          popup.remove();
        });
    }
  }  

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      bounds:[[77.173920, 12.627878], [77.850734, 13.208050]]
    });

    // fetching API data For Amsterdam
    fetch('https://api.waqi.info/map/bounds/?latlng=12.627878,77.173920,13.208050,77.850734&token=edd5ed0e29943baa4f713c19d773e17f7b9d2ad6')
      .then(res => res.json())
      .then(data => {
        apiData.current = data.data;
        dummyRef.current = 0;
        getStationData();
      })
  });

  //function to be called each time toggle button is toggled
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    console.log(value); // console log to verify the change in boolean value each time toggle button is toggled
    if(value){
      console.log("Polling data from the API every 10 seconds."); // console log to verify auto-refresh API call turned on or not
      timedAPIPolling = setInterval(getStationData, 10000);  
    }
    else {
      clearInterval(timedAPIPolling);
    }
  }

  return (
    <div>      
      <div className="sidebar">
        <strong>Air Quality Index (AQI) Map for PM<sub>2.5</sub> </strong>
      </div>    
               
      <label className="toggle" htmlFor="myToggle">
        <div className='toggle__bg'>
          <input className="toggle__input" type="checkbox" id="myToggle" onChange={handleInputChange}></input>
          <div className="toggle__fill"></div>
          <span className="tooltiptextOff ">Auto Refresh<br></br>OFF</span>
          <span className="tooltiptextOn ">Auto Refresh<br></br>ON</span>
        </div>                    
      </label>      
            
      <div ref={mapContainer} className="map-container" />      
    </div>
  );
}

export default App;