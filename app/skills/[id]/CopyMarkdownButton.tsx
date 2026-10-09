"use client";

import { useState } from "react";

export default function CopyMarkdownButton({
  name,
  description,
  content,
}: {
  name: string;
  description: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const markdown = `# ${name}\n\n${description}\n\n${content}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy markdown:", error);
      alert("Failed to copy. Please try selecting the text manually.");
    }
  };

  return (
    <button onClick={handleCopy} className="btn btn-sm btn-outline btn-primary w-fit mb-4">
      {copied ? "Copied!" : "Copy Markdown"}
    </button>
  );
}