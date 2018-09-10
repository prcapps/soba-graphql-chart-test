import React, { Component } from 'react';
import '../css/SobaTable.css';
import SobaRow from './SobaRow';

class SobaTable extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="soba-table">
        <table>
          <tbody>
            {this.props.items.map(item => (
              <SobaRow item={item} key={item.grouptitle} expanded="false" />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SobaTable;
