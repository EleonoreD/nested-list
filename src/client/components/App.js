import React, { Component } from 'react';
import URLSearchParams from 'url-search-params';

// App Components
import List from './List';
import Modal from './Modal';
import NumericInput from 'react-numeric-input';

export default class App extends Component {

  state = Object.assign( { entered : false }, this.getInitialState() );

  getInitialState() {

    return { 
      modal: {
        open: false,
        targetId : null,
        target : null,
        parent: null
      },
      list : {},
      maxLevel : 3,

      dragging : false,
      itemDragged : null,
      startDrag: this.startDrag.bind(this),
      stopDrag: this.stopDrag.bind(this)
    };
  }

  componentDidMount(){
    this.fetchList();
  }

  // fetch all items from the API
  fetchList(){
    fetch('/list', { method: 'GET' })
      .then(res => res.json())
      .then( listOfItems => {
        this.setState({ list : listOfItems });
      });
  }

  // get list all children of an item 
  browseChildrenOf( itemId ){
    let keys = Object.keys(this.state.list);
    let children = [];
    let browseFor = ( item ) => {
      keys.forEach( (key) => {
        if( item == this.state.list[key].parent ){
          children.push( key );
          browseFor( key );
        }
      });
    }
    browseFor( itemId );
    
    return children;
  }

  /* callback from List Add button to open the modal
    @targetId : id of item to update
    @parent : id of the parent item of the futur new item to create
    if target is defined, we need to edit an existing item 
    if target is not defined & parent is defined, we need to create a new item to attach to parent defined
  */
  openModal( targetId = null, parent = null ){
    let itemToEdit = null;
    
    if( targetId !== null )
      itemToEdit = this.state.list[targetId];

    this.setState({ modal : { open : true, targetId : targetId, target: itemToEdit, parent : parent }});
  }

  // callback from Modal component to close the (edit/create) item window
  // if payload is null, only cancel editing action
  // if payload is an object, do the action associated (edition or creation)
  closeModal( payload = null ){

    const { modal } = this.state;

    if( payload !== null ){
      // action required, prepare data to send to server
      const params = new URLSearchParams();
      params.append('title', payload.title );
      params.append('content', payload.content );
      let method = "POST";
      let url = '/list';

      if( modal.target === null && modal.parent !== null ){
        // create new item
        params.append('parent', modal.parent ); // add ref to the parent
        method = "POST";
      }
      if( modal.targetId !== null && modal.target !== null ){
        // edit item
        method = "PUT";
        url += "/"+modal.targetId;
      }

      fetch(url, { method: method, body: params })
        .then(res => {
          this.fetchList(); // refresh list after edition or creation
        });
    }
    // close the modal
    this.setState({ modal : { open : false, target: null, parent: null }});
  }

  // callback for start drag action
  startDrag( itemId ){
    this.setState({ dragging: true, itemDragged : itemId });
  }

  // callback for drag stop - drop action - let's add itemId dragged to parentId - if possible
  stopDrag( parentId ){
    const { list, itemDragged } = this.state;
    
    // firstly, check if the parentId is not the same or inside it own children

    let currentParent = list[ itemDragged ].parent;
    if( currentParent === parentId || parentId === itemDragged ) return; // item didn't move and cannot be is own child

    let childrenOfDraggedItem = this.browseChildrenOf( itemDragged );
    if( childrenOfDraggedItem.indexOf( parentId ) !== -1 ) return; // impossible to add an item inside is own hierarchy

    console.log( "drop "+this.state.itemDragged+' into '+parentId );
    const params = new URLSearchParams();
    params.append('title', list[ itemDragged ].title );
    params.append('content', list[ itemDragged ].content );
    params.append('parent', parentId );

    fetch( '/list/'+itemDragged, { method: 'PUT', body: params })
      .then(res => {
        this.fetchList(); // refresh list after edition or creation
      });
  }

  render() {
    const { list, modal, maxLevel, startDrag, stopDrag } = this.state;

    let children = [];

    if( modal.open ){
      children.push( <Modal key="modal" item={modal.target} closeModal={this.closeModal.bind(this)} ></Modal> )
    }

    return ( 
        <div id="main">
          <h1>Nested List App</h1>
          <h2>Christmas Diner</h2>
          <List key="main" list={list} maxLevel={maxLevel} level={null} openModal={this.openModal.bind(this)} startDrag={startDrag} stopDrag={stopDrag}></List>
          {children}
        </div>
    );

  }
}
