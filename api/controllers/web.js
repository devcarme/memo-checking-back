const express = require("express");
const router = express.Router();
const connection = require("../config/database.js");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var session;

connection.connect(error => {
	if (error) throw error;
	console.log("Successfully connected to the database.");
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.raw({ type: "application/vnd.custom-type" }));


router.post("/verifyUser",(req,res) => {
	const isUser = "SELECT * FROM _user WHERE userMail = '" + req.body.userMail + "'";
	connection.query(isUser, function (error, results) {
		if(error) throw error;
		if(results.length){
			bcrypt.compare(req.body.userPassword, results[0].userPassword).then(function(result) {
				if(result){
					session = req.session;
					session.userMail = req.body.userMail;
					return res.status(200).json({
						ok: true
					});
				}else{
					return res.status(404).json({
						ok: false,
						error: "Identifiant ou mot de passe incorrect"
					});
				}
			}); 
		}else{
			return res.status(404).json({
				ok: false,
				error: "Identifiant ou mot de passe incorrect"
			});
		}
	});
});

router.post("/registerUser",(req,res) => {
	bcrypt.hash(req.body.userPassword, saltRounds, function(err, hash) {
		const passwordHashed = hash;
    
		const selectMail = "SELECT * FROM _user WHERE userMail = '" + req.body.userMail + "'";
		const selectPseudo = "SELECT * FROM _user WHERE userPseudo = '" + req.body.userPseudo + "'";
		const insertUser = "INSERT INTO _user VALUES('" + req.body.userMail + "','" + req.body.userPseudo + "','" + passwordHashed + "')";
		connection.query(selectMail, function (error, results) {
			if(error) console.log(error) ;
			if(results.length){
				return res.status(403).json({
					ok: false,
					error: "Adresse mail déjà utilisée",
					errorType: "mail"
				});
			}else{
				connection.query(selectPseudo, function (error, results) {    
					if(error) throw error;
					if(results.length){
						return res.status(403).json({
							ok: false,
							error: "Pseudo déjà utilisé",
							errorType: "pseudo"
						});
					}else{
						connection.query(insertUser, function (error) {
							if(error)throw error;
							return res.status(200).json({
								ok: true,
							});
						});
					}
				});
			}
		});
	});
});

router.post("/addCategory", (req,res, next) => {
	const query = "INSERT INTO _category(categoryName, userMail) VALUES('" + req.body.category + "','" + session.userMail + "')";
	connection.query(query,  function (error, results, fields) {
		if (error){
			return res.status(409).json({
				ok: false,
				message: "La catégorie exite déjà"
			});
		}else{
			return res.status(200).json({
				ok: true
			});
		}
	});
});

router.post("/addItem", (req,res, next) => {
	const { key, value } = req.body;
	const queryItem = "INSERT INTO _item(itemKey, itemValue, userMail) \
    VALUES(?, ?, ?)";
	connection.query(queryItem, [key, value, session.userMail], function (error, results, fields) {
		if (error){
			console.log(error);
			return res.status(409).json({
				ok: false,
				message: "Cet item existe déjà"
			});
		}else{
			const idItem = results.insertId;
			const queryItemCategory = "INSERT INTO _item_category VALUES('" + idItem + "','" + req.body.category.idCategory + "')";
			connection.query(queryItemCategory,  function (error, results, fields) {
				if (error) throw error;
				return res.status(200).json({
					ok: true,
					message: "Item ajouté avec succès !"
				});
			});     
		}    
	});           
});

router.post("/deleteItem", (req,res, next) => {
	const queryItem = "DELETE FROM  _item WHERE idItem = '" + req.body.item.idItem + "'";
	connection.query(queryItem,  function (error, results, fields) {
		if(error) throw(error);
		return res.status(200).json({
			ok: true,
			message: "Item supprimé avec succès"
		});
	});           
});

router.get("/getCategories", (req,res, next) => {
	const query = "SELECT * FROM _category WHERE userMail = '" + session.userMail + "'";
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
		return res.status(200).json({
			ok: true,
			categories : results
		});
	});
});

router.post("/getCategoryItems", (req,res, next) => {
	const query = "SELECT DATE_FORMAT(create_timestamp, '%d/%m/20%y') as createdTimestamp, \
    _item.idItem, itemKey, itemValue, _item.userMail, note, itemNextReminder, itemPreviousReminder \
    FROM _item INNER JOIN _item_category ON _item.idItem = _item_category.idItem \
    WHERE _item.userMail = '" + session.userMail + "' AND _item_category.idCategory = '" + req.body.idCategory + "'";
	connection.query(query, function (error, results, fields) {
		if (error) console.log(error) ;
		return res.status(200).json({
			ok: true,
			items : results
		});
	});
});

router.get("/getUserItems", (req,res, next) => {
	const query = "SELECT * FROM _item WHERE userMail = '" + session.userMail + "'";
	connection.query(query, function (error, results, fields) {
		if (error) console.log(error) ;
		return res.status(200).json({
			ok: true,
			items : results
		});
	});
});

router.get("/logout", (req,res, next) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}else{
			console.log("sessionion destroy");
			return res.status(200).json({
				ok: true,
			});
		}
	});
});

module.exports = router;