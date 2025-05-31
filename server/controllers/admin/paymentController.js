const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent=async(req,res)=>{
    const {totalAmount}=req.body;
    try{
        const paymentIntent=await stripe.paymentIntents.create({
            amount:totalAmount,
            currency:'vnd'
        })
        res.send({clientSecret:paymentIntent.client_secret})

    }catch(error){
        res.status(500).send({ error: error.message });

    }
}