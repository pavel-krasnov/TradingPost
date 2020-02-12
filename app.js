const 	express 		= require("express"),
		app 			= express(),
		bodyParser 		= require("body-parser"),
		mongoose 		= require("mongoose"),
		flash			= require("connect-flash"),
		passport 		= require("passport"),
		methodOverride	= require("method-override"),
		LocalStrategy 	= require("passport-local"),
		Item	 		= require("./models/item"),
		Comment 		= require("./models/comment"),
		User 			= require("./models/user");

const 	commentRoutes 		= require("./routes/comments");
		itemRoutes 			= require("./routes/items");
		authRoutes 			= require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "Some message I use",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/items/:id/comments", commentRoutes);
app.use("/items", itemRoutes);

app.listen(process.env.PORT || 3000, process.env.IP);