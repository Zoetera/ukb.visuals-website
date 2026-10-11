# Static hosting security

The Contact + Suggestions section opens the visitor’s email, Instagram, phone, or WhatsApp app directly. The site does not collect or submit contact messages.

## Response headers

The page’s Content Security Policy is defined in the meta policy in `index.html`. Configure the equivalent policy as an HTTP response header at the static host, and add `frame-ancestors 'none'` there (this directive is not available in a meta policy). Keep the policy aligned with the resources used by the site.

Also configure `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and `X-Frame-Options: DENY` where compatible with the CSP.
