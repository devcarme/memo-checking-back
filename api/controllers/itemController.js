/* eslint-disable no-undef */
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
const path = require("path");

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

// Display list of all Items.
exports.itemListWithCategory = [
	
	async (req, res) => {
		const query = "SELECT items.id, categories.name, question, answer FROM items \
		INNER JOIN item_category ON items.id = item_category.item_id\
		INNER JOIN categories ON item_category.category_id = categories.id";
		const items = await sequelize.query(query, { 
			type: QueryTypes.SELECT
		});
		res.status(200).json({
			ok: true,
			items: items
		});
	}
];

// Display list of items by Category on GET.
exports.itemsByCategory = [
	async (req, res) => {
		const query = "SELECT * FROM items \
		INNER JOIN item_category ON items.id = item_category.item_id\
		WHERE item_category.category_id = ?";
		const items = await sequelize.query(query, { 
			type: QueryTypes.SELECT,
			replacements: [req.params.category], 
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

// Handle Item update on PUT.
exports.itemUpdate = [

	// Validate and sanitize fields.
	body("question").trim().isLength({ min: 1 }).escape().withMessage("Question must be specified."),
	body("answer").trim().isLength({ min: 1 }).escape().withMessage("Question must be specified."),

	// Process request after validation and sanitization.
	async (req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
        
		// Create Author object with escaped and trimmed data

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.status(400).json({
				ok: false
			});
		}
		else {
			Item
				.update(
					{ answer: req.body.answer, question: req.body.question },
					{ where: { id: req.params.id }}
				)
				.then(function(){
					res.status(204).json({
						ok: true,
						message: "Update de l'item ok"
					});
				})
				.catch(function(){
					res.status(400).json({
						ok: false,
						error: "Erreur lors de la modification de l'item"
					});
				}); 
		}
	}
];

// Handle Item delete on DELETE.
exports.itemDelete = [

	// Process request after validation and sanitization.
	async (req, res) => {
        
		// Create Author object with escaped and trimmed data

		Item
			.destroy(
				{ where: { id: req.params.id }}
			)
			.then(function(){
				res.status(200).json({
					ok: true,
					message: "Suppression de l'item ok"
				});
			})
			.catch(function(error){
				res.status(400).json({
					ok: false,
					error: error
				});
			}); 
	}
];
				
// Handle Items create on POST.
exports.importCSV = [

	// Validate and sanitize fields.
	// body("category").trim().isLength({ min: 1 }).escape().withMessage("Category must be specified."),

	// Process request after validation and sanitization.
	async (req, res) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);
        
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			res.status(400).json({
				ok: false,
				error: errors
			});
		}
		else {
			// Data from form is valid.
			const [ category, created ] = await Category.findOrCreate({
				where: {
					name: "Vocabulaire allemand",
					user: "ducarmeloick@gmail.com"
				}
			});
			console.log(created);
				
			let stream = fs.createReadStream(path.resolve(__dirname, "../../500_mots_allemands.csv"));
			let csvData = [];
			let csvStream = fastcsv
				.parse()
				.on("data", function(data) {
					csvData.push(data);
					csvData[csvData.length-1].push("ducarmeloick@gmail.com"); 
				})
				.on("end", function() {
					// remove the first line: header
					csvData.shift();

					// create a new connection to the database
					const connection = mysql.createConnection({
						host: process.env.DB_HOST,
						user: process.env.DB_USER,
						password: process.env.DB_PASS,
						database: process.env.DB_NAME
					});
					
					// open the connection
					connection.connect(error => {
						if (error) {
							console.error(error);
						} else {
							console.log(csvData);
							csvData.forEach(data => {
								let query = "INSERT INTO items (question, answer, user) VALUES (?)";
								connection.query(query, [data], (error, response) => {
									console.log(error || response);
									let id = response.insertId;
									let queryCategory = "INSERT INTO item_category (item_id, category_id) VALUES (?,?)";
									connection.query(queryCategory, [id, category.id], (error, response) => {
										console.log(error || response);
									});
								});
							}); 
							
						}
					});
				});
			stream.pipe(csvStream);
		}
	}
];
