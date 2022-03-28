This is a map filled with information about air quality for the city of Bengaluru. 
This application only considers PM2.5 data. 
PM2.5 data is expressed in ppm (parts per million). The higher it is the worse the quality of the air is. 
This project considers 5 levels:

- Between 0 and 15 ppm: Excellent
- Between 15 and 30 ppm: Good
- Between 30 and 55 ppm: Moderate
- Between 55 and 110 ppm: Unhealthy
- Above 110 ppm: Extremly Unhealthy

The Map API used is MapboxGL. It is used along with ReactJS library for JavaScript front end development.
The pollution PM2.5 data is fetched from AQICN API. The documentation of this API is located at the URL: https://aqicn.org/json-api/doc/
