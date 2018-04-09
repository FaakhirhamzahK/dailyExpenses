import React, { Component } from 'react';
import './App.css';
import Modal from './modelWindow';
import {Constants} from './Constants';

let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

class ListView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isOpen: false,
      amount:0,
      tags:[],
      selectedTag:"",
      description:"",
      editedIndex:0,
      isAddedNew: false
    };
  }

  componentWillMount(){
    this.fetchData(Constants.EXPENSE,Constants.EXPENSE_DETAIL_URL);
    this.fetchData(Constants.TAGS,Constants.TAGS_DETAIL_URL);
  }

  fetchData(name, url){
    fetch(url)
    .then( (response) => {
      return response.json()
    }).then( (json) => {
      if(Constants.TAGS === name)
        this.setState({tags: json});
      if(Constants.EXPENSE === name)
        this.setState({data: json});
    });
  }

  clearValues = () =>{
    this.setState({
      amount: 0,
      selectedTag: "",
      description: "",
      editedIndex: 0
     })
  }

  openCloseModal = (value) => {
    this.setState({
      isOpen: (Constants.OPEN_MODEL === value) ? true : false
    });
  }

  openNewPopup = () => {
    this.setState({ editedIndex: 0 });
    this.clearValues();
    this.openCloseModal(Constants.OPEN_MODEL);
  }

  createOrUpdateList = (value) =>{
    if(this.state.amount <= 0){
      alert("Please enter a valid amount");
    }
    else{
      let newExpenseDetails = [];
      if(value === Constants.UPDATE_DATA){
        newExpenseDetails = this.state.data[this.state.editedIndex];
        newExpenseDetails.amount = this.state.amount;
        newExpenseDetails.tags = this.state.selectedTag;
        newExpenseDetails.description = this.state.description;
      }else{
        var date = new Date();
        var createdDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
         newExpenseDetails = {
          "id": this.state.data.length + 1,
          "amount": this.state.amount,
          "tags": this.state.selectedTag,
          "description": this.state.description,
          "createdDate": createdDate
        };
        this.state.data.push(newExpenseDetails);
      }
    this.updateExpenseList()
    }
  }

  editList = (index) =>{
    var listDetail = this.state.data[index];
    this.setState({ 
      amount: listDetail.amount,
      selectedTag: listDetail.tags,
      description: listDetail.description,
      editedIndex: index
    }, function(){ this.openCloseModal(Constants.OPEN_MODEL); })
  }

  deleteExpense = (index) =>{
    this.state.data.splice(index, 1);
    this.updateExpenseList();
  }

  updateExpenseList = () =>{
    fetch("https://api.myjson.com/bins/ojmpv",{
      headers: {
      'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify(this.state.data)
    })
    .then( (response) => {
      return response.json()
    }).then( (json) => {
      this.setState({data: json});
      this.openCloseModal(Constants.CLOSE_MODEL);
      alert(Constants.LIST_UPDATED_SUCCESSFULLY);
    });
  }

  render() {
    let tag = this.state.selectedTag;

    return (
      <div>
        <p className="App App-header App-title">Daily Expenses</p>
        <div className="form">
          <button className="btn btn-right" onClick={this.openNewPopup}> Add Expenses </button>
          {this.state.data.length > 0 && this.state.data.map((row, index) =>
            <div className="padding-down" key={row.id}>
                {row.createdDate + " - " + row.tags} 
                <button className="btn-display" onClick={this.editList.bind(this, index)}>Edit</button> &nbsp;
                <button className="btn-display" onClick={this.deleteExpense.bind(this, index)}>Delete</button>
            </div>
          )}
        </div>

      <Modal 
        show={this.state.isOpen} >
        <div>
          <label className="label">Amount </label> 
          <input className="input" type="number" pattern="[0-9]*" value={(this.state.amount) ? this.state.amount : ""}
               onChange = {(e) => this.setState({ amount: e.target.value })} /><br/>
          <label className="label">Tags </label>
              <select className="dropdown" name="tags" onChange={(e)=>this.setState({ selectedTag:e.target.value })}>
                {this.state.tags.map(function(data) {
                    return (<option value={data.tags} selected={tag === data.tags}>{data.tags}</option>);
                })}
              </select><br/>
              <label className="label">Description </label>
              <textarea className="input" name="description" value={(this.state.description) ? this.state.description : ""}
                onChange={(e)=>this.setState({ description:e.target.value })} />
                <div className="center">
                <button className="btn-display"  onClick={this.createOrUpdateList.bind(this,Constants.NEW_DATA)}>
                  Add
                </button> &nbsp;
                <button className="btn-display"  onClick={this.createOrUpdateList.bind(this,Constants.UPDATE_DATA)}>
                  Update
                </button> &nbsp;
                <button className="btn-display"  onClick={this.clearValues}>
                  Clear
                </button> &nbsp;
                <button className="close-btn"  onClick={this.openCloseModal.bind(this, Constants.CLOSE_MODEL)}>
                   &#x2715;
                </button>
                </div>
          </div>
      </Modal>
    </div>
    );
  }
}

export default ListView;
