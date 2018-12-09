import React, { Component } from 'react';

import ListItem from './ListItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export default class List extends Component {

  /*
    Component to a Nested list
    PROPS WAITING :
    @list : list of items to filter
    @level : level of the current nested list (used to filter items by parent prop)
    @openModal : call to open the modal
    @maxLevel : number of level of nested list we allowed
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

    onDropHandler( evt ){
        try {
            console.log( evt.dataTransfer.getData('itemId') );
            data = JSON.parse(evt.dataTransfer.getData('itemId'));
        } catch (e) {
            // If the text data isn't parsable we'll just ignore it.
            return;
        }

        console.log( "move "+data+" to parent "+this.props.level );
    }
    
    preventDefault( evt ) {
        evt.preventDefault();
    }

    render() {

        const { list, level, openModal, maxLevel } = this.props;

        let keys = list && typeof list === 'object' ? Object.keys(list) : [], items = [];

        if( Array.isArray(keys) && keys.length > 0 ){
            items = keys.map( (id) => { 
                let l = list[id];
                if( l.parent === level ) {
                    return(
                        <div key={'list-'+id} >
                            <ListItem key={'item-'+id} id={id} item={l} editCallback={this.updateItemOfList} ></ListItem>
                            <List list={list} maxLevel={maxLevel} level={id} openModal={openModal} currentLevel={this.state.currentLevel+1} ></List>
                        </div>
                    );
                }
            });
        }

        if( this.state.currentLevel < maxLevel ){
            items.push( 
                <div key={'add-to-'+level} className="list-item bt-add" onClick={this.addNewItemToList} onDragOver={this.preventDefault} onDrop={this.onDropHandler}>
                    <div className="item-data">
                        <FontAwesomeIcon className="icon" icon={faPlusCircle}/>
                        <span className="content">Add new</span>
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
