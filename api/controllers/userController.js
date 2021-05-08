const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { body, validationResult } = require("express-validator");

// Handle User register on POST.
exports.register = [
	// Validate and sanitize fields.
	body("email").isEmail().withMessage("Email must be specified."),
	body("pseudo").trim().isLength({ min: 1 }).escape().withMessage("Pseudo must be specified.")
		.isAlphanumeric().withMessage("Pseudo has non-alphanumeric characters."),
	body("password").trim().isLength({ min: 8 }).escape().withMessage("Password must be specified with minimum 8 characters."),

	// Process request after validation and sanitization.
	(req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).json({
				ok: false,
				error: errors.array()
			});
		}

		bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
			const hashedPassword = hash;
			// Create Author object with escaped and trimmed data
			const user = new User(
				{
					email: req.body.email,
					pseudo: req.body.pseudo,
					password: hashedPassword,
				}
			);
			if (!errors.isEmpty()) {
				res.status(400).json({
					ok: false,
					errors: errors.array()
				});
			}
			else {
				// Data from form is valid.

				// Save author.
				user.save()
					.then(function() {
						res.status(201).json({
							ok: true,
							message: "Compte enregistré"
						});
					})
					.catch(function(){
						res.status(409).json({
							ok: false,
							message: "Compte existant"
						});
					});
			}
		});
	}
];

// Handle User login on POST.
exports.login = [
	// Validate and sanitize fields.
	body("email").isEmail().withMessage("Email must be specified."),
	body("password").trim().isLength({ min: 8 }).escape().withMessage("Password must be specified with minimum 8 characters."),

	// Process request after validation and sanitization.
	(req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).json({
				ok: false,
				error: errors.array().msg
			});
		}

		User.findOne({where: {email: req.body.email}}).then(function(user) {
			if (!user) {
				res.status(404).json({
					ok: false,
					error: "Identifiant incorrect"
				});
			} else {
				bcrypt.compare(req.body.password, user.password).then(function(result) {
					if(result){
						req.session.email = req.body.email;
						res.status(202).json({
							ok: true,
							message: "Connexion effectuée"
						});
					}else{
						res.status(401).json({
							ok: false,
							error: "Identifiant ou mot de passe incorrect"
						});
					}
				}); 
			}
		});
	}
];
