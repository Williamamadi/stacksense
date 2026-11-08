import { useState } from "react";

export default function CodeBlock({ code }) {

  const [copied, setCopied] = useState(false);

  async function copy() {

    try {

      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => setCopied(false), 1500);

    } catch {

      setCopied(false);

    }

  }

  return (
<div className="code-wrap">
<button type="button" className="copy-btn" onClick={copy}>

        {copied ? "Copied" : "Copy"}
</button>
<pre>
<code>{code}</code>
</pre>
</div>

  );

}
 