// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2025-11-17.clover',
});

type Data = {
sessionId?: string;
error?: string;
};

export default async function handler(
req: NextApiRequest,
res: NextApiResponse<Data>
) {
if (req.method === 'POST') {
try {
const { priceId } = req.body;

const session = await stripe.checkout.sessions.create({
mode: 'subscription',
payment_method_types: ['card'],
line_items: [{ price: priceId as string, quantity: 1 }],
success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${req.headers.origin}/membership`,
});

res.status(200).json({ sessionId: session.id });
} catch (err) {
const error = err as Error;
res.status(500).json({ error: error.message });
}
} else {
res.status(405).json({ error: 'Method not allowed' });
}
}