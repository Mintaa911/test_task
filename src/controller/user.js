const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
    create,
    find,
    update
} = require('../adapters/postgres')

const {
  createCustomer,
  createSubscription,
  deleteSubscription
} = require('../adapters/stripe')


// JWT Secret Key
const JWT_SECRET = 'your_secret_key';


exports.getUsers = async (req,res,next) => {
  const userId = req.params.id;
  try {
    // Update the user's profile information
    const result = await find('users', {})
    const user = result[0]

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.findById = async (req,res,next) => {
  const userId = req.params.id;
  try {
    // Update the user's profile information
    const result = await find('users', {id: userId})
    const user = result[0]

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


exports.updateUser = async (req,res,next) => {
  const userId = req.params.id;

  try {
      const { name } = req.body;
  
      // Check if user exists
      await update('users',{name}, {id: userId})
  
      res.json({ success: true, message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


exports.subscribePayment = async (req,res,next) => {
  const userId = req.params.id;

  try {
    // Retrieve user information from the database
    const result = await find('users', {id: userId})
    const user = result[0]
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a customer in Stripe
    const customer = await createCustomer(user.email, req.body.token)
    

    // Save the Stripe customer ID in the database
    await update('users',{stripe_customer_id}, {id: userId})

    // Subscribe the customer to a plan
    const subscription = createSubscription(customer.id)


    res.json({ success: true, subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


exports.cancelSubscription= async (req,res,next) => {
  const userId = req.params.userId;

  try {
    // Retrieve user information from the database
    const user = await find('users', {id: userId}).first()

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cancel the subscription in Stripe

    await deleteSubscription(user.stripe_customer_id)

    // Update the database to reflect the cancellation
    await update('users',{stripe_customer_id: null}, {id: userId})

    res.json({ success: true, message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}