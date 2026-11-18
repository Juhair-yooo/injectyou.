# inJectyou

A responsive website design prototype for a platform that connects company projects with interns through a platform administrator.

## Preview locally

From this directory, start the bundled local-only preview server with Node.js:

```sh
node serve.mjs
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The bundled server binds only to the local computer. Use an HTTP server rather than opening `index.html` directly: the prototype loads JavaScript modules.

## Design scope

- Public website and entry points for interns and companies.
- Intern workspace for project discovery, applications, work, and progress.
- Company workspace for briefs, delivery review, and project status.
- Admin workspace for the handoffs between companies and interns.

Each workspace has a separate sign-in preview. Admin is absent from public signup, and there is no role switcher inside the dashboards. The session gate is a **prototype navigation control**, not authentication or authorization. All names, project records, amounts, and outcomes are illustrative demo content. Company billing and intern fees are presented separately in their respective views, but a client-side prototype is not a secure place to store private information. Exit workspace clears the preview role for this tab.

This is the design stage. It does not provide production accounts, server-side access control, real identity verification, payment processing, actual project delivery, or a production database. Do not enter real passwords, payment details, or identity documents. Any simulated submission or payment changes only the prototype state.

## Source and hosting

The website uses static HTML, CSS, and JavaScript, with relative asset paths and hash navigation. It needs no dependency installation or build step.

Keep this source in a **private GitHub repository**, as requested. Do not enable public hosting for this design stage. Real private admin and user accounts require a backend with server-side authorization before launch. Hash routes remain on the same entry document, so a later static design preview would not require server route rewrites; that does not provide access security.

## Validation

With Node.js installed, run:

```sh
node validate.mjs
```

This checks local asset/import references, JavaScript syntax, the product name, and accidental external runtime dependencies. It is not a substitute for checking responsive layouts and interactions in a browser.

Before production, implement and test server-side permissions, authentication, storage, company verification, submission handling, payment workflows, certificate verification, and the relevant operating policies.
