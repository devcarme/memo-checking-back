const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const Item = require("../models/item");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");

// Display list of all Items.
exports.itemList = function (req, res) {

	Item.findAll({
		where: {
			user: {
				[Op.eq]: "ducarmeloick@gmail.com"
			}
		}
	})
		.then(function (listItem) {
			// Successful, so render.
			return res.status(200).json({
				ok: true,
				message: "Items récupérées",
				items: listItem
			});
		});
};

// Display list of items by Category on GET.
exports.itemsByCategory = [
	async (req, res) => {
		const query = "SELECT * FROM items \
		INNER JOIN item_category ON items.id = item_category.item_id\
		WHERE item_category.category_id = ?";
		const items = await sequelize.query(query, { 
			type: QueryTypes.SELECT,
			replacements: [req.params.category	], 
		});
		res.status(200).json({
			ok: true,
			items: items
		});
	}
];

// Handle Author create on POST.
exports.itemCreate = [

	// Validate and sanitize fields.
	body("question").trim().isLength({ min: 1 }).escape().withMessage("Question must be specified."),
	body("answer").trim().isLength({ min: 1 }).escape().withMessage("Question must be specified."),
	body("category").trim().isLength({ min: 1 }).escape().withMessage("Category must be specified."),

	// Process request after validation and sanitization.
	async (req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
        
		// Create Author object with escaped and trimmed data
		var item = new Item(
			{
				question: req.body.question,
				answer: req.body.answer,
				note: req.body.note,
				user: "ducarmeloick@gmail.com"
			}
		);

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.status(400).json({
				ok: false
			});
		}
		else {
			// Data from form is valid.
			const [ category, created ] = await Category.findOrCreate({
				where: {
					name: req.body.category,
					user: "ducarmeloick@gmail.com"
				}
			});
			console.log(created);
				
			// Save author.
			item.save()
				.then(function() {
					const query = "INSERT INTO item_category(item_id, category_id)\
							VALUES(?,?)";
					sequelize.query(query, { 
						type: QueryTypes.INSERT,
						replacements: [item.id, category.id], 
					});
					res.status(201).json({
						ok: true,
						message: "Item enregistré"
					});
				})
				.catch(function(error){
					res.status(409).json({
						ok: false,
						message: error
					});
				});

		}
	}
];

