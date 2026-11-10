import { APP_NAME } from "@/constants/app";
import { Cpu, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function McpConfigPage() {
  const [copied, setCopied] = useState("");

  const configs = [
    { name: "Cursor", command: `npx @testsprite/mcp-server --project YOUR_PROJECT_ID` },
    { name: "VS Code", command: `ext install testsprite.mcp-vscode` },
    { name: "Claude Code", command: `claude mcp add testsprite npx @testsprite/mcp-server` },
  ];

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopied(name);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Cpu size={20} className="text-primary" />
          <div>
            <h3 className="font-heading font-semibold text-sm">MCP Server Configuration</h3>
            <p className="text-xs text-muted-foreground">Connect {APP_NAME} to your IDE via Model Context Protocol</p>
          </div>
        </div>

        <div className="space-y-4">
          {configs.map((c) => (
            <div key={c.name} className="border border-border rounded-lg p-4">
              <h4 className="font-heading font-medium text-sm mb-2">{c.name}</h4>
              <div className="flex items-center gap-2 bg-muted rounded p-3">
                <code className="text-xs flex-1 font-heading">{c.command}</code>
                <button onClick={() => handleCopy(c.command, c.name)} className="shrink-0">
                  {copied === c.name ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-muted-foreground" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
