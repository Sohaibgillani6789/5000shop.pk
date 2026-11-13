 Vercel Deployment Coding-Agent Prompt
## Objective
Deploy this application to Vercel so it can be opened and tested on real mobile phones. Work in the current repository and make the smallest reliable changes needed for a production-like Vercel preview deployment. Do not guess the framework, commands, routes, environment variables, or database configuration: inspect the repository first.
The final result must include:
- A successful Vercel deployment or a clearly documented blocker.
- A shareable Vercel URL suitable for mobile testing.
- A repeatable deployment process documented in the repository.
- No secrets committed to source control.
- Existing local development and production behavior preserved.
## Required workflow
### 1. Inspect the repository before editing
Identify:
- The application framework and version: Next.js, Vite, React, Vue, Svelte, Nuxt, Remix, Astro, or another framework.
- The package manager from the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, or `bun.lockb`).
- The package scripts in `package.json`, especially `dev`, `build`, `start`, `lint`, `test`, and `typecheck`.
- The correct output directory and whether the app is a static site, server-rendered app, or full-stack app.
- Existing `vercel.json`, framework configuration, Docker files, CI workflows, `.env*` files, and README instructions.
- Client-side routes, API routes, server actions, middleware, image handling, and any runtime-specific code.
- Required environment variables and external services.
- Whether a database, authentication provider, file storage, payments, email, maps, or other third-party service is required.
Do not expose or print secret values. Read only variable names and safe configuration metadata. Never commit `.env`, `.env.local`, tokens, private keys, credentials, or production secrets.
### 2. Establish a clean local baseline
Use the repository's existing package manager. Install dependencies only when required and use the lockfile. Run the smallest relevant checks before changing deployment configuration:
```text
install dependencies using the detected package manager
run lint if available
run typecheck if available
run tests if available
run the production build
```
Record failures accurately. Fix failures caused by deployment configuration or by the changes made for Vercel, but do not rewrite unrelated application code.
### 3. Prepare the application for Vercel
Configure only what the inspected project requires:
- Use Vercel's native framework detection whenever it works.
- Add `vercel.json` only when required for routing, headers, redirects, functions, build settings, or another verified need.
- Preserve the existing package manager and build command unless there is a concrete reason to change it.
- Ensure the build command is deterministic and does not require an interactive prompt.
- Ensure the correct Node.js version is declared if the project requires one, using the repository's established conventions.
- For a single-page application, configure a safe history fallback only if the framework does not already provide it. Do not route API paths or static assets to the HTML fallback.
- For serverless/API handlers, verify that the framework's supported Vercel conventions are used and that secrets are accessed only through environment variables.
- For Next.js or another framework with image optimization, verify remote image hosts and image configuration rather than disabling optimization broadly.
- For server-side code, verify that filesystem writes, long-lived processes, local files, sockets, and unsupported native dependencies are not assumed to persist in serverless execution.
- For database access, use the existing provider's serverless-compatible connection approach and do not add a new database unless explicitly required.
- Make public/client-exposed environment variables follow the framework's required prefix convention. Keep server-only variables server-side.
- Add or update deployment documentation without including secret values.
Avoid adding unnecessary dependencies, changing UI behavior, weakening authentication, disabling security controls, or hard-coding a deployment URL.
### 4. Validate the production build locally
Run the exact build command Vercel will use. If possible, run the production server locally and verify:
- The home page loads.
- Every primary navigation route loads directly when opened by URL.
- Refreshing a client-side route works.
- API requests return the expected status and response shape.
- Authentication and protected routes behave correctly.
- Forms, uploads, payments, and other critical flows fail visibly and safely when configuration is missing.
- Static assets, fonts, images, icons, and metadata load without 404s.
- No browser console errors or failed network requests are introduced.
Do not claim success based only on a successful compilation; exercise the application.
### 5. Configure Vercel safely
Prefer the official Vercel CLI or the repository's existing deployment integration. If the CLI is unavailable, install it only when appropriate and do not modify application dependencies just to install a global CLI.
Before deploying:
1. Confirm the user is authenticated with Vercel or explain the exact login step needed.
2. Link the local project to the intended Vercel project, asking for the team/project choice if it is ambiguous.
3. Confirm the framework, root directory, build command, output directory, and install command.
4. Configure required environment variable names for the relevant environment.
5. Do not upload or display secret values in logs, commits, chat messages, or documentation.
6. Use a Preview deployment first unless the user explicitly requests production.
If a required secret or external service cannot be configured automatically, stop before deployment and report the exact variable names and dashboard action needed. Do not invent placeholder secrets that make the deployment appear healthy.
### 6. Deploy and verify
Create a Vercel Preview deployment and capture its URL. After deployment:
- Inspect the deployment and build logs for warnings and errors.
- Open the URL in a browser.
- Test the main user journey.
- Test direct navigation and refresh on representative routes.
- Check browser console and network errors.
- Verify API endpoints and environment-dependent features.
- Confirm HTTPS, responsive layout, viewport behavior, touch targets, keyboard behavior, and mobile overflow.
- Test at least one narrow phone viewport and one larger phone viewport using browser emulation when available.
- If the app requires authentication, verify the login flow on the deployed URL without recording credentials.
- If the deployment fails, diagnose the first actionable error, fix only the root cause, redeploy, and repeat verification.
Do not report a URL until the deployment is reachable and the main flow has been tested.
### 7. Document the result
Update the repository's deployment documentation or README with:
- Prerequisites and required accounts.
- The detected package manager and deployment commands.
- Required environment variable names, without values.
- How to create a Preview deployment.
- How to promote a verified deployment to production.
- How to test the deployment on a phone.
- Known limitations or external-service setup steps.
- The final verification date and deployment URL only if it is non-secret and intended to be shared.
If a new `vercel.json` or other deployment file was added, explain why each setting is necessary.
## Mobile testing checklist
Test the deployed URL on a real phone over cellular or Wi-Fi:
- Open the URL in a private/incognito tab.
- Verify the first render is usable without horizontal scrolling.
- Check the smallest supported phone width.
- Tap every primary navigation control and form control.
- Test the on-screen keyboard with text inputs.
- Check dialogs, dropdowns, menus, sticky elements, and modals.
- Verify images and fonts do not overflow or fail to load.
- Test portrait orientation and, if relevant, landscape orientation.
- Check slow-network behavior and visible loading/error states.
- Confirm authenticated pages do not expose private data through client-side rendering or caching.
Use the browser's responsive emulation for fast feedback, but treat a real-device test as the final check.
## Completion report
At the end, report concisely:
1. Framework and package manager detected.
2. Files changed and the reason for each.
3. Commands run and their outcomes.
4. Vercel project/deployment URL.
5. Environment variables that still require dashboard configuration, listing names only.
6. Mobile flows verified.
7. Any remaining limitation or blocker.
If deployment cannot be completed, do not claim success. Give the first failing command or Vercel error, the likely root cause, the exact next action, and whether the repository is ready to redeploy.
## Agent safety constraints
- Never commit secrets or `.env` files.
- Never print secret values.
- Never delete user data, databases, deployments, or repositories.
- Never force-push or rewrite history.
- Do not change production resources without explicit authorization.
- Do not disable authentication, CORS, CSP, HTTPS, validation, or security checks to make deployment pass.
- Do not silently ignore build warnings, failed tests, failed routes, or missing environment variables.
- Preserve unrelated work already present in the repository.