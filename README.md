WhatsApp-first Chatbot Demo (minimal)

Quick start:
1. Copy .env.example to .env and fill keys (META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, FLUTTERWAVE_SECRET_KEY, PAYSTACK_SECRET_KEY).
2. Ensure Redis is running locally (optional for workers).
3. Install dependencies: npm install
4. Start NLP service: npm run nlp
5. Start gateway: npm start
6. Expose gateway via ngrok and set WhatsApp webhook to https://<ngrok-id>/webhook
7. Send messages to your WhatsApp test number.

Notes:
- This demo is for local testing and uses SQLite.
- Payment adapters call the real provider sandbox endpoints. Use test keys.


Admin dashboard added: run the admin app in /admin-dashboard (see admin-dashboard/README.md)
