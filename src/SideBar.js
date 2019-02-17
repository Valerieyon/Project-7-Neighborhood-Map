import React, { Component } from 'react'

class SideBar extends Component {

  render() {
      return (
        <div className="locationFilter" aria-label="Location filter" role="application">
          <input
          type="text"
          autoFocus
          id="query-Filter"
          placeholder="Search..."
          value={this.props.query}
          onChange={event => this.props.updateQuery(event.target.value)}/>
        </div>
        );
      }
}

export default SideBar;
