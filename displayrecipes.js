let express = require('express');
let mysql = require('mysql');
let path = require('path');

let app = require('./server'); // Import the app instance from server.js

// MySQL connection
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "YourPassword", // Uncomment and set your password if needed
    database: "nodejs_db"
});

// Route to display recipes
app.get('/recipes', (req, res) => {
    let query = "SELECT * FROM recipes";
    con.query(query, (err, results) => {
        if (err) throw err;
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recipes</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px; }
                    .recipe { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
                    h3 { margin: 0; }
                    img { max-width: 100px; height: auto; }
                </style>
            </head>
            <body>
                <h2>Recipes</h2>
                <div class="recipe-list">
                    ${results.map(recipe => `
                        <div class="recipe">
                            <h3>${recipe.recipe_name}</h3>
                            <p><strong>Owner:</strong> ${recipe.recipe_owner}</p>
                            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                            ${recipe.recipe_image ? `<img src="${recipe.recipe_image}" alt="${recipe.recipe_name}">` : ''}
                        </div>
                    `).join('')}
                </div>
                <button onclick="window.location.href='/'">Back to Home</button>
            </body>
            </html>
        `);
    });
});

// Start server
app.listen(4001, () => {
    console.log(`Server is running on http://localhost:4000`);
});