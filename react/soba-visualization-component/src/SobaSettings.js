import React, { Component } from 'react';
// import '../css/SobaSettings.css';

class SobaSettings extends Component {
  render() {
    return (
      <div className="inputs">
        <div>
          <label>Dataset:</label>
          <input
            name="dataset"
            type="text"
            value={this.state.dataset}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Count Field:</label>
          <input
            name="count"
            type="text"
            value={this.state.count}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Date Field:</label>
          <input
            name="dateField"
            type="text"
            value={this.state.dateField}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Group By:</label>
          <input
            name="groupByText"
            type="text"
            value={this.state.groupByText}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <label>Date Field:</label>
          <input
            name="byDateText"
            type="text"
            value={this.state.byDateText}
            onChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }
}

export default SobaSettings;
