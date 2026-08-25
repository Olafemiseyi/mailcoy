const fs = require('fs');
let c = fs.readFileSync('src/routes/_authenticated/_shell.domains.$id.tsx', 'utf8');

c = c.replace(/mx1\.mailcoy\.com/g, 'inbound-smtp.us-east-1.amazonaws.com');
c = c.replace(/mx2\.mailcoy\.com/g, 'inbound-smtp.us-east-1.amazonaws.com');
c = c.replace(/_spf\.mailcoy\.com/g, 'amazonses.com');
c = c.replace(/\$\{d\.dkim_selector\}\._domainkey/g, '$._domainkey');

c = c.replace(
  /<StatusPill\n              status=\{d\.verification_status \?\? "pending"\}\n              className="whitespace-nowrap shrink-0"\n            \/>/,
  '<div className="whitespace-nowrap shrink-0"><StatusPill status={d.verification_status ?? "pending"} /></div>'
);

c = c.replace(
  /<StatusPill status=\{r\.status \?\? "pending"\} className="whitespace-nowrap shrink-0" \/>/,
  '<div className="whitespace-nowrap shrink-0"><StatusPill status={r.status ?? "pending"} /></div>'
);

c = c.replace(
  /<StatusPill\n          status=\{status\}\n          className="whitespace-nowrap shrink-0 self-start sm:self-center"\n        \/>/,
  '<div className="whitespace-nowrap shrink-0 self-start sm:self-center"><StatusPill status={status} /></div>'
);

fs.writeFileSync('src/routes/_authenticated/_shell.domains.$id.tsx', c);
