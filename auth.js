const passport = require('koa-passport')
const Local = require('passport-local').Strategy
const Facebook = require('passport-facebook').Strategy
const Router = require('koa-router')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGO_URL)

module.exports = function(app) {

	app.use(async function fakeAdmin(ctx, next) {
		// Fake admin authentication
		if (ctx.session.tmp_user) {
			ctx.req.user = ctx.state.user = ctx.session.tmp_user
		}
		await next()
	})

	passport.serializeUser(function(user, done) {
		done(null, user)
	});

	passport.deserializeUser(function(user, done) {
		done(null, user)
	});

  // passport.use(new Local(function(username, password, done) {
	// 	return co(function* () {
	// 		try {
	// 		var user = yield User.getByUsername(username);
	// 		if (user == null) return null;
	// 		if (user.auth != 'local') {
	// 			throw {name: 'ExternalProviderError', message: user.auth};
	// 		}
	// 		var isValidPassword = yield User.verifyPassword(user, password);
	// 		if (isValidPassword) return user;
	// 		throw {name: 'WrongPasswordError'};
	// 		}
	// 		catch (err) {
	// 		log.info({err, username}, 'Error attempting login.');
	// 		throw err;
	// 		}
	// 	}).then(user => done(null, user), done);
  // }));

	// TODO: change these credentials
  passport.use(new Facebook({
			clientID: '149531775391525',
			clientSecret: '276d9bbc056bb37a62b0969e036a9d9e',
			enableProof: true,
			profileFields: [
				'id',
				'displayName',
				'first_name',
				'last_name',
				'link',
				'photos',
				'emails',
				'age_range',
				'gender',
				'locale',
				'timezone',
				'verified',
			],
			callbackURL: '/auth/fb'
	  },
	  async function(token, refreshToken, profile, done) {
			try {
				let db = await client
				let Users = db.collection('users')

				let userProfile = await Users.findOne({_id: profile.id})
				if (!userProfile) {
					userProfile = await saveNewUser(profile._json)
				}
				
				done(null, userProfile)

				async function saveNewUser(user) {
					user._id = user.id
					let result = await Users.insertOne(user)
					return result.ops[0]
				}
			}
			catch (err) {
				done(err)
			}
	  }
	));
	
	return passport
};
