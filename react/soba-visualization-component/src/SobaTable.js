import React, { Component } from 'react';
import ReactTable from "react-table";
import SobaRow from './SobaRow';

import 'react-table/react-table.css'
import '../css/SobaTable.css';


class SobaTable extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const data = this.props.items;

    const columns = [
      {
        Header: this.props.items[0].groupCategory,
        accessor: 'groupTitle' // String-based value accessors!
      },
      {
        id: 'count',
        Header: 'count',
        accessor: d => d.count !== undefined ? d.count : d.fields[0].value // Custom value accessors!

      },
    ];
    return (
      <div className="soba-table">
        <ReactTable
          data={data}
          columns={columns}

          SubComponent={(row) => {
            console.log(row.original.subitems);

            if (row.original.subitems.length == 0 || row.original.subitems[0].groupCategory == "undefined") {
              return;
            }

            columns[0].Header = row.original.subitems[0].groupCategory;

            return (
              <ReactTable
                data={row.original.subitems}
                columns={columns} 
                showPagination={false}
                defaultPageSize={row.original.subitems.length}
                SubComponent={(row) => {
                  console.log(row.original.subitems);

                  if (row.original.subitems.length == 0 || row.original.subitems[0].groupCategory == "undefined") {
                    return;
                  }

                  columns[0].Header = row.original.subitems[0].groupCategory;

                  return (
                    <ReactTable
                      data={row.original.subitems}
                      columns={columns} 
                      showPagination={false}
                      defaultPageSize={row.original.subitems.length}
                    />
                  );
                }}
              />
            );
          }}
          showPagination={false}
          defaultPageSize={data.length}
        />
      </div>
    );
  }
}

// <table>
//          <tbody>
//            {this.props.items.map(item => (
//              <SobaRow item={item} key={item.grouptitle} expanded="false" />
//            ))}
//          </tbody>
//        </table>

export default SobaTable;
