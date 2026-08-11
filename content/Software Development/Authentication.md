Towards centralized, simple, and secure authentication for internal applications.

### Problem Description

Suppose you work at a company called Z. 

Z has many APIs, dashboards, and tools to help with its operations. The issue is, every one of these apps has its own authentication. This makes it more likely that one of these apps implements authentication incorrectly (which is a security risk). Furthermore, any employee would need to remember their login details for every app separately, and if they ever leave the company, their account would need to be removed from each app one by one, which is a management headache.

We want to derive a proper centralized alternative. We will do so by starting with a naive approach and incrementally improving it while ensuring the setup remains viable at each step. We repeat this until we converge to a proper solution.

Disclaimer: each of these "improvements" is generally subjective. Whichever is ideal depends on the specific requirements of company Z. The goal of this article is to learn how authentication works by applying that knowledge to a specific scenario. For this purpose, we aim to present the tradeoffs as best as possible before making any decision.  

### Initial Setup

To keep things simple, we will begin with the following setup. 

- We have 3 apps called A, B, and C.
- Each app has a frontend and a backend. 
- Both the backends and frontends are publicly accessible via the internet.
- The frontends are **static**. That is, the files that make up the user interface (HTML, CSS, JavaScript, images) are pre-built and delivered to the user's browser exactly as they are stored on the server, without any processing happening at the moment of the request (that is, there is no **server-side rendering**). 
	- Because static frontends are just static files, they can be globally distributed via Content Delivery Networks (CDNs), making them extremely fast to load.
	- A static frontend can still fetch data dynamically using the backend APIs after loading in the browser.
- The backends may also have frontend (visual) components, such as an admin portal, which should be accessible via the browser. These frontend components ARE allowed to rely on server-side rendering.
- Initially, each backend relies fully on **token auth** for its authentication:
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
- Origin is strictly the finer-grained of the two. Any pair of URLs that's same-origin is automatically same-site, but any pair of URLs that is same-site is not guaranteed to be same-origin.

Concretely: if App A's frontend is served from `a.z.com`, its backend from `api-a.z.com`, and the Auth Service from `auth.z.com`, every request between them is **cross-origin** (different host), but all three are **same-site** (they share the registrable domain `z.com`). A request to or from a domain the company doesn't own, e.g. an attacker's `evil.com`, is **cross-site**.

### Cookies

Handing the client a piece of data to hold onto, then getting it back on every subsequent request, is an extremely common need on the web. So far, for our token, we've built that by hand: return in a response body, store in `localStorage`, then attach manually as a header on every call. Browsers provide a native mechanism for exactly this need, instead of every site reinventing it: the cookie.

A **cookie** is a small piece of data a server asks the browser to store, via a `Set-Cookie` response header. The browser then automatically attaches matching cookies to later requests. 

Cookies have several independent attributes that can be set by the server to configure their behaviour:
- **Domain** controls which hosts the cookie is sent to by the client.
	- If the server omits the attribute, the cookie is **host-only**, restricted to the exact host that set it. A cookie set by `api-a.z.com` with no `Domain` attribute is only ever sent back to `api-a.z.com`, never to `a.z.com`, `auth.z.com`, or even `www.api-a.z.com`.
	- Setting `Domain=z.com` explicitly instead widens it to every subdomain of `z.com` at once, e.g. `a.z.com`, `api-a.z.com`, `auth.z.com`. 
	- A server can only set the domain attribute to its own host or a proper registrable superdomain of it, never a sibling subdomain, never an unrelated site. For example: `auth.z.com` may set a cookie scoped to itself or to `z.com`, but not to `api-a.z.com` (a sibling, not a superdomain) or to `evil.com`. 
	- Browsers also refuse a bare public suffix like `com`, via a hardcoded Public Suffix List, so nobody can widen a cookie far enough to reach every unrelated domain under it.
	- This setting ignores scheme (HTTPS vs HTTP) and port entirely.
- **Path** narrows within a host. It defaults to the path of the response that set the cookie, and a request only carries the cookie if its own path falls under it.
- **Secure** restricts the channel. A `Secure` cookie is only ever sent over HTTPS, never plaintext HTTP, protecting it from network eavesdroppers.
- **SameSite** controls whether a cookie crosses site boundaries at all, in either direction. To understand it, we need three parties: (1) the **backend** that is trying to set or read the cookie, (2) the **browser** holding the cookie jar and enforcing the rules, and (3) whichever site actually **initiated** the request that reached that backend. SameSite compares that initiating site against the backend's site, using the same-site and cross-site distinction from "Origins and Sites":
	- `None` exchanges the cookie regardless of whether the initiator is same-site or cross-site (and must be paired with `Secure`).
	- `Lax` blocks the exchange, in both directions, on cross-site subrequests, but still allows it on a top-level cross-site navigation via methods that are deemed "safe" like clicking a link.
	- `Strict` blocks the exchange in every cross-site context, including top-level navigation. This is the strongest setting, at the cost that following a link from outside the site initially looks logged out.
- **HttpOnly** doesn't change when the cookie is sent, only who can see it. It marks the cookie invisible to JavaScript entirely. The cookie is just sent automatically with every request depending on the aforementioned rules. 

Taken together, each attribute determines an independent condition, not a substitute for the others. That is, the browser attaches a stored cookie to an outgoing request exactly when the request's host matches its `Domain`, the request's path falls under its `Path`, the request is HTTPS if the cookie is `Secure`, and the request satisfies the cookie's `SameSite` rule, all of it at once. `HttpOnly` plays no part in that decision. It only gates JavaScript's read access, never the browser's own send behaviour.

### Cross-Site Scripting (XSS)

We revisit the token-in-header approach:

- For App A's frontend to attach the token to every request, its JavaScript has to be able to read the token, so it has to sit somewhere JS can reach, such as the browser's `localStorage`.
- **Cross-Site Scripting (XSS)** is when an attacker gets their own JavaScript to run on App A's frontend, for example by injecting a script through unescaped user input that later gets rendered on the page, or through a compromised third-party script the page loads.
- Because that injected script runs inside App A's own frontend, it has exactly the same access as A's legitimate code, which includes reading `localStorage`. This lets the attacker steal the token outright and use it later to fully impersonate the user.
- Storing the token in a cookie with `HttpOnly` would prevent this issue since the JavaScript cannot actually read the token from the cookie. 

### Cross-Site Request Forgery (CSRF)

The automatic attaching of cookies to requests can also come with certain risks. Whenever a malicious page on `evil.com` triggers a request to App A's backend, and the cookie's `SameSite` is `None`, the browser attaches the user's App A cookie exactly as if the request had come from App A's own frontend.

This is called **Cross-Site Request Forgery (CSRF)**. The attacker's page forges a state-changing request that USES the victim's existing cookie directly, without ever needing to see or steal the token itself.

This wasn't a risk with the original token-in-header approach. A malicious page has no way to read the token out of `localStorage` cross-origin, so it has nothing to attach as a header. Moving the token into a cookie fixes XSS theft but opens the risk of CSRF.

### Cross-Origin Resource Sharing (CORS)

Separately from CSRF, browsers enforce a default same-origin policy for JavaScript: a script running on origin X cannot read the response of a request it makes to a different origin Y, even though the browser sends that request (and any cookies) anyway. Without this restriction, a malicious page could ride on the victim's ambient cookies to call App A's backend and freely read back whatever sensitive data comes back.

**Cross-Origin Resource Sharing (CORS)** is how a server selectively relaxes that restriction: by returning headers such as `Access-Control-Allow-Origin` (which origins may read the response) and `Access-Control-Allow-Credentials` (whether that still holds when the request carries cookies), a backend tells browsers exactly which other origins are let in.

Concretely, App A's backend at `api-a.z.com` must return CORS headers allowlisting `a.z.com`, or the frontend's JavaScript won't be able to read any of the backend's responses, despite being same-site.

CORS and CSRF are easy to conflate but solve different problems. 
- CORS is about whether a *cross-origin* script may *read* a response. 
- CSRF is about whether a *cross-site* request should be allowed to *happen* at all. 

### Moving the Token into a Cookie

Now we know how cookies work, as well as the three most common security concepts XSS, CSRF and CORS, we attempt to make a decision on how to properly set, store and send the tokens within company Z.

We move the token out of `localStorage` and into a cookie with settings:
- `HttpOnly` to prevent XSS
- `Secure` to prevent eavesdropping
- `SameSite` set to `Lax` to prevent CSRF without any separate CSRF-token machinery. We pick `Lax` over `Strict`, since these are still browser sessions employees expect to follow links while already logged in, and `Strict` would prevent them from that kind of navigation.

However, we ONLY use these cookies (with `HttpOnly`, `Secure`, `SameSite=Lax`) for anything running in a browser, since only a browser has a cookie jar and actually needs to worry about the aforementioned nuances (CSRF, XSS, and CORS protection).

For scripts and machine users (CI pipelines, service-to-service calls, CLI tools), none of that applies. In this case, we can just keep using the token-in-header approach, which is also generally simpler to manage.

### Network Protection: VPN-Only Access

Apps A, B, and C are internal company tools. They will only ever be used by employees. A simple way to instantly reduce security risks is to restrict access of the company tools to Z's corporate VPN.

To implement this, we have two options:

1. **IP allowlist**: keep the apps deployed exactly as in the Initial Setup, publicly routable, but configure their firewalls to only accept connections from the VPN gateway's exit IP.
2. **VPN into the network**: configure the VPN so that once connected, a client's traffic is routed directly into the company's private network, and deploy the apps' backends (and any server-rendered admin portals) with no public route at all, reachable only from inside that network. 

The latter is generally more secure, but the former is generally easier to set up.

The static frontends hold no secrets and can still be efficiently served publicly via a CDN as before. Only the backends need to move behind the VPN.

### Single Sign-On

**Single Sign-On (SSO)** is the property that a user has exactly one set of login credentials, and logging in once with them instantly logs that user into every other related application, with no separate login screen anywhere else. 

A simple example is Google's products. For YouTube, Gmail, Google Drive, Google Calendar, etc., you only need to log in on one app, and you are automatically logged in to all others. 

A **Single Sign-On (SSO) provider** is the service that provides single sign-on capabilities and can be freely integrated into your application.

- When an application needs to know who the user is, it redirects the user's browser to the SSO provider instead of showing its own login form.
- The provider authenticates the user directly, or, if the user already has an active session with the provider (typically a cookie scoped to the provider's own origin), skips straight past that step.
- The provider then redirects the browser back to the application, along with proof of the user's identity. The application validates that proof and then knows exactly who's logged in.

This handoff delivers "log in once, instantly logged in everywhere" from the previous section. Because the session lives at the SSO provider's own origin, any number of completely unrelated applications can redirect there and all reuse that one session, without the user logging in again at each one, and without these applications needing to share anything.

### Final Setup

We now take a shot at formalizing the final setup.

1. For browser auth we use cookies with `SameSite=Lax`, `Secure`, and `HttpOnly`.
2. For other auth we keep using tokens in request headers.
3. The aforementioned forms of authentication should be provided using a single auth service relying on opaque tokens, and some method of making introspection fast.
4. Each individual app should still be able to have its own authentication independent of the centralized auth.
5. Furthermore, we want single sign on. A user should only need to log in to one app, and automatically be logged into all others.
6. We get single sign on from the redirect handshake described in the "Single Sign-On" section, with our own Auth Service acting as the provider. The Auth Service holds one session cookie scoped to its own host. Each app holds a separate session cookie, also scoped to its own host. No cookie is ever widened to the registrable domain.
	- We do it this way, rather than by sharing one cookie across the whole site, because same-site is not the same as same-origin. A cookie widened to `z.com` is attached to requests initiated by ANY subdomain of `z.com`, so an attacker able to run scripts on any one company app could drive authenticated requests to all the others, and `SameSite=Lax` would not stop it, since those requests are same-site. Keeping every cookie host-only removes that risk entirely.
7. To allow for easier load-balancing and centralized security, we place a single gateway in front of all backends (including the Auth Service), and forward requests to each app's backend based on path.
8. The VPN protection is then applied directly to this app gateway, instead of on each app's backend independently. The backends get no public route at all, so the gateway is the only way to reach them.
9. The static frontends keep being served through a CDN, and each frontend gets its own subdomain, e.g. `a.z.com`. A subdomain per app is also what colleagues expect, since a different host reads as a different application.
10. The edge that serves those static files is also the entry point to the gateway. Per app we route on host and path together, so `a.z.com/*` serves app A's static files from the edge, and `a.z.com/api/*` forwards to the gateway. The gateway still forwards on path exactly as in 7., so the edge only has to rewrite `a.z.com/api/...` into the gateway's own path for app A.
11. As a consequence of 10., each frontend is same-origin with its own backend. No CORS configuration is needed for an app to call its own backend, there are no preflight requests, and the auth cookie stays scoped to the single host the user actually visits. Together with 1. and 6. this also means we need no separate CSRF token machinery, for the reasons in "Moving the Token into a Cookie".
	- The backends are no longer same-origin with each other, which is fine, because single sign on comes from 6. and does not depend on it. If one app's frontend ever needs to call another app's backend directly, that specific call is cross-origin again and does need CORS.
12. Because a frontend and its API now sit on the same host but under different paths, the VPN restriction from 8. can be applied to `a.z.com/api/*` while `a.z.com/*` stays public. The static files keep the public CDN delivery from 9., and the API is never publicly routable.
13. To simplify the backends it could be possible to configure the gateway to handle the introspection automatically, and include the resulting details in headers when proxying the request to the backend. To ensure other requests cannot fake these same headers they need to be removed before proxying.
	- To ensure all other auth still works, this should be optional: the introspection logic should only trigger when a token actually meant for our Auth Service is present, distinguishable by its own format or scheme, for example a dedicated cookie name or a reserved `Authorization` prefix. An immediate forward should happen otherwise, leaving value tokens and each app's own locally-issued tokens for that backend to verify itself, exactly as before.
	- This requires a gateway we run ourselves, such as nginx with `auth_request` or Envoy with `ext_authz`. Managed gateways route, cache and terminate TLS, but offer no way to call out to an auth service in the middle of a request. It also relies on the backends being unreachable except from the gateway, which 8. already gives us.
	- The alternative is to centralize the logic in a shared library that every backend imports, instead of in the gateway. The decision and the revocation still live in exactly one place, the Auth Service. This costs us a redeploy per backend whenever the logic changes, and gains us backends that need no gateway in order to run or be tested, and no faked-header risk to defend against at all. Which of the two is better depends on how many backends there are, and how often the auth logic changes.
14. Either way, the gateway, the Auth Service and its token store should be co-located. A reasonable constraint is <50ms for authentication, and a single region hop between any two of them already costs 20 to 25ms, so this is a requirement rather than an optimization.
15. The one piece none of this touches: how the Auth Service itself verifies a login, the `Login` step from "Centralized Auth Service", is a pluggable **login method**, not something wired into any of the above. It can check a password against its own store directly, or redirect out to an external SSO provider and accept the identity proof it gets back instead. Either way, once that one step succeeds, everything downstream (opaque token issuance, the host-only cookies, the gateway) proceeds identically. Swapping the login method doesn't touch anything else in this setup.


### Recommended Video 

I believed this video was really good at resolving confusion.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iX8g4LqF8p8?si=8SJh8fV-GbqrcV1m" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>