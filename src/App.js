import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Header from "./Header.js";
import SideBar from './SideBar.js';
import escapeRegExp from 'escape-string-regexp';
import ErrorOccurred from './ErrorOccurred';
import MenuBar from './MenuBar.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      venues: [],
      markers: [],
      showVenues: [],
      query: '',
      notVisibleMarkers: []
  }}

  componentDidMount() {
    this.getVenues()
  }

  //load script and initi map
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDPHA5axpc5SEwSeK1aKxiXNMmBRHlBjCc&callback=initMap")
    window.initMap = this.initMap
  }

  //call api to retrieve data
  getVenues = () => {
    var endPoint = "https://api.foursquare.com/v2/venues/explore?"
    var parameter = {
      client_id: "IMVSXL1XEDXJPF3ZWPFTLN2HTYAKIGMZL3NDIARWDHJK2BD4",
      client_secret: "X4AP1PXLQPQXA2UR34GJOQO3XJYTZVECC1M4AGLVR5TAJZOU",
      query: "brewery",
      ll: "39.082400,-77.12000",
      v: "20190102",
      limit: 10
    }

    //use axios to fetch API for compatibility and simplicity
    axios.get(endPoint + new URLSearchParams(parameter))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        //error handling
        alert("Unable to fetch the data from Foursquare." + error)
        console.log("ERROR!! " + error)
      })

  }

  initMap = () => {
    // Create map, set to montgomery county MD
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.082400, lng: -77.12000},
      zoom: 11
    })

    // Create an info window
    var infowindow = new window.google.maps.InfoWindow()

    this.infowindow = infowindow

    // dynamic position marker and content
    this.state.venues.forEach(myVenue => {

      var contentString = `<b>${myVenue.venue.name}</b> <br><i>${myVenue.venue.location.address}</i>`

      //Marker
      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat , lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      })

    this.state.markers.push(marker)


    function animatedEffect() {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(null) }, 400)
      }

    function openMarker() {
        // Setting the content of the InfoWindow
        infowindow.setContent(contentString)
        animatedEffect()

        infowindow.open(map, marker)
    }

      // Click on a marker
      marker.addListener('click', function() {
          openMarker()
      })
    })
  }

  updateQuery = query => {
      this.setState({ query })
      this.state.markers.map(marker => marker.setVisible(true))
      let filterVenues
      let notVisibleMarkers

      if (query) {
        const match = new RegExp(escapeRegExp(query), "i")
        filterVenues = this.state.venues.filter(myVenue =>
          match.test(myVenue.venue.name)
        )
        this.setState({ venues: filterVenues })
        notVisibleMarkers = this.state.markers.filter(marker =>
          filterVenues.every(myVenue => myVenue.venue.name !== marker.title)
        )

        //Hiding the markers for venues not included in the filtered venues
        notVisibleMarkers.forEach(marker => marker.setVisible(false))

        this.setState({ notVisibleMarkers })
      } else {
        this.setState({ venues: this.state.showVenues })
        this.state.markers.forEach(marker => marker.setVisible(true))
      }
    }


    render() {
      if (this.state.hasError) {
        return <div id="Error-message" aria-label="Error message">Error Occurred</div>
      } else {
        return (
        <main>
          <ErrorOccurred>

          <div id="header" aria-label="Header">
            <Header />
          </div>

          <div id="SideBar" aria-label="Side Bar">
            <SideBar
              venues={ this.state.showVenues }
              markers={ this.state.markers }
              filteredVenues={ this.filteredVenues }
    	      	query={this.state.query}
              clearQuery={this.clearQuery}
  	        	updateQuery={b => this.updateQuery(b)}
  	        	clickLocation={this.clickLocation}
            />
          </div>

          <div id="container" aria-label="Menu Container">
            <MenuBar
              venues={ this.state.venues }
              markers={ this.state.markers }
            />
          </div>
          <div id="map" aria-label="Map" role="application">
          </div>
          </ErrorOccurred>
        </main>
      );
    }
    }
  }


function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  script.onerror = "googleMapError()" {
        alert("Map failed to load correctly. Please try again.")
        }
}

export default App;
