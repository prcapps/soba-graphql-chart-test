import React, { Component } from 'react';
import SobaTable from './SobaTable';

class SobaRow extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: props.expanded };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log('update', name, value);
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { item } = this.props;

    // const {title,count,subitems} = this.props.item;

    const title = this.props.item.grouptitle;
    const count = this.props.item.count;
    const subitems = this.props.item.subitems;

    let className = '';

    if (this.state.expanded !== true) {
      className = 'subTable';
    }

    let subItemExpand = (
      <input
        name="expanded"
        type="checkbox"
        value={this.state.expanded}
        onChange={this.handleInputChange}
      />
    );

    let showSubItems = false;
    if (subitems && subitems.length && subitems[0].grouptitle != 'undefined') {
      showSubItems = true;
    }

    // console.log(count, typeof count, item, showSubItems);

    if (count == '') {
      className = '';
      subItemExpand = '';
      subitems[0].groupcategory = '';
    }

    let subitemsElm;
    if (showSubItems) {
      subitemsElm = (
        <div className={className}>
          <strong>{ subitems[0].groupcategory }</strong>
          <SobaTable items={subitems} />
        </div>
      );
    } else {
      subItemExpand = false;
    }

    return (
      <tr>
        <td>{ title }</td>
        <td>
          { count }
          { subItemExpand }
          { subitemsElm }
        </td>
      </tr>
    );
  }
}

export default SobaRow;
