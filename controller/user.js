// user model schema 
const User = require("../models/user.js")







//signup   of user
// 1.1
module.exports.reneder_signup_form = (req, res) => {
    res.render("users/signup.ejs")
}



//# .1 .2
module.exports.signup = async(req, res) => {

    try {

        let { email, username, password } = req.body;

        console.log(req.body);
        const newUser = new User({ email, username });
        const registered_user = await User.register(newUser, password);
        console.log(registered_user);

        // # jab user sginup kre to 
        // automtaic login hooo jye with help oof ==== login()

        req.login(registered_user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust  🎉 Your account has been created successfully!")
            res.redirect("/listings")
        })


    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }
}


//login form
// 1.1

module.exports.render_login_form = (req, res) => {
    res.render("users/login.ejs")
}

///1.2   login    == confirm the login 

module.exports.login = async(req, res) => {
    req.flash("success", "welcome back to wanderlust")
    res.redirect(res.locals.redirecturl || "/listings")

}



/// 1.1   logout route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings")
    })
}