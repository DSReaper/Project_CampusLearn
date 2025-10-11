require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let MongoStore;
try { MongoStore = require('connect-mongo'); } catch (_) { /* optional */ }

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing for JSON form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets from /public (css, js, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// EJS templating setup (views are under public/views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Session with HTTP-only cookies (MemoryStore for dev only)
app.use(
	session({
		name: 'cl.sid',
		secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
		resave: false,
		saveUninitialized: false,
		store: (MongoStore && process.env.MONGO_URL)
			? MongoStore.create({ mongoUrl: process.env.MONGO_URL })
			: undefined,
			cookie: {
			httpOnly: true,
			sameSite: 'lax',
				secure: process.env.SECURE_COOKIES === 'true', // opt-in only; keep false on localhost
			maxAge: 1000 * 60 * 60 * 2 // 2 hours
		}
	})
);

// Passport serialization to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const hasGoogleCreds = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
if (hasGoogleCreds) {
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
	}, (accessToken, refreshToken, profile, done) => {
		try {
			const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || '';
			if (!/@belgiumcampus\.ac\.za$/i.test(email)) {
				return done(null, false, { message: 'Campus email required' });
			}
			const username = email.split('@')[0];
			const displayName = profile.displayName || username;
			const user = { id: username, username, email, role: 'student', displayName };
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	}));
}

app.use(passport.initialize());
app.use(passport.session());

// Expose user and flash to templates
app.use((req, res, next) => {
	res.locals.user = req.user || req.session.user || null;
	res.locals.flash = req.session.flash || null;
	res.locals.googleEnabled = hasGoogleCreds;
	// clear flash after exposing once
	if (req.session.flash) delete req.session.flash;
	next();
});

// Simple auth guard
function requireAuth(req, res, next) {
	if (!(req.user || req.session.user)) {
		// for non-API requests, redirect to login with flash
		if (req.accepts('html')) {
			req.session.flash = { error: 'Please sign in to continue.' };
			return res.redirect('/login');
		}
		return res.status(401).json({ error: 'Unauthorized' });
	}
	next();
}

// Health route
app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Home redirect: if logged in -> dashboard; else -> login
app.get('/', (req, res) => {
	if (req.user || req.session.user) return res.redirect('/dashboard');
	return res.redirect('/login');
});

// Render Login Page
app.get('/login', (req, res) => {
	res.render('login', { title: 'CampusLearn — Login' });
});

// Dashboard (protected)
app.get('/dashboard', requireAuth, (req, res) => {
	res.render('dashboard', { title: 'Dashboard — CampusLearn' });
});

// Auth API: Login (stubbed to match DTO contract)
// Request DTO (Model/DTO/Athentication/login.json):
// { "email": "string", "password": "string" }
// Success DTO (loginResponse.json):
// { message, token, user: { id, username, email, role, displayName } }
// Error DTO (loginBadRequest.json):
// { error: "Missing required fields", details: [ ... ] }
app.post('/api/auth/login', (req, res) => {
	const { email, password } = req.body || {};

	const details = [];
	if (!email) details.push('Email is required');
	if (!password) details.push('Password is required');

	if (details.length) {
		return res.status(400).json({ error: 'Missing required fields', details });
	}

	// Simple domain check to mirror README intent (Google SSO later);
	// For now accept any password for belgiumcampus emails. This is a stub only.
	const validDomain = /@belgiumcampus\.ac\.za$/i.test(email);
	if (!validDomain) {
		console.warn('[LOGIN DENY] Non-campus email attempted:', email);
		return res.status(401).json({ error: 'Unauthorized', details: ['Please use your @belgiumcampus.ac.za email'] });
	}

	const username = email.split('@')[0];
	const displayName = username
		.split('.')
		.map(s => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');

		// Create session and return a mock token and user object
		const user = { id: username, username, email, role: 'student', displayName };
		if (req.login) {
			req.login(user, (err) => {
				if (err) {
					console.error('[LOGIN ERROR] req.login failed:', err);
					return res.status(500).json({ error: 'Server error' });
				}
				// Also mirror into req.session.user for templates/routes that read it
				req.session.user = user;
				return res.status(200).json({ message: 'Login successful', token: 'mock-token', user });
			});
		} else {
			req.session.user = user;
			return res.status(200).json({ message: 'Login successful', token: 'mock-token', user });
		}
});

	// Logout
	app.get('/logout', (req, res) => {
		const done = () => {
			req.session.destroy(() => {
				res.clearCookie('cl.sid');
				res.redirect('/login');
			});
		};
		if (req.logout) {
			req.logout(() => done());
		} else {
			done();
		}
	});

	// Google OAuth routes (enabled only when creds provided)
	if (hasGoogleCreds) {
		app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

		app.get(
			'/auth/google/callback',
			passport.authenticate('google', { failureRedirect: '/login' }),
			(req, res) => {
				res.redirect('/dashboard');
			}
		);
	}

// 404 fallback for unknown routes (API only)
app.use('/api', (_req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
	console.log(`CampusLearn server running on http://localhost:${PORT}`);
});

