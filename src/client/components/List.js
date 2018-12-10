import React, { Component } from 'react';

import ListItem from './ListItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'

export default class List extends Component {

  /*
    Component to a Nested list
    PROPS WAITING :
    @list : list of items to filter
    @level : level of the current nested list (used to filter items by parent prop)
    @openModal : call to open the modal
    @maxLevel : number of level of nested list we allowed
    @startDrag : function to call when a drag action is started
  */

    constructor(props) {
        super(props);

        this.state = { 
            currentLevel : this.props.currentLevel || 0, // current level of nested list, 0 by default
        };

        this.addNewItemToList = this.addNewItemToList.bind(this);
        this.updateItemOfList = this.updateItemOfList.bind(this);
        this.onDropHandler = this.onDropHandler.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
    }

    // open modal window to create a new item for this list (parent = props.level);
    addNewItemToList(){
        this.props.openModal( null, this.props.level );
    }

    // open modal window to edit an item
    updateItemOfList( itemId ){
        this.props.openModal( itemId );
    }

    // callback trigger when an item is dropped into an Add button
    onDropHandler( evt ){
        evt.preventDefault();
        this.props.stopDrag( this.props.level );
    }
    
    // prevent default dragged event
    preventDefault( evt ) {
        evt.preventDefault();
    }

    render() {

        const { list, level, openModal, maxLevel, startDrag, stopDrag } = this.props;

        let keys = list && typeof list === 'object' ? Object.keys(list) : [], items = [];

        // display current item + list of item attached to it
        if( Array.isArray(keys) && keys.length > 0 ){
            items = keys.map( (id) => { 
                let l = list[id];
                if( l.parent === level ) {
                    return(
                        <div key={'list-'+id} >
                            <ListItem key={'item-'+id} id={id} item={l} editCallback={this.updateItemOfList} startDrag={startDrag} ></ListItem>
                            <List list={list} maxLevel={maxLevel} level={id} openModal={openModal} currentLevel={this.state.currentLevel+1} startDrag={startDrag} stopDrag={stopDrag} ></List>
                        </div>
                    );
                }
            });
        }

        // add button 
        if( this.state.currentLevel < maxLevel ){
            items.push( 
                <div key={'add-to-'+level} className="list-item bt-add" onClick={this.addNewItemToList} onDragOver={this.preventDefault} onDrop={this.onDropHandler}>
                    <div className="item-data">
                        <FontAwesomeIcon className="icon notdragging" icon={faPlusCircle}/>
                        <span className="content notdragging">Add new</span>
                        <FontAwesomeIcon className="icon isdragging" icon={faCaretSquareDown}/>
                        <span className="content isdragging">Drop inside</span>
                    </div>
                </div>);
        }

        let classNames = "list-ctn";
        if( level == null ) classNames+= ' first' ;
        return (
            <div className={classNames} >
                { items }
            </div>
        );
    }
}
