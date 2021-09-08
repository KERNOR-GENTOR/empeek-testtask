import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import "react-table-6/react-table.css";
import { Config } from '../config/config_item.js'

class Items extends Component {

    constructor(props) {
        super(props);
        this.stringColumnMaxLength = 255;
        this.addItem = this.addItem.bind(this);
        this.chooseItem = this.chooseItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state={
            name: '',
            type: '',
            items: [],
            chosenId: 0,
            isEditing: false
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
        const result = await fetch(`${Config.api_ip_item}/`, options)
            .then(response => response.json())
            .catch(console.log)
        this.setState({items: result})
    }

    componentWillUnmount()
    {
        window.location.reload();
    }

    addItem()
    {
        if(!this.state.name || !this.state.type) {
            alert('No empty fields!')
        }

        var itemBody = {
            name: this.state.name,
            type: this.state.type
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(itemBody)
        };
        fetch(`${Config.api_ip_item}/`, options)
            .catch(console.log)
    }

    chooseItem(original)
    {
        this.setState({
            name: original.name,
            type: original.type,
            chosenId: original.id,
            isEditing: true
        });
    }

    editItem(id)
    {
        if(!this.state.name || !this.state.type) {
            alert('No empty fields!')
        }

        var itemBody = {
            name: this.state.name,
            type: this.state.type
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(itemBody)
        };
        console.log(options, id)
        fetch(`${Config.api_ip_item}/${id}`, options)
        .catch(console.log)
        window.location.reload();
    }

    deleteItem(id)
    {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(`${Config.api_ip_item}/${id}`, options)
            .then(response => response.json())
            .catch(console.log)
        window.location.reload();
    }

    render ()
    {

        const item_columns = [{
            Header: "Items",
            columns: [
                {  
                   Header: 'Item Name',  
                   accessor: 'name',
                   filterable: false,
                },
                {  
                    Header: 'Item type',  
                    accessor: 'type',
                    filterable: false,
                },
                {
                    accessor: "",
                    filterable: false,
                    Cell: ({ original }) => {
                        return (<div>
                            <button type="button" onClick={() => this.chooseItem(original)} class="btn btn-primary mb-2 col-sm-6">Edit</button>
                            <button type="button" onClick={() => this.deleteItem(original.id)} class="btn btn-primary mb-2 col-sm-6">Delete</button>
                        </div>);
                    }
                }
            ]
        }];
        
        return (
        <div>
            <div class="row">
                <form onSubmit={this.handleSubmit} class="form-inline row">
                    <input
                        type="text" 
                        name="name"
                        placeholder="Name"
                        value={this.state.name}
                        maxLength={this.stringColumnMaxLength}
                        onChange={e => this.setState({name: e.target.value})}
                        required
                        class="form-group mb-2 col-sm-5"
                    />
                    <input
                        type="text" 
                        name="type"
                        placeholder="Type"
                        value={this.state.type}
                        maxLength={this.stringColumnMaxLength}
                        onChange={e => this.setState({type: e.target.value})}
                        required
                        class="form-group mb-2 col-sm-5"
                    />
                    {this.state.isEditing ? (
                        <button type="submit" onClick={() => this.editItem(this.state.chosenId)} onSubmit={e=>e.preventDefault()} class="btn btn-primary mb-2 col-sm-2">Confirm</button>
                        ) : (
                        <button type="submit" onClick={() => this.addItem()} onSubmit={e=>e.preventDefault()} class="btn btn-primary mb-2 col-sm-2">Add</button>
                    )}
                </form>
            </div>
            
            <br/>

            <div class="row mb-sm-5">
                <ReactTable class="col-sm-6"
                    data={this.state.items}
                    columns={item_columns}  
                    defaultPageSize = {4}  
                    pageSizeOptions = {[4,8,16,64]} 
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

export default Items;