# Cloudflare Zero Trust — OAuth (Access) Setup Guide

This document explains how to protect `blackbox-enterprises.github.io` and route
all `@blackboxprogramming` traffic through your own infrastructure using
**Cloudflare Zero Trust Access** — no Raspberry Pis required while they are offline.

---

## 1. Prerequisites

| Tool | Purpose |
|------|---------|
| `cloudflared` | Tunnel daemon (runs on any Linux host or directly via Cloudflare) |
| Cloudflare account | Zero Trust plan (free tier supports up to 50 users) |
| Custom domain (optional) | e.g. `blackroad.io` already in Cloudflare DNS |

---

## 2. Create a Cloudflare Access Application (OAuth)

1. Go to **Cloudflare Dashboard → Zero Trust → Access → Applications**.
2. Click **Add an application → Self-hosted**.
3. Fill in:
   - **Application name**: `Blackbox Enterprises`
   - **Session duration**: `24 hours`
   - **Application domain**: `blackbox-enterprises.github.io` (or your custom domain)
4. Under **Identity providers**, enable one or more:
   - **GitHub** — allows `@blackboxprogramming` to log in with their GitHub account
   - **One-time PIN (OTP)** — fallback when no Pis/Tailscale is available
5. Under **Policies**, create a policy:
   - **Policy name**: `Blackbox Team`
   - **Action**: Allow
   - **Include rule**: `GitHub → Username → @blackboxprogramming`
6. Save the application. Cloudflare will issue an **AUD (audience) tag** — save it.

---

## 3. Start the Cloudflare Tunnel (replaces Pi routing when Pis are offline)

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared

# Authenticate (opens browser)
cloudflared tunnel login

# Create the tunnel
cloudflared tunnel create blackbox-tunnel

# Run with the config in this repo
cloudflared tunnel --config cloudflare/tunnel-config.yml run
```

> **Pi offline?** The tunnel can run on any machine (laptop, VPS, cloud VM).
> When the Pis come back online, move the credentials file and restart there.

---

## 4. Tailscale Integration

When your Raspberry Pis are back online, Tailscale + Cloudflare Tunnel work together:

```
Browser → Cloudflare Edge → Tunnel → Tailscale node (Pi) → Internal services
```

### On each Pi (one-time setup):

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --authkey=<YOUR_TAILSCALE_AUTH_KEY>

# Install and run cloudflared
cloudflared tunnel --config ~/cloudflare/tunnel-config.yml run
```

### DNS (in Cloudflare dashboard):

Add a **CNAME** record:
```
blackbox-enterprises.github.io  CNAME  <tunnel-id>.cfargotunnel.com
```

This routes all traffic through your infra, not GitHub's servers.

---

## 5. OAuth Flow Summary

```
User visits blackbox-enterprises.github.io
       │
       ▼
Cloudflare Edge (checks Access JWT cookie)
       │
  [not authenticated]        [authenticated]
       │                           │
       ▼                           ▼
GitHub OAuth login             Site served
  ↓ (GitHub callback)         via Tunnel
Cloudflare issues JWT              │
  ↓                           Your infra
User redirected back           (Pi / VPS)
```

---

## 6. Environment Variables / Secrets Required

Store these as **GitHub Actions secrets** or in your deployment environment:

| Variable | Description |
|----------|-------------|
| `CF_TUNNEL_TOKEN` | Cloudflare Tunnel token (from `cloudflared tunnel token`) |
| `CF_ACCESS_AUD` | Audience tag from Cloudflare Access application |
| `CF_ACCOUNT_ID` | Your Cloudflare Account ID |

---

## 7. Verifying Traffic Routes Through Your Infra

```bash
# From outside your network:
curl -sv https://blackbox-enterprises.github.io 2>&1 | grep -i 'cf-ray\|server'
# Should show: Server: cloudflare  and  CF-Ray: <id>

# Confirm tunnel is active:
cloudflared tunnel info blackbox-tunnel
```

---

## References

- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Tailscale + Cloudflare](https://tailscale.com/kb/1036/outbound-auth/)
