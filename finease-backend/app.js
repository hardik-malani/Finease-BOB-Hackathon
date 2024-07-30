const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();


app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'THISISNOTTHESECRET', 
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Server error');
  }
});

const goalSchema = new mongoose.Schema({
  title: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  weeklyTarget: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
});

const Goal = mongoose.model('Goal', goalSchema);

app.post('/goals', async (req, res) => {
  const { title, targetAmount } = req.body;
  const newGoal = new Goal({ title, targetAmount });
  try {
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/goals', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const transactionSchema = new mongoose.Schema({
  amount: {
      type: Number,
      required: true
  },
  balance: {
      type: Number,
      required: true
  },
  date: {
      type: Date,
      required: true
  },
  transaction: {
      type: String,
      required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

async function insertTransactionsIfEmpty() {
  try {
      await mongoose.connect('mongodb+srv://finesse:123@cluster0.gdg0t1b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
      const count = await Transaction.countDocuments({});
      if (count === 0) {
          console.log('Collection is empty. Inserting transactions.');
          const transactions = [
              {
                  amount: 2510.27,
                  balance: 2510.27,
                  date: new Date('2024-06-01'),
                  transaction: 'OPENING BALANCE'
              },
              {
                  amount: -450.0,
                  balance: 2060.27,
                  date: new Date('2024-06-01'),
                  transaction: 'UPI/AMAN JAIN/451995843686/UPI UPI-415371802085'
              },
              {
                  amount: -50.0,
                  balance: 2010.27,
                  date: new Date('2024-06-03'),
                  transaction: 'UPI/UNIQUE IDENTIFI/415583608466/Upi Transaction UPI-415546442316'
              },
              {
                  amount: -1413.0,
                  balance: 597.27,
                  date: new Date('2024-06-03'),
                  transaction: 'UPI/Dhruv Pandit/452111090837/NA UPI-415555516687'
              }
          ];
          const result = await Transaction.insertMany(transactions);
          console.log('Transactions saved:', result);
      } else {
          console.log('Collection is not empty. No transactions were inserted.');
      }
  } catch (err) {
      console.error('Error:', err);
  } finally {
      console.log('done');
  }
}

insertTransactionsIfEmpty();

app.get('/transactions', async (req, res) => {
  try {
      const transactions = await Transaction.find();
      res.json(transactions);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
