var Category = require("../models/category");
const { Op } = require("sequelize");

const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.categoryList = function (req, res) {

	Category.findAll({
		where: {
			user: {
				[Op.eq]: "ducarmeloick@gmail.com"
			}
		}
	})
		.then(function (listCategory) {
			// Successful, so render.
			return res.status(200).json({
				ok: true,
				message: "Categories récupérées",
				categories: listCategory
			});
		});
};

// Handle Category create on POST.
exports.create = [
	// Validate and sanitize fields.
	body("category").trim().isLength({ min: 1 }).escape().withMessage("Category must be specified."),

	// Process request after validation and sanitization.
	(req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).json({
				ok: false,
				error: errors.array()
			});
		}else{
			const category = new Category({
				name: req.body.category,
				user: "ducarmeloick@gmail.com"
			});
			// Save category.
			category.save()
				.then(function() {
					res.status(201).json({
						ok: true,
						message: "Catégorie enregistrée"
					});
				})
				.catch(function(){
					res.status(409).json({
						ok: false,
						message: "Cette catégorie existe déjà"
					});
				});
		}
	}
	
];
