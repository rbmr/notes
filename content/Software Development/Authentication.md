Towards centralized, simple, and secure authentication for internal applications.

### Problem Description

Suppose you work at company called Z. 

Z has many API's, dashboards, and tools to help with its operations. The issue is, every one of these apps has its own authentication. This makes it more likely that one of these apps implements authentication incorrectly (which is a security risk). Furthermore any employee would need to remember their login details for every app separately, and if they ever leave the company their account would need to be removed from each app one by one, which is a management headache.

We want to derive a proper centralized alternative. We will do so by starting with a naive approach and incrementally improving it while ensuring the setup remains viable at each step. We repeat until converge to a proper solution.

Disclaimer: each of these "improvements" are generally subjective. Whichever is ideal depends on the specific requirements of the company Z. The goal of this article is to learn how authentication works by applying that knowledge to a specific scenario. For this purpose we aim to present the trade offs as best as possible before making any decision.  

### Initial Setup

To keep things simple we will begin with the following setup. 

- We have 3 apps called A, B, and C.
- Each app has a frontend and a backend. 
- Both the backends and frontends are publicly accessible via the internet.
- The frontend's are **static**. That is, the files that make up the user interface (HTML, CSS, JavaScript, images) are pre-built and delivered to the user's browser exactly as they are stored on the server, without any processing happening at the moment of the request (that is, there is no **server-side rendering**). 
	- Because static frontends are just static files, they can be globally distributed via Content Delivery Networks (CDNs), making them extremely fast to load.
	- A static frontend can still fetch data dynamically using the backend APIs after loading in the browser.
- The backends may also have frontend (visual) components, such as an admin portal, which should be accessible via the browser. These frontend components ARE allowed to rely on server-side rendering.
- Initially, each backend relies fully on **token auth** for their authentication:
	- A user logs in with some user identifier (email or username), and a password (called the **credentials**). The backend validates these credentials, and sends back a token if they are valid. 
	- This token must be sent to the backend on every request in the request header. The backend then verifies whether this token is valid, and what user this token belongs to in order to determine whether the user has the permission to perform the requested operation.

### Opaque vs. Value Tokens

The Initial Setup says every backend hands out a token, but not what that token actually is. There are two options.

- An **opaque token** carries no information at all. It is simply a random identifier that acts as a key into a database. The backend looks up this identifier on every request to find out which user the token belongs to and what permissions they have.
- A **value token** skips that lookup by embedding that same data, the user's identity and permissions, directly inside the token itself, so the backend can read it straight off the token without going to the store at all.
	- When the backend issues a value token, it cryptographically **signs** the embedded data with a key only it holds. On every request, the backend re-verifies the validity of that signature. This prevents the client from being able to edit the value token to imitate another user or elevate their own permissions.
	- A **JSON Web Token** (**JWT**) is simply a signed value token that holds a JSON payload.

The tradeoff:
- Opaque tokens require a database lookup on every request, value tokens only require validation of the signature, which is generally more efficient.
- Value tokens cannot be revoked, whereas opaque tokens can. Once issued and signed, a value token stays valid until it expires, even if the user's password changes, their permissions are reduced, or the token gets leaked. Opaque tokens require a lookup on every request, but can be revoked instantly and unconditionally, by deleting their record from the store.

In company Z's case, the ability to revoke a token is a hard requirement. We need to be able to cut off an employee who leaves the company, or react to a leaked token. Value tokens simply can't do that without adding some list of revoked tokens, which just reintroduces the same lookup opaque tokens already do directly. 

### Centralized Auth Service

To solve the decentralized authentication issue, we introduce one new component, the **Auth Service**. This is simply a backend whose only responsibility is authentication. It stores credentials, validates logins, issues tokens, and provides the ability to validate tokens.

Suppose a user is interacting with app A. 
- **Login**: A user on app A's frontend logs in using their credentials. Instead of sending them to App A's backend, the frontend sends them straight to the Auth Service. The Auth Service validates them, creates a new token, then returns this token to the user.
- **Subsequent requests**: the frontend attaches this token to every request it makes to App A's backend, exactly as before. How the backend validates this token depends on the type of token being used.
	- Value Token: App A's backend verifies the token's signature itself, locally, using a public key the Auth Service publishes for this purpose. No request to the Auth Service is needed at all.
	- Opaque Token: App A's backend forwards the token to an Auth Service endpoint, which looks it up and responds with the associated user (and any permissions), or an error if the token is invalid or expired. This is called **introspection**.
- In the case of opaque tokens, this adds a network round-trip to every request across every app, but it means validation, revocation, and user data now live in exactly one place.

Company Z has another requirement: to support gradual migration, as well as specialized authentication for any specific use case, each app's backend should be able to accept both its own locally-issued tokens, and tokens issued by the new Auth Service. The setup we are aiming for should not require all apps to fully migrate over onto the auth service instantly.

### Performance

Validating a token costs something on every single request, and that cost differs by token type and by how the validation is wired up.

- An opaque token costs a store lookup on every request, and once that store lives behind a separate Auth Service, it also costs a network round-trip. 
- A value token costs neither of those. Verifying a signature is a local, in-memory computation, done in microseconds, with no store and no network call involved.

There are a few general ways to bring the cost of an opaque token down, without switching to a value token outright.

- Move the store closer. Instead of routing every validation through an HTTP call to the Auth Service, expose the token store itself as a shared, low-latency cache (e.g. Redis) that every app backend can query directly. It's the exact same store, so revocation is exactly as instant as before, just reached over a faster path. The cost is coupling: every backend now needs to know the store's schema and location, rather than talking to one clean Auth Service API.
- Go hybrid. Issue a short-lived, signed value token (an "access token") alongside a long-lived opaque token (a "refresh token"). Most requests validate the access token locally, for free. When it expires, the client uses the refresh token to obtain a new one. Revocation now works by revoking the refresh token, which stops new access tokens being minted, but any access token already handed out keeps working until it naturally expires. This is the standard pattern behind OAuth2 access and refresh tokens.
- Cache the introspection result. A backend can cache an opaque token's introspection result locally for a few seconds, cutting out most round-trips at the cost of a revocation delay equal to that cache's TTL.

For company Z, the revocation requirement from "Opaque vs. Value Tokens" largely rules out the hybrid pattern and TTL-based caching, since either would mean a revoked token keeps working for some window of time. Moving the store behind a shared low-latency cache doesn't have that downside, so that's the mitigation we adopt.

### Origins and Sites

As of now, a single login touches several separately-hosted services: App A's frontend, App A's backend, and the Auth Service typically each live at a different address. Talking precisely about how browsers treat requests between these needs a handful of terms.

- A URL's authority breaks down into a **scheme** (`https`), a **host** (`api-a.z.com`), and an optional **port** (`443` by default for `https`). Whatever comes after that is the **path** (`/login`).
- A **domain** is any name in the DNS hierarchy. `com`, `z.com`, `a.z.com`, and `api-a.z.com` are all domains. A **host** is simply the domain that appears in a given URL, identifying which server that URL points to.
- Domain X is a **subdomain** of domain Y, and Y a **superdomain** of X, when X equals Y or X ends in `.` followed by Y. `api-a.z.com` is a subdomain of both `z.com` and `com`. `z.com` is a superdomain of `api-a.z.com`. `a.z.com` and `api-a.z.com` are siblings, neither is a subdomain of the other.
- A **registrable domain** is a domain made of one label plus whatever suffix browsers treat as public, `z.com` (public suffix `com`, label `z`), or `example.co.uk` (public suffix `co.uk`, label `example`). Which suffixes count as public isn't derivable from the domain string alone, `com` is one while `z.com` isn't, so browsers ship a maintained list of them, the Public Suffix List.

With that vocabulary in hand:

- The **origin** of a URL is its scheme, host, and port, taken together. Two URLs share an origin only if all three match exactly. A different subdomain, scheme, or port is already a different origin.
- The **site** of a URL is its registrable domain. Site ignores subdomains, scheme, and port entirely, so `a.z.com` and `auth.z.com` are different origins but the same site, and so are `https://a.z.com` and `http://a.z.com`.
- Origin is strictly the finer-grained of the two. Any pair of URLs that's same-origin is automatically same-site, but not vice-versa.

Concretely: if App A's frontend is served from `a.z.com`, its backend from `api-a.z.com`, and the Auth Service from `auth.z.com`, every request between them is **cross-origin** (different host), but all three are **same-site** (they share the registrable domain `z.com`). A request to or from a domain the company doesn't own, e.g. an attacker's `evil.com`, is **cross-site**.

### Cross-Site Scripting (XSS)

We revisit the token-in-header approach:

- For App A's frontend to attach the token to every request, its JavaScript has to be able to read the token, so it has to sit somewhere JS can reach, such as `localStorage`.
- **Cross-Site Scripting (XSS)** is when an attacker gets their own JavaScript to run on App A's frontend, for example by injecting a script through unescaped user input that later gets rendered on the page, or through a compromised third-party script the page loads.
- Because that injected script runs inside App A's own frontend, it has exactly the same access as A's legitimate code, which includes reading `localStorage`. This lets the attacker steal the token outright and replay it to fully impersonate the user, no login step required.
- This motivates moving the token somewhere the page's own JavaScript can't read at all, which is exactly what the next section is about.

### Cookies

- A **cookie** is a small piece of data a server asks the browser to store, via a `Set-Cookie` response header, scoped to a given origin or site. The browser then automatically attaches matching cookies to every later request there, regardless of which page triggered that request, and regardless of whether that page's JavaScript can read the cookie at all.

### Cross-Site Request Forgery (CSRF)

- That automatic, JS-independent attachment is exactly what would protect a cookie-stored token from the XSS theft described above, but it introduces a different problem. Because the browser attaches matching cookies to a request no matter which page triggered it, a malicious page on `evil.com` can trigger a request to App A's backend (say, via an auto-submitting form), and the browser will still attach the user's App A cookie, exactly as if the request had come from App A's own frontend.
- This is **Cross-Site Request Forgery (CSRF)**: the attacker's page forges a state-changing request that rides along on the victim's already-authenticated session, without ever needing to see or steal the token itself.
- This wasn't a risk with the original Authorization-header approach: a malicious page has no way to read the token out of `localStorage` cross-origin, so it has nothing to attach as a header. Moving the token into a cookie to fix XSS theft reopens this new risk, which we still need to close.

### Cross-Origin Resource Sharing (CORS)

- Separately from CSRF, browsers enforce a default same-origin policy for JavaScript: a script running on origin X cannot read the response of a request it makes to a different origin Y, even though the browser sends that request (and any cookies) anyway. Without this restriction, a malicious page could ride on the victim's ambient cookies to call App A's backend and freely read back whatever sensitive data comes back.
- **Cross-Origin Resource Sharing (CORS)** is how a server selectively relaxes that restriction: by returning headers such as `Access-Control-Allow-Origin` (which origins may read the response) and `Access-Control-Allow-Credentials` (whether that still holds when the request carries cookies), a backend tells browsers exactly which other origins are let in.
- Concretely, App A's backend at `api-a.z.com` must return CORS headers allowlisting `a.z.com`, or the frontend's JavaScript won't be able to read any of the backend's responses, despite being same-site.
- CORS and CSRF are easy to conflate but solve different problems. CORS is about whether a cross-origin script may *read* a response. CSRF is about whether a cross-site request should be allowed to *happen* at all. A permissive CORS policy doesn't cause CSRF, and a strict one doesn't prevent it. Plenty of state-changing requests, plain HTML form submissions in particular, aren't even subject to CORS checks in the first place.

### Cookie Attributes

To actually fix both XSS theft and CSRF, we need finer control over a cookie than "store this, send it back."

- `HttpOnly` marks a cookie invisible to JavaScript entirely: `document.cookie` cannot read it. This is what fixes the XSS token-theft problem: even if an attacker's script runs on our origin, it cannot read an `HttpOnly` cookie's value.
- `Secure` means the cookie is only ever sent over HTTPS, never plaintext HTTP, protecting it from network eavesdroppers.
- `SameSite` controls whether the cookie is attached to cross-site requests at all:
	- `None` sends the cookie on every request, same-site or not (and must be paired with `Secure`). This is the CSRF-vulnerable behavior described above.
	- `Lax` withholds the cookie on cross-site subrequests (forms, fetches, images triggered by another site), but still sends it on top-level cross-site navigation via a safe method like clicking a link, so a link into the app from an email still works while logged in, but a forged form submission from `evil.com` no longer carries the cookie.
	- `Strict` withholds the cookie on every cross-site request, including top-level navigation. This is the strongest setting, at the cost that following a link from outside the site initially looks logged out.

### Moving the Token into a Cookie

- Move the opaque token out of `localStorage` and into a cookie marked `HttpOnly` and `Secure`, with `SameSite=None` for now. This closes the XSS theft path from earlier, but `SameSite=None` still attaches the cookie to every cross-site request, so CSRF remains open. If we were shipping this as a final state we'd need a separate mitigation (e.g. a CSRF token unaffected by automatic cookie attachment) alongside it. But this step is deliberately not our final state.

### Restricting SameSite

- Change the cookie's `SameSite` from `None` to `Lax`. This closes the CSRF gap left open by the previous step without any separate CSRF-token machinery. We pick `Lax` over `Strict`, since these are still browser sessions employees expect to follow links into (a shared Slack link, a notification email) while already logged in, and `Strict` would log them out of that navigation.

### Cookies vs. Machine Tokens

- We use cookies (`HttpOnly`, `Secure`, `SameSite=Lax`) for anything running in a browser, since only a browser has a cookie jar, a DOM an XSS payload can run in, and ambient cross-site requests to worry about in the first place.
- For scripts and machine users (CI pipelines, service-to-service calls, CLI tools), none of that applies: there's no browser, no DOM, no cookie jar. We keep using a bearer opaque token attached manually in an `Authorization` header, which is also simpler for that kind of client to manage, since it needs no cookie handling at all.

### Single Sign-On

Even with a centralized Auth Service, we're still fully on the hook for storing passwords, enforcing password policies, building password-reset flows, and ideally multi-factor authentication. This is a lot of undifferentiated, security-critical work that has nothing to do with what apps A, B, and C actually do.

- A **Single Sign-On (SSO) provider** is a service that authenticates a user once and lets that single authentication carry over to any number of separate applications, instead of each application authenticating the user on its own.
- The mechanism behind this is a redirect-based handoff. When an application needs to know who the user is, it redirects the user's browser to the SSO provider instead of showing its own login form. The provider authenticates the user directly, or, if the user already has an active session with the provider (typically a cookie scoped to the provider's own origin), skips straight past that step. Either way, the provider then redirects the browser back to the application, along with proof of the user's identity. The application, on receiving that redirect, validates the proof and now knows who's logged in. Two concrete protocols implement this same shape, OIDC and SAML. The proof is typically an authorization code the application exchanges for a signed token, or a signed assertion, respectively.
- This handoff is exactly what makes it "single" sign-on. Because the session the user authenticates lives at the provider's own origin, any number of unrelated applications can redirect there and all reuse that one session, without the user having to log in again at each one.
- An SSO provider's own job, generally, is to be the one authoritative place identity actually lives. It holds (or federates further upstream to, e.g. an existing LDAP or Active Directory) the user directory and credentials, enforces policies like multi-factor authentication uniformly, and exposes all of it behind the protocol above, so every application redirecting to it gets these guarantees for free, without implementing any of it itself.
- For company Z, our Auth Service is one such application. Instead of checking a password itself, it redirects the user to Z's SSO provider (e.g. Google Workspace, Microsoft Entra ID, or Okta), and once it gets identity proof back, issues one of our own tokens exactly as before. Because this only changes how the Auth Service confirms identity, nothing downstream changes: apps A, B, and C keep validating tokens exactly as before.
- This does mean login for every internal app now depends on the SSO provider's availability, and account lifecycle is controlled by whoever manages that directory. That's an acceptable trade for Z, since employee identity is already centralized there for other purposes anyway. An employee gains access to every app the moment they're added to it, and loses access to everything the moment they're removed, without us maintaining any of that ourselves.

### Auth Service: Build vs. Buy

None of the above says who actually writes and runs the Auth Service itself. Once an application needs something that federates to an SSO provider and issues its own tokens, there are, generally, three ways to get one.

- Build it. Write the Auth Service from scratch, with its own credential and token store, its own SSO redirect handling, and its own introspection endpoint. Full control over exactly how it behaves, at the cost of re-implementing a lot of well-trodden, security-critical machinery (session handling, token revocation, key rotation for signed tokens) that has little to do with what makes company Z's apps distinct.
- Buy it, or rather, self-host it. Deploy existing, mature Identity and Access Management (IAM) software, such as Keycloak, and configure it to federate to the external SSO provider. This gets a battle-tested implementation of everything above immediately, along with native support for federating to multiple different SSO protocols, at the cost of one more piece of infrastructure to run, upgrade, and keep highly available.
- Skip it. Don't build an intermediary Auth Service at all, and have every app validate the SSO provider's own tokens directly. Fewest moving parts, but no central place to add Z-specific claims or permissions on top of whatever the provider natively exposes, no revocation guarantees beyond whatever the provider itself offers, and every app is now coupled directly to that one specific provider.

For company Z, the instant-revocation requirement and the introspection model already built into "Centralized Auth Service" both assume an Auth Service that we control. So we don't skip it, and we don't build it by hand either. We deploy an existing IAM system, such as Keycloak, and configure it to federate to Z's SSO provider. This is the concrete "how" behind the box this article has been calling the Auth Service all along. Every earlier section (opaque tokens, introspection, gradual per-app migration) still holds exactly as written.

### Network Protection: VPN-Only Access

Apps A, B, and C are internal company tools, so exposing them to the entire internet is more surface area than we need, on top of everything above. We restrict access to Z's corporate VPN.

- Option 1: IP allowlist: keep the apps deployed exactly as in the Initial Setup, publicly routable, but configure their firewalls to only accept connections from the VPN gateway's exit IP. Minimal infrastructure change, but the apps are still, technically, internet-facing: their DNS resolves publicly and their TLS endpoint is reachable by anyone, protected only by an IP filter that could be misconfigured or bypassed by anything able to appear to originate from that address.
- Option 2: VPN into the network: configure the VPN so that once connected, a client's traffic is routed directly into the company's private network, and deploy the apps' backends (and any server-rendered admin portals) with no public route at all, reachable only from inside that network. This removes the public attack surface entirely rather than filtering it, at the cost of a larger one-time infrastructure change: a VPN gateway actually attached to the private network, and careful routing so only the intended traffic uses the tunnel. The static frontends hold no secrets and can still be served publicly via a CDN as before. Only the backends need to move behind the VPN.
