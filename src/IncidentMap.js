import React, { Component } from 'react';
import APIKEY from './config.js'
import GoogleMapReact from 'google-map-react'
import './css/IncidentMap.css'
import DrawerMenu from './DrawerMenu'

const request = require('superagent');

const defaultMapCenter = {lat: 41.882059,lng: -87.627815};
const defaultZoom = 11;
let APIcallURL = ""

const GAlatitude = 41.890653;

const GAlongitude = -87.626988;



const checkStringArray = ["west", "east", "north", "south", "w.", "n."]


	     //  const positionObject = { 	       
	    	// position: {lat: 41.890653, lng: -87.626988},
	    	// 	map,
	     //  	}
//{({map, maps, latitude, longitude}) => this.renderMarkers(map, maps, 41.890653, -87.626988)}
class IncidentMap extends Component {
	constructor(props){
		super(props)

		this.state = {
			selectedPlace: "GA",
			submittedAddress: this.props.address,
			latitudes: [],
     		longitudes: [],
     		center: {lat: 41.8781, lng: -87.6298},
      		zoom: 15,
      		addressToBeGeocoded: "",
      		reRender: false,
      		markers: [],
      		map: '',
      		maps: ''
		}
	}

	getURL = () => {
	//	console.log('this is this.state.addressToBeGeocoded in get coord',this.state.addressToBeGeocoded);
		const address = this.state.addressToBeGeocoded;
		const addressArray = address.split(' ');
	//	console.log('this is address array', addressArray)
		let rootURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
		const apiKeyURLending = "&key=" + APIKEY;
	//	console.log('this is addressArray', addressArray)

		for(let i = 0; i<addressArray.length; i++){
			let noPlus = false
			for(let j=0; j<checkStringArray.length; j++){
				if(addressArray[i].toLowerCase() === checkStringArray[j].toLowerCase()){
					noPlus = true
				}
			}
			if(noPlus === true){
				rootURL = rootURL + addressArray[i]
				// i++;
			} else if(i===0){
			//	console.log('firstif triggered')
				rootURL = rootURL + addressArray[i] + '+'
			//	console.log('this is firstif address array length', addressArray.length)
			} else if (i>0 && (i !== addressArray.length-1)){
			//	console.log('secondif triggered')
				rootURL = rootURL + '+' + addressArray[i]
			//	console.log('this is rootURL', rootURL)
			//	console.log('this is i in secondif', i, 'when this is addressarray.length', addressArray.length)
			} else if (i===addressArray.length-1){
				rootURL = rootURL + '+' + addressArray[i]
			//	console.log('thirdif triggered')
			//	console.log('this is i in thirdif', i)
				APIcallURL = rootURL + apiKeyURLending;
				return APIcallURL
			}
		}


	}
	toggleState = () => {
	//	console.log('before toggling set state rerender', this.state.reRender)
		this.setState({reRender: !this.state.reRender})
	//	console.log('after toggling set state rerender', this.state.reRender)
	}
	getCoordinates = {
	  // request
	  // 	.get('http://localhost:9292/incedent/create')
   //    	.send(formData)
   //    	.end((err,createdIncident)=>{
   //        console.log(createdIncident)
   //        this.props.handleClose();
   //    })
	}
	// getLatitude = (latitude) => {
	//     // console.log('this is latitude to be added to array', latitude)
	//     this.setState({latitudes: [...this.state.latitudes, latitude]})
	     
	// }
	// getLongitude = (longitude) => {
	    
	//     this.setState({longitudes: [...this.state.longitudes, longitude]})
	//     // console.log(this.state.longitudes)
	// }

	addCoordinate = (lat, long) => {
		
		console.log("addCoordinate called with lat " + lat + " and long " + long);
		this.setState({
			latitudes: [...this.state.latitudes, lat],
			longitudes: [...this.state.longitudes, long]
		})
	}
	getCoordinates = () => {
		console.log('this is the URL for the API call',this.getURL())
		request
			.get(this.getURL())
			.end((error, response)=>{
				const responseJSON = JSON.parse(response.text)
	//			console.log('here is my JSON response.results',responseJSON.results)
	//			console.log('THIS IS MY ERROR', error)
				const latitude = responseJSON.results[0].geometry.location.lat;
				const longitude = responseJSON.results[0].geometry.location.lng;
				// this.getLatitude(latitude);
				// this.getLongitude(longitude);
				this.addCoordinate(latitude, longitude)

			})


	}
	renderMarkers = (map, maps, latitude, longitude) => {
		console.log('this is latitude', latitude)
		console.log('this is longitude', longitude)
	  		/// This just sets up the map from the google api thing
	  		

	 
			const marker = new maps.Marker({ 	       
		    	position: {lat: latitude , lng: longitude},
		    		map,
	      	});

	  		const state = this.state;
	  		state.map = map;
	  		state.maps = maps;
	  		this.setState(state)

	      	// const marker = new maps.Marker(positionObject);
  		
	}
	handleChange = (e) =>{
		
		this.setState({addressToBeGeocoded: e.currentTarget.value})
		//console.log('this is e.currentTarget.value',e.currentTarget.value)

	}
	handleSubmit = (e) => {
		e.preventDefault()
		this.setState({addressToBeGeocoded: e.currentTarget.value});
		//console.log('this is this.state.addressToBeGeocoded', this.state.addressToBeGeocoded)
		this.getCoordinates();
		
	}
	componentWillMount() {

		let responseJSON = []
		request
			.get('http://localhost:9292/incident')
			.end((error, response)=>{
	//			console.log('this is response from server', response)
				responseJSON = JSON.parse(response.text)
		//		console.log('this is response.text in JSON from server', responseJSON)
		//		console.log("this is the error", error)

				const state = this.state;


				for(let i = 0; i<responseJSON.length; i++){ 
					state.latitudes.push(responseJSON[i].latitude)
					// this.getLatitude(responseJSON[i].latitude)
					// this.getLongitude(responseJSON[i].longitude)

					state.longitudes.push(responseJSON[i].longitude)
				}
				this.setState(state)
			})
			


	}

	// test = ()=>{
	// 	for (var i = 0; i < this.state.latitudes.length; i++) {
	// 		console.log("I AM WORKING AS A CALLBACK", this.state.latitudes[i])
	// 			(map, maps, latitude, longitude) => this.renderMarkers(map, maps, this.state.latitudes[i], this.state.longitudes[i])

	// 	}
	// }
	
	render() {
		console.log("render")
		// let responseJSON = []
		// request
		// 	.get('http://localhost:9292/incident')
		// 	.end((error, response)=>{
		// 		console.log('this is response from server', response)
		// 		responseJSON = JSON.parse(response.text)
		// 		console.log('this is response.text in JSON from server', responseJSON)
		// 		console.log("this is the error", error)

		// 			for(let i = 0; i<responseJSON.length; i++){ 
		// 				this.getLatitude(responseJSON[i].latitude)
		// 				this.getLongitude(responseJSON[i].longitude)
		// 			}
		// 	})


	




		const style = {
      	width: '100%',
      	height: '100%'
    	  // display: 'flex',
    	  // flex: 1
   		 }

		const MARKER_SIZE = 40;

		const greatPlaceStyle = {
  		position: 'absolute',
  		width: MARKER_SIZE,
  		height: MARKER_SIZE,
  		left: -MARKER_SIZE / 2,
  		top: -MARKER_SIZE / 2
		}

		if(this.state.map != ''){
			
			const maps = this.state.maps
			const map = this.state.map
			

			const markers = this.state.latitudes.map((lat, i) => {
				return  new maps.Marker({ 	       
			    	position: {lat: lat, lng: this.state.longitudes[i]},
			    		map
			      	});

			})

		}
		


	
	    return (
	      <div className='google-map'>
	      <DrawerMenu toggleState={this.toggleState} addCoordinate={this.addCoordinate} userId={this.props.userId}/>

	        <GoogleMapReact defaultCenter={defaultMapCenter} defaultZoom={ defaultZoom }
	       		 bootstrapURLKeys={{
	                 key: APIKEY,
	                 language: 'en'
                 }}
                 onGoogleApiLoaded={({map, maps}) => {
                 	console.log('api being loaded called')
                 	for (let i = 0; i < this.state.latitudes.length; i++) {
                 		console.log(this.props.userId)

                 		this.renderMarkers(map, maps, this.state.latitudes[i], this.state.longitudes[i])
                 	}
                 }}
				 >	
				 {this.state.markers}

	        </GoogleMapReact>
	      </div>
	    )
	}
}

export default IncidentMap;
