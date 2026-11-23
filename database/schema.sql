PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS accounts (
 id INTEGER PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('admin','intern','company')),
 name TEXT NOT NULL, email TEXT UNIQUE, phone TEXT UNIQUE,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','blocked')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(email IS NOT NULL OR phone IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS companies (
 account_id INTEGER PRIMARY KEY REFERENCES accounts(id), contact_name TEXT NOT NULL,
 verification_status TEXT NOT NULL DEFAULT 'pending' CHECK(verification_status IN ('pending','verified','rejected'))
);
CREATE TABLE IF NOT EXISTS fields (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS intern_fields (intern_id INTEGER NOT NULL REFERENCES accounts(id), field_id INTEGER NOT NULL REFERENCES fields(id), PRIMARY KEY(intern_id,field_id));
CREATE TABLE IF NOT EXISTS projects (
 id INTEGER PRIMARY KEY, company_id INTEGER NOT NULL REFERENCES companies(account_id),
 field_id INTEGER NOT NULL REFERENCES fields(id), title TEXT NOT NULL, specification TEXT NOT NULL,
 deadline TEXT, capacity INTEGER NOT NULL DEFAULT 1 CHECK(capacity > 0),
 status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','published','paused','assigned','in_progress','under_review','revision','completed','rejected')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS applications (
 id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id), intern_id INTEGER NOT NULL REFERENCES accounts(id),
 status TEXT NOT NULL DEFAULT 'applied' CHECK(status IN ('applied','assigned','declined','withdrawn')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(project_id,intern_id)
);
CREATE TABLE IF NOT EXISTS assignments (
 id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id), intern_id INTEGER NOT NULL REFERENCES accounts(id),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','cancelled')),
 assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(project_id,intern_id)
);
CREATE TABLE IF NOT EXISTS submissions (
 id INTEGER PRIMARY KEY, assignment_id INTEGER NOT NULL REFERENCES assignments(id), link TEXT, note TEXT,
 status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','revision_requested','forwarded','approved','rejected')),
 submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, CHECK(link IS NOT NULL OR note IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS feedback (
 id INTEGER PRIMARY KEY, submission_id INTEGER NOT NULL REFERENCES submissions(id), author_id INTEGER NOT NULL REFERENCES accounts(id),
 message TEXT NOT NULL, forwarded_by_admin INTEGER NOT NULL DEFAULT 0 CHECK(forwarded_by_admin IN (0,1)),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Money uses integer minor units. Billing and intern fees are separate records.
CREATE TABLE IF NOT EXISTS company_invoices (
 id INTEGER PRIMARY KEY, project_id INTEGER NOT NULL REFERENCES projects(id), amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
 currency TEXT NOT NULL CHECK(length(currency)=3), status TEXT NOT NULL DEFAULT 'unpaid' CHECK(status IN ('unpaid','paid','refunded')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS intern_payouts (
 id INTEGER PRIMARY KEY, assignment_id INTEGER NOT NULL REFERENCES assignments(id), amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
 currency TEXT NOT NULL CHECK(length(currency)=3), status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','withheld')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS certificates (
 id INTEGER PRIMARY KEY, assignment_id INTEGER NOT NULL REFERENCES assignments(id), verification_id TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'valid' CHECK(status IN ('valid','revoked','reissued')),
 issued_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, revoked_at TEXT, revocation_reason TEXT
);
CREATE TABLE IF NOT EXISTS badges (
 id INTEGER PRIMARY KEY, intern_id INTEGER NOT NULL REFERENCES accounts(id), field_id INTEGER NOT NULL REFERENCES fields(id),
 certificate_id INTEGER NOT NULL REFERENCES certificates(id), level TEXT NOT NULL CHECK(level IN ('beginner','intermediate','advanced')),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','revoked')), UNIQUE(certificate_id)
);
CREATE TABLE IF NOT EXISTS audit_log (
 id INTEGER PRIMARY KEY, actor_id INTEGER REFERENCES accounts(id), action TEXT NOT NULL, target_type TEXT NOT NULL,
 target_id INTEGER NOT NULL, details TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_projects_field_status ON projects(field_id,status);
CREATE INDEX IF NOT EXISTS idx_applications_intern ON applications(intern_id,status);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id,submitted_at);
INSERT OR IGNORE INTO fields(name) VALUES ('Design'),('Data analysis'),('Cybersecurity'),('Management');
INSERT OR IGNORE INTO schema_migrations(version) VALUES (1);
COMMIT;
