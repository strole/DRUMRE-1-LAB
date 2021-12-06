const express = require('express')

const app = express()

const passport = require('passport')

const axios = require('axios');


const session = require('express-session')

const User = require('./models/User')
const Movie = require("./models/Movie")
const Music = require("./models/Music")

const facebookStrategy = require('passport-facebook').Strategy

app.set("view engine","ejs")
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
resave:true,
saveUninitialized: true }));
app.use(passport.initialize());
    app.use(passport.session()); 

passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : "424299486037523",
    clientSecret    : "3c920d97f9328d1768619c1b629028eb",
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({ 'uid' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                //console.log(user)
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new User();

                // set all of the facebook information in our user model
                newUser.uid    = profile.id; // set the users facebook id                   
                newUser.token = token; // we will save the token that facebook provides to the user                    
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.pic = profile.photos[0].value
                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }

        });

    })

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/profile', isLoggedIn, function(req, res) {
    //console.log(req.user)
    res.render('profile', {
        user : req.user // get the user out of session and pass to template
    });
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

app.get('/',(req,res) => {
    //console.log(req.body)
    res.render("index")
})

app.listen(5000,() => {
    console.log("App is listening on Port 5000")
})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get("/movies", isLoggedIn, function(req, res) {

    var movies = [];
    axios.get('https://api.themoviedb.org/3/movie/popular?api_key=7d8ba4c597c228d41218fa5b27ac871e&language=en-US&page=1')
    .then(r => {
    const headerDate = r.headers && r.headers.date ? r.headers.date : 'no response date';
    var movie = new Movie()
    movie.collection.drop();
    r.data.results.forEach(m => {
        var movie = new Movie()
        movie.title=m.title;
        movie.user_vote=m.vote_average;
        movie.overview=m.overview;
        movie.image=`https://image.tmdb.org/t/p/w500`+m.poster_path;
        movies.push(movie);
        movie.save(function(err) {
            if (err)
                throw err;
        });   
        });
      
        res.render('movies', {
            movieList : movies 
        });
        })
        .catch(err => {
          console.log('Error: ', err.message);
        });



    
});

app.get("/music", isLoggedIn,function(req, res) {

    var music = [];
    axios.get('https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=4744bff0f3dceb7a221996c9def110fe&format=json')
    .then(r => {
    const headerDate = r.headers && r.headers.date ? r.headers.date : 'no response date';
    console.log(r.data.tracks.track);
    var song = new Music()
    song.collection.drop();
    r.data.tracks.track.forEach(s => {
        var song = new Music()
        song.name=s.name;
        song.url=s.url;
        song.artist=s.artist.name;
        song.image=s.image[3]['#text'];
        music.push(song);
        song.save(function(err) {
            if (err)
                throw err;
        });   
        });
      
        res.render('music', {
            songList : music 
        });
        })
        .catch(err => {
          console.log('Error: ', err.message);
        });



});

