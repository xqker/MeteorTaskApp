FlowRouter.route("/", {
    name: "Home",
    action(params){
        renderMainLayoutWith(<Home />)
    }

});

FlowRouter.route("/login",{
    name: "Login",
    action(params){
        renderMainLayoutWith(<UserModule formName="Login"/>)
    }
});

FlowRouter.route("/registration", {
    name: "Registration",
    action(params){
        renderMainLayoutWith(<UserModule formName="Registration"/>)
    }
});

FlowRouter.route("/editProfile", {
    name: "editProfile",
    action(params){
        renderMainLayoutWith(<UserModule formName="Edit Information"/>)
    }
});

function renderMainLayoutWith(component){
    ReactLayout.render(MainLayout,{
        header: <Header />,
        content: component,
        footer: <Footer />
    })
}