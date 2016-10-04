import React from 'react';
import './App.css';
import xhr from 'xhr';
import Plot from './Plot.js';

class App extends React.Component {
  
  state = {
  	location: '',
  	data: {},
  	dates: [],
  	temps: [],
	locationName: '',
	locationCountry: '',
	mapURL: 'http://maps.googleapis.com/maps/api/staticmap?center=59.316669,10.81667&zoom=10&size=1000x1000&key=AIzaSyBf1o19YdDO4daX3BTD2dR2UttcNGSsIJM'
  };

  fetchData = (evt) => {
  	evt.preventDefault();
console.log('got it:', this.state.location);
  	var location = encodeURIComponent(this.state.location);
  	
  	var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
  	var urlSuffix = '&APPID=ae5d1eaec69ee1c6e5364df12eecf69d&units=metric';
  	var url = urlPrefix + location + urlSuffix;  

console.log(url);  	
  	//call APi and get data
  	var self = this;
  	
  	xhr({
  		url: url
  	}, function (err, data) {
  		//Create arrys of usable data
		var body = JSON.parse(data.body);
		var list = body.list;
		var dates = [];
		var temps = [];
		for (var i = 0; i < list. length; i++) {
			dates.push(list[i].dt_txt);
			temps.push(list[i].main.temp);
		} 
		var locationName = body.city.name;
		var locationCountry = body.city.country;
        var coord = body.city.coord.lat + "," + body.city.coord.lon;
        var mapURLPrefix = 'http://maps.googleapis.com/maps/api/staticmap?center=';
        var mapURLSuffix = '&zoom=10&size=650x350&key=AIzaSyBf1o19YdDO4daX3BTD2dR2UttcNGSsIJM';
        var mapURL = mapURLPrefix + coord + mapURLSuffix; 

console.log(locationName, locationCountry);
console.log(mapURL); 
		
        //copy vaules back into global vars        
		self.setState({
			data: body,
			dates: dates,
			temps: temps,
			locationName: locationName,
			locationCountry: locationCountry,
			mapURL: mapURL
		});
  	})
  };
  
  changeLocation = (evt) => {
  	this.setState({
  		location: evt.target.value 
  	});
  };

  render() {
      
  	var currentTemp= 'not loaded';
  	if (this.state.data.list) {
  		currentTemp = this.state.data.list[0].main.temp;
  	}
    return (
      <div>
		  <h1>Weather</h1>
		  <form onSubmit={this.fetchData}>
			<label>Get me the weather for
				<input
					placeholder={"Town, Country"}
					type="text"
					value={this.state.location}
					onChange={this.changeLocation}
				/>
			</label>
		  </form>
		  {(this.state.data.list) ? (
			  <div className="wrapper">
				  <p className="temp-wrapper">
					<span className="temp">{ currentTemp }</span>
					<span className="temp-symbol">°C</span>
				  </p>
				  <h2>Forecast: {this.state.locationName + ", " + this.state.locationCountry}</h2>
				  <Plot
					xData={this.state.dates}
					yData={this.state.temps}
					type="scatter"
				  />
                  <img
                    className="map"
                    src= { this.state.mapURL }
                    height="350"
                    width="650"
                  />
				</div>
          ) : null}
      </div>
    );
  }
}

export default App;
