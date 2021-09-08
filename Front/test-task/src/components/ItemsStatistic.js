import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import "react-table-6/react-table.css";
import { Config } from '../config/config_item.js'

class ItemStatistic extends Component {

    constructor(props) {
        super(props);
        this.state={
            types: [],
        }
    }

    async componentDidMount()
    {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const result = await fetch(`${Config.api_ip_item}/Types`, options)
            .then(response => response.json())
            .catch(console.log)
        this.setState({types: result})
    }

    componentWillUnmount()
    {
        window.location.reload()
    }

    render ()
    {

        const item_columns = [{
            Header: "Statistic",
            columns: [
                {  
                   Header: 'Item type',  
                   accessor: 'type',
                   filterable: false,
                },
                {  
                    Header: 'Count',  
                    accessor: 'count',
                    filterable: false,
                }
            ]
        }];
        
        return (
        <div className="EnterItem">
            
            <br/>
            
            <div class="row mb-sm-5">
                <ReactTable class="col-sm-6"
                    data={this.state.types}
                    columns={item_columns}  
                    defaultPageSize = {3}  
                    pageSizeOptions = {[3,9,27]} 
                    filterable
                    filtered={this.state.filtered}
                    onFilteredChange={(filtered, column, value) => {
                        this.onFilteredChangeCustom(value, column.id || column.accessor);
                    }}
                    defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        if (typeof filter.value === "object") {
                        return row[id] !== undefined
                            ? filter.value.indexOf(row[id]) > -1
                            : true;
                        } else {
                        return row[id] !== undefined
                            ? String(row[id]).indexOf(filter.value) > -1
                            : true;
                        }
                    }}
                />
            </div> 
        </div>
        );
    }
}

export default ItemStatistic;