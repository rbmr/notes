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

### TODO

1. decide between stateless (value tokens) and stateful (opaque tokens). State we are going with opaque tokens to allow for revoking of tokens.

TODO: but not sure about the order:
- Centralized Auth Service (explain exactly how this is integrated by explaining how login works, and by explaining how each subsequent request works), add special requirement that the original forms of authentication should keep working to allow for partial integration. 
- Single Sign On using an external SSO provider.
- meaning of same site, or same origin
- explain cross site scripting
- explain cross site request forgery
- explain cross origin resource sharing
- explain cookie samesite (none, lax, strict), httponly, secure, etc
- explain cookies vs tokens, decide on cookies for browsers, and token auth for scripts and machine users
- network protection: company VPN only access. Decide between just using an allowlist using the VPN's exit ip, and having the VPN terminate inside the actual virtual network. 

note: ensure each term is explained just before it is needed, and no forward references occur, that is, you may not rely on a term before it is explained.

Also split up the switch to cookies into multiple steps such that switching to cookies, and allowing samesite lax / strict become separate steps. 
