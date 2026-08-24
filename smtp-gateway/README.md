# Mailcoy SMTP Inbound Gateway

## What This Does

This is the **Mailcoy Central Inbound SMTP Gateway**. It runs as a standalone Node.js service on a VPS/server with the hostname `mx1.mailcoy.com`.

When any external person (from Gmail, Outlook, phone, anywhere) sends an email to an employee at a customer's domain (e.g. `femi@acme.com`), this server:

1. Receives the raw SMTP connection
2. Looks up the recipient in Supabase
3. Finds their linked personal Gmail inbox
4. Forwards the email via Resend instantly

## Customer Experience (Zero Clicks After Setup)

Customers only do **2 things once**:
1. Add their domain in the Mailcoy dashboard
2. Set their domain's MX record to `mx1.mailcoy.com` (priority 10)

After that, every employee who accepts their invite and links Gmail will automatically receive emails in their inbox.

## Deployment on VPS

```bash
# On your VPS (Ubuntu/Debian), give the server a static IP
# Set DNS A record: mx1.mailcoy.com → YOUR_VPS_IP
# Set DNS MX record for mailcoy.com: mx1.mailcoy.com (priority 10)

# Install Node 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
cd /opt
git clone https://github.com/Olafemiseyi/mailcoy.git
cd mailcoy/smtp-gateway
npm install

# Copy environment variables
cp /opt/mailcoy/.env .env

# Allow port 25 (SMTP) — requires root or CAP_NET_BIND_SERVICE
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Run with PM2 (auto-restart on crash)
npm install -g pm2
pm2 start server.js --name mailcoy-smtp
pm2 startup
pm2 save
```

## TLS / SSL (Production)

To add TLS to port 465/587, get a Let's Encrypt cert:

```bash
sudo certbot certonly --standalone -d mx1.mailcoy.com
```

Then uncomment the TLS lines in `server.js` and set `PORT=465`.

## Environment Variables

```env
SUPABASE_URL=https://tlimklsruaykdzckpziu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=re_...
SMTP_PORT=25
GATEWAY_DOMAIN=mx1.mailcoy.com
```
