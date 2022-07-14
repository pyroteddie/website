const stripe = require('stripe')('sk_test_51LJaHJIvndITSaVYpSPnqPxT69FtM0FG5OY8X2pirE8iFjBFPB4Zefm6Zplb94IcvQfPtTOvNGQnBSHUqILZb6p600EEcSzjUB');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/checkout', async (req, res) => {
 
  console.log(req.body.ServicePrice);

  var cleanPrice = Number(req.body.ServicePrice) * 100
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
            product_data:{
              name:OrderRef,
              description: req.body.Cleantype + " - " + req.body.CleanDetails,
            },
            currency:"aud",
            unit_amount_decimal:cleanPrice,
          },
          quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}/booking`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));