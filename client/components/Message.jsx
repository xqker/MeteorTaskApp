Message = React.createClass({
    render(){
        return (
            <div className="list-group-item">
                <h4 className="list-group-item-heading">
                    { this.props.message.text }
                </h4>
                <p className="list-group-item-text" >{ this.props.message.createdBy } : { this.props.message.createdAt.toLocaleString()} :
                    { this.props.message.location }</p>

            </div>
        );
    }
});