# Blackbox Enterprises

Official GitHub Pages for [Blackbox Enterprises](https://github.com/Blackbox-Enterprises).

## Infrastructure

All traffic for `@blackboxprogramming` routes through **your** hardware:

```
Client → Cloudflare Edge/WAF → Cloudflare Access (OAuth) → Cloudflare Tunnel → Tailscale Mesh → BlackRoad Pi Fleet
```

### OAuth — Solved via Cloudflare Access

No OpenAI, Anthropic, or third-party auth providers required.

- **Cloudflare Access** acts as the zero-trust identity layer in front of every service URL.
- Supports GitHub SSO, email OTP, or any SAML/OIDC IdP you control.
- Every request is authenticated before it reaches your Pi fleet.

### Tailscale Mesh (WireGuard)

- Install: `curl -fsSL https://tailscale.com/install.sh | sh`
- Connect: `sudo tailscale up --auth-key <tskey-...>`
- Nodes communicate over encrypted WireGuard tunnels — no public IPs exposed.

### Cloudflare Tunnel (no inbound ports)

- Install: `cloudflared tunnel login`
- Create: `cloudflared tunnel create blackroad`
- Run: `cloudflared tunnel run blackroad`
- Outbound-only — the Pis call out to Cloudflare, not the other way around.

### Local LLM — Replace OpenAI / Anthropic

Run [Ollama](https://ollama.com) on the fleet to eliminate third-party AI API calls:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3        # general purpose
ollama pull codestral     # code generation
ollama pull mistral       # fast inference
```

Point n8n, your agents, or any HTTP client at `http://localhost:11434` instead of OpenAI endpoints.

## Continuous Engine

The `.github/workflows/continuous-engine.yml` self-chains on `[self-hosted, blackroad-fleet]` runners with an automatic cloud fallback (`ubuntu-latest`) when the Pis are offline — so the schedule-based cron always recovers the chain.

© 2026 BlackRoad OS, Inc.
