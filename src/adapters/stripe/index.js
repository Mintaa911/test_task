const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
    createCustomer,
    createSubscription,
    deleteSubscription
}

async function createCustomer(email, token) {
    try {
        // Create a customer in Stripe
        const customer = await stripe.customers.create({
            email: email,
            source: token, // Token obtained from Stripe.js or Elements
        });

        return customer
    } catch (error) {
        console.log(error)
    }
}


async function createSubscription(customerId) {
    try {
        // Subscribe the customer to a plan
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: process.env.STRIPE_PRODUCT_ONE_PRICE_ID }], 
          });
    } catch (error) {
        console.log(error)
    }
}

async function deleteSubscription(customerId) {
    try {
        // Cancel the subscription in Stripe
        await stripe.subscriptions.del(customerId, {
            cancel_at_period_end: true,
        });
    } catch (error) {
        
    }
}
