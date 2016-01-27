if (Meteor.isServer) {
    Locations = new Mongo.Collection("locations");
    Messages = new Mongo.Collection("messages");

    Meteor.publish("messages", function () {
        return Messages.find({});
    });

    Meteor.publish("locations", function () {
        return Locations.find({});
    });
    Schema = {};

    Schema.UserProfile = new SimpleSchema({
        name: {
            type: String,
            optional: true
        },
        location: {
            type: String,
            optional: true
        }
    });

    Schema.User = new SimpleSchema({
        username: {
            type: String,
            optional: true
        },
        emails: {
            type: Array,
            // For accounts-password, either emails or username is required, but not both. It is OK to make this
            // optional here because the accounts-password package does its own validation.
            // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
            optional: true
        },
        "emails.$": {
            type: Object
        },
        "emails.$.address": {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        "emails.$.verified": {
            type: Boolean
        },
        createdAt: {
            type: Date
        },
        profile: {
            type: Schema.UserProfile,
            optional: true
        },
        // Make sure this services field is in your schema if you're using any of the accounts packages
        services: {
            type: Object,
            optional: true,
            blackbox: true
        }
    });

    Meteor.methods({
        addNewMessage(text) {
            // Make sure the user is logged in before add new message
            if (! Meteor.userId() || !Meteor.user().profile || !Meteor.user().profile.location) {
                throw new Meteor.Error("not-authorized or no location for broadcasting");
            }
            Messages.insert({
                text: text,
                createdAt: new Date(),
                owner: Meteor.userId(),
                createdBy: Meteor.user().username || Meteor.user().emails[0].address,
                location: Meteor.user().profile.location

            })
        },
        editEmail(email) {
            // Make sure the user is logged in before edit email
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }
            Meteor.users.update(Meteor.userId(), {$set: {'emails.0.address': email}}, (err) =>{
                if(err){
                    throw new Meteor.Error(err.reason);
                }
            });

        }
    });
}