import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export default class ListItem extends Component {

  /*
    Component to display an item
    PROPS WAITING :
    @id : id (string) of the item in list
    @item : item info
    @editCallback : function to call to edit this item
    @deleteCallback : function to call to delete this item
    @startDrag : function to call when a drag action is started
  */


  constructor(props) {
    super(props);

    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.onDragHandler = this.onDragHandler.bind(this);
  }

  // click on edit button Handler
  editItem(){
    this.props.editCallback( this.props.id );
  }

  // click on delete button Handler
  deleteItem(){
    this.props.deleteCallback( this.props.id );
  }

  // notify drag action has started
  onDragHandler( evt ){
    this.props.startDrag( this.props.id );
  }

  render() {
    
    const { item } = this.props;

    return (
      <div className="list-item" draggable={true} onDrag={this.onDragHandler}>
        <div className="item-data">
          <span className="title">{ item.title } </span>
          <span className="content">{ item.content }</span>

          <span className="action-bt delete-bt" onClick={this.deleteItem}>
            <FontAwesomeIcon className="icon" icon={faTrashAlt}/>
          </span>
          <span className="action-bt edit-bt" onClick={this.editItem}>
            <FontAwesomeIcon className="icon" icon={faPencilAlt}/>
          </span>
        </div>
      </div>
    );
  }
}
