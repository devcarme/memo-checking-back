const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("500_most_allemands.csv");
let csvData = [];
let csvStream = fastcsv
	.parse()
	.on("data", function(data) {
		csvData.push(data + ",ducarmeloick@gmail.com");
	})
	.on("end", function() {
		// remove the first line: header
		csvData.shift();

		// create a new connection to the database
		const connection = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "memochecking"
		});

		// open the connection
		connection.connect(error => {
			if (error) {
				console.error(error);
			} else {
				let query = "INSERT INTO items (question, answer, user, created_at) VALUES ?";
				connection.query(query, [csvData], (error, response) => {
					console.log(error || response);
					let id = response.insertId;
					let queryCategory = "INSERT INTO item_category (item_id, category_id) VALUES ?";
					connection.query(query, , (error, response) => {
						console.log(error || response);

					});
				});
			}
		});
	});

stream.pipe(csvStream);