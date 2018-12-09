import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export default class ListItem extends Component {

  /*
    Component to display an item
    PROPS WAITING :
    @id : id (string) of the item in list
    @item : item info
    @editCallback : function to call to edit this item
  */


  constructor(props) {
    super(props);

    this.editItem = this.editItem.bind(this);
    this.onDragHandler = this.onDragHandler.bind(this);
  }

  // click on edit button Handler
  editItem(){
    this.props.editCallback( this.props.id );
  }

  onDragHandler( evt ){
    var data = { id: this.props.id  };
    evt.dataTransfer.setData('itemId', JSON.stringify(data)); 
  }

  render() {
    
    const { item } = this.props;

    return (
      <div className="list-item" draggable={true} onDrag={this.onDragHandler}>
        <div className="item-data">
          <span className="title">{ item.title } </span>
          <span className="content">{ item.content }</span>

          <span className="edit-bt" onClick={this.editItem}>
            <FontAwesomeIcon className="icon" icon={faPencilAlt}/>
          </span>
        </div>
      </div>
    );
  }
}
