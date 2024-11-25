const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Ensure the correct origin for your front end
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/nodejs_db'; // Update to your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas and Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user", "chef"],
    required: true
  }
});

const RecipeSchema = new mongoose.Schema({
  recipe_name: String,
  recipe_owner: String,
  ingredients: String,
  recipe_image: String
});

const User = mongoose.model('User', UserSchema);
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/recipe-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recipe_form.html'));
});

// Handle user registration
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    console.log('User registered:', newUser._id);
    res.redirect('/');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ name: username, password });
    if (user) {
      res.json({ message: 'Login successful!', userId: user._id });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle recipe submission
app.post('/submit-recipe', async (req, res) => {
  const { recipe_name, recipe_owner, ingredients, recipe_image } = req.body;
  try {
    const newRecipe = new Recipe({ recipe_name, recipe_owner, ingredients, recipe_image });
    await newRecipe.save();
    console.log('Recipe submitted:', newRecipe._id);
    res.redirect('/recipes');
  } catch (err) {
    console.error('Error during recipe submission:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to display recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
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
              ${recipes.map(recipe => `
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
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
