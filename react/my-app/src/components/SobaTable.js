import React, { Component } from 'react';
import './SobaTable.css';

// const rowItems = todos.map((todo) =>
//       <li key={item.grouptitle}>
//         <td>
//             {{ item.grouptitle }}
//           </td>
//           <td>
//             {{ item.count }}
//           </td>
//           <td v-if="item.subitems && item.subitems[0].groupcategory">
//             <strong>{{ item.subitems[0].groupcategory }}</strong>
//             <SobaTable v-bind:items="item.subitems"></SobaTable>
//           </td>
//       </li>
//     );

const numbers = [1, 2, 3, 4, 5];

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

class SobaRow extends Component {

  render() {
    const title = this.props.item.grouptitle;
    const count = this.props.item.count;
    const subitems = this.props.item.subitems;

    let subitemsElm
    if (subitems && subitems.length && subitems[0].groupcategory) {
      subitemsElm =  <td><strong>{ subitems[0].groupcategory }</strong><SobaTable items={subitems} /></td>;
    }

    return (
      <tr>
        <td>{ title }</td>
        <td>{ count }</td>
        { subitemsElm }
      </tr>
    );
  }
}

class SobaTable extends Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div class='soba-table'>
        <table>
          <tbody>
            {this.props.items.map(item => (
                <SobaRow item={item} />
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SobaTable;