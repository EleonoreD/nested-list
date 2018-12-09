import React, { Component } from 'react';

export default class Modal extends Component {

    /*
        Component to display a modal to create or edit an item
        PROPS WAITING :
        @item : item info, or null if creation mode
        @closeModal : call to close the modal
    */

    constructor(props) {
        super(props);

        const { item } = this.props;

        this.state = { title: item && item.title ? item.title : '' , content:  item && item.content ? item.content : ''};

        this.validateClickHandler = this.validateClickHandler.bind(this);
        this.cancelClickHandler = this.cancelClickHandler.bind(this);
    }

    // function called when the user click on validate button of the modal
    validateClickHandler( ){
        if( this.state.title != '' )
            this.props.closeModal( { title : this.state.title, content: this.state.content} );
    }

    // update state value of form
    handleChange( target, event) {
        let state = {};
        state[target] = event.target.value;
        this.setState(state);
    }

    cancelClickHandler(){
        this.props.closeModal(null);
    }  

    render() {

        const { item, closeModal } = this.props;

        let mode = item ? "Edit" : "Create";

        return (
            <div className="modal">
            <div className="cover" onClick={this.cancelClickHandler} ></div>
            <div className="form">
                <h1>{ mode }</h1>
                <span className="label">Title</span>
                <input id="title" value={this.state.title} type="text" className="title" onChange={this.handleChange.bind(this, 'title')} />
                <span className="label">Content</span>
                <input id="content" value={this.state.content} type="text" className="content" onChange={this.handleChange.bind(this, 'content')} />

                <div className="valid" onClick={ this.validateClickHandler }>Validate</div>
            </div>
            </div>
        );
    }
}
