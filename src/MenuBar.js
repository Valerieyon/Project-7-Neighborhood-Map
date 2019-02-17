import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './MenuBar.css';

class MenuBar extends Component {

  /*
   * openMarker function: is called with the onClick event
   * when a list item is clicked
  */
  // eslint-disable-next-line
  openMarker = locationName => {
    this.props.markers.forEach(marker => {
      if (marker.title === locationName) {
        window.google.maps.event.trigger(marker, "click")
      }
    })
  }


  render () {
    return (
      //menu showed at the beginning unless close it
      <Menu width={ '25%' } isOpen noOverlay >
        <div className="listOfVenues" aria-label="List of Venues">
        {this.props.venues.map(myVenue => (
            <li role="menuitem"
              onClick={() => {
                this.openMarker(myVenue.venue.name);
              }}
              aria-label={myVenue.venue.name}
              tabIndex="0"
              id={myVenue.venue.id}
              key={myVenue.venue.id}
            >
              {myVenue.venue.name}
              <br/>
            </li>
          ))}

          <p>
           <i>Data from Foursquare</i>
         </p>
          </div>
      </Menu>
    );
  }
}

export default MenuBar
