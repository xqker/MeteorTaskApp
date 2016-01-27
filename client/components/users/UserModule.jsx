UserModule = React.createClass({
    mixins:[ReactMeteorData],
    getInitialState() {
        return {
            errorMessage: '',
            successfulMessage: ''
        }
    },
    //submit method for login form
    loginUser(e){
        e.preventDefault();
        var error = '';
        var self = this;

        var email = e.target.email.value;
        var password = e.target.password.value;

        Meteor.loginWithPassword(email, password, (err) =>{
            if(err){
                this.setState({ errorMessage :err.reason })
            } else {
                FlowRouter.go('Home');
            }
        })
    },

    //submit method for register form
    registerUser(e){
        e.preventDefault();
        var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        var options = {
            profile:{}
        };
        options.email = e.target.email.value;
        options.password = e.target.password.value;
        if(options.email && options.password) {
            if(!emailFilter.test(options.email)){
                this.setState({ errorMessage : 'incorrect email' })
            } else {
                Accounts.createUser(options,(err) =>{
                    if(err){
                        this.setState({ errorMessage :err.reason })
                    } else {
                        FlowRouter.go('Home');
                    }
                });
            }
        } else {
            this.setState({ errorMessage : 'empty email or password' });
        }

    },

    //submit method for Edit information form
    changeUserData(e){
        e.preventDefault();
        this.setState({ errorMessage : '',
            successfulMessage : ''
        });
        var password = e.target.password.value,
            newPass = e.target.newPass.value,
            email = e.target.email.value,
            name = e.target.username.value,
            userLocation = e.target.userLocation.value;
        if(password && newPass && (password != newPass)){
            Accounts.changePassword(password, newPass, (err) =>{
                if(err){
                    this.setState({ errorMessage : err.reason + ' ' + this.state.errorMessage })
                } else {
                    this.setState({ successfulMessage : ' password changed;' + ' ' + this.state.successfulMessage });
                }
            })
        }
        if(email && email != (this.data.currentUser.emails ? this.data.currentUser.emails[0].address : '')){
            Meteor.call('editEmail', email, (err)=>{
                if(err){
                    this.setState({ errorMessage : err.reason + ' ' + this.state.errorMessage })
                } else {
                    this.setState({ successfulMessage : ' email changed;' + ' ' + this.state.successfulMessage });
                }
            });
        }

        if(name && name!=(this.data.currentUser.profile ? this.data.currentUser.profile.name : '')){
            Meteor.users.update(this.data.currentUserId, {$set: {'profile.name': name}}, (err) =>{
                if(err){
                    this.setState({ errorMessage : err.reason + ' ' + this.state.errorMessage })
                } else {
                    this.setState({ successfulMessage : ' name changed;' + ' ' + this.state.successfulMessage });
                }

            });
        }

        if(userLocation && userLocation!=(this.data.currentUser.profile ? this.data.currentUser.profile.location : ''))
            Meteor.users.update(this.data.currentUserId, {$set: {'profile.location': userLocation}}, (err)=>{
                if(err){
                    this.setState({ errorMessage : err.reason + ' ' + this.state.errorMessage })
                }else {
                    this.setState({ successfulMessage : ' location changed;' + ' ' + this.state.successfulMessage });
                }
            });
    },

    getMeteorData(){
        return{
            currentUser: Meteor.user(),
            currentUserId: Meteor.userId()
        }
    },

    render(){
        let onSubmit, emailValue, locationValue, nameValue, submitBtnVal, passPlaceHolder, formName;
        if(this.data.currentUser){
            formName = "Edit profile";
            emailValue = this.data.currentUser.emails ? this.data.currentUser.emails[0].address : '';
            locationValue = this.data.currentUser.profile ? this.data.currentUser.profile.location : '';
            nameValue = this.data.currentUser.profile ? this.data.currentUser.profile.name : '';
            passPlaceHolder = "Enter old password...";
            submitBtnVal = "Save";
            onSubmit = this.changeUserData;
        } else if(this.props.formName === "Registration") {
            formName = "Registration";
            onSubmit = this.registerUser;
            submitBtnVal = "Register";
            passPlaceHolder = "Enter password...";
        } else {
            formName = "Login";
            onSubmit = this.loginUser;
            submitBtnVal = "Login";
            passPlaceHolder = "Enter password...";
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-6-col-sm-offset-3">
                        <h1>{ formName }</h1>
                        <form onSubmit={onSubmit}>
                            <input type="text" name="email" defaultValue={emailValue} placeholder="Enter email..." className="form-control" />
                            <input type="password" name="password" placeholder={passPlaceHolder} className="form-control" />
                                {
                                this.data.currentUser ?
                                    (<div>
                                        <input type="password" name="newPass" placeholder="Enter new password..." className="form-control" />
                                        <input type="text" defaultValue={nameValue} name="username" placeholder="Enter name..."
                                               className="form-control"/>
                                        <UserLocation value={locationValue}/>
                                    </div>)
                                    : ''
                                }
                            <input type="submit" value={submitBtnVal} className="btn btn-default"/>
                            <div className = "text-danger"> { this.state.errorMessage } </div>
                            <div className = "text-primary"> { this.state.successfulMessage } </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});