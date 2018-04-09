import React, { Component } from 'react';
import './expensesListView.css';
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
      editedIndex:0
    };
  }

  componentWillMount(){
    this.fetchData(Constants.EXPENSE,Constants.EXPENSE_DETAIL_URL);   //Fetch Expense list data
    this.fetchData(Constants.TAGS,Constants.TAGS_DETAIL_URL);         //Fetch pre-defined tags
  }

  // Fetch the data of expenses and tags
  fetchData(name, url){
    fetch(url)
    .then((response) => {
      return response.json()
    }).then( (json) => {
      if(Constants.TAGS === name)
        this.setState({tags: json});
      if(Constants.EXPENSE === name)
        this.setState({data: json});
    });
  }

  // Clear all values in textbox
  clearValues = () =>{
    this.setState({
      amount: 0,
      selectedTag: "",
      description: "",
      editedIndex: 0
     })
  }

  // Open or close model of expenses detail
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

  //Add or update the detail of daily expenses
  createOrUpdateList = (value) =>{
    if(this.state.amount <= 0){
      alert(Constants.PLEASE_ENTER_A_VALID_AMOUNT);
    }
    else{
      let newExpenseDetails = [];
      if(value === Constants.UPDATE_DATA){
        newExpenseDetails = this.state.data[this.state.editedIndex];
        newExpenseDetails.amount = this.state.amount;
        newExpenseDetails.tags = (this.state.selectedTag === "") ? this.state.selectedTag : this.state.tags[0].tags;
        newExpenseDetails.description = this.state.description;
      }else{
        var date = new Date();
        var createdDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
         newExpenseDetails = {
          "id": this.state.data.length + 1,
          "amount": this.state.amount,
          "tags": (this.state.selectedTag === "") ? this.state.selectedTag : this.state.tags[0].tags,
          "description": this.state.description,
          "createdDate": createdDate
        };
        this.state.data.push(newExpenseDetails);
      }
    this.updateExpenseList()
    }
  }

  // Edit the expense detail using index value
  editList = (index) =>{
    var listDetail = this.state.data[index];
    this.setState({ 
      amount: listDetail.amount,
      selectedTag: listDetail.tags,
      description: listDetail.description,
      editedIndex: index
    }, function(){ this.openCloseModal(Constants.OPEN_MODEL); })
  }

  //Delete Expenses using index
  deleteExpense = (index) =>{
    this.state.data.splice(index, 1);
    this.updateExpenseList();
  }

  //Update the expense list
  updateExpenseList = () =>{
    fetch(Constants.EXPENSE_DETAIL_URL,{
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
          <table class="table">
          <tr className="thead">
            <th>Amount</th>
            <th>Tag</th>
            <th>Date</th>
          </tr>
          {this.state.data.length > 0 && this.state.data.map((row, index) =>
            <tr key={row.id}>
                <th>{row.amount}</th>
                <th>{row.tags}</th>
                <th>{row.createdDate}</th>
                <th><button className="btn-display" onClick={this.editList.bind(this, index)}>Edit</button></th>
                <th><button className="btn-display" onClick={this.deleteExpense.bind(this, index)}>Delete</button></th>
            </tr>
          )}
          </table>
        </div>

      <Modal show={this.state.isOpen} >
        <div>
          <label className="label">Amount </label> 
            <input 
                className="input" type="number" pattern="[0-9]*" value={(this.state.amount) ? this.state.amount : ""}
                onChange = {(e) => this.setState({ amount: e.target.value })} />
          <label className="label">Tags </label>
            <select 
              className="dropdown" 
              name="tags" 
              onChange={(e)=>this.setState({ selectedTag:e.target.value })}>
                {this.state.tags.map(function(data) {
                    return (<option value={data.tags} selected={tag === data.tags}>{data.tags}</option>);
                })}
            </select>
          <label className="label">Description </label>
            <textarea 
              className="input" 
              name="description" 
              value={(this.state.description) ? this.state.description : ""}
              onChange={(e)=>this.setState({ description:e.target.value })} />
              <div className="center">
                <button className="btn-display"  onClick={this.createOrUpdateList.bind(this,Constants.NEW_DATA)}> Add </button> &nbsp;
                <button className="btn-display"  onClick={this.createOrUpdateList.bind(this,Constants.UPDATE_DATA)}> Update </button> &nbsp;
                <button className="btn-display"  onClick={this.clearValues}> Clear </button> &nbsp;
                <button className="close-btn"  onClick={this.openCloseModal.bind(this, Constants.CLOSE_MODEL)}> &#x2715; </button>
              </div>
        </div>
      </Modal>
    </div>
    );
  }
}

export default ListView;
