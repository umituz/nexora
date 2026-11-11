import { useParams, useNavigate, Link } from "react-router-dom";
import { mockConversations, type Conversation } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversations, setConversations] = useLocalStorage<Conversation[]>("dmchamp_conversations", mockConversations);
  const [newMsg, setNewMsg] = useState("");

  const conv = conversations.find((c) => c.id === id);
  if (!conv) return <div className="py-20 text-center text-muted-foreground">Not found. <Link to="/dashboard/conversations" className="text-primary">Go back</Link></div>;

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msg = { id: `m${Date.now()}`, sender: "human" as const, content: newMsg, timestamp: new Date().toISOString(), type: "text" as const };
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, messages: [...c.messages, msg], lastMessage: newMsg, messagesCount: c.messagesCount + 1 } : c));
    setNewMsg("");
    toast.success("Message sent");
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{conv.contactName.split(" ").map((n) => n[0]).join("")}</div>
        <div><p className="font-medium">{conv.contactName}</p><p className="text-xs text-muted-foreground">{conv.channel} · {conv.agentName}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {conv.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === "contact" ? "justify-start" : "justify-end")}>
            <div className={cn("max-w-[70%] rounded-xl px-4 py-2 text-sm", m.sender === "contact" ? "bg-secondary text-foreground" : m.sender === "ai" ? "bg-primary/10 text-foreground" : "bg-primary text-primary-foreground")}>
              <p>{m.content}</p>
              <p className="mt-1 text-[10px] opacity-60">{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {m.sender}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border pt-4">
        <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={sendMessage} className="rounded-lg bg-gradient-primary p-2.5 text-primary-foreground hover:opacity-90"><Send className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
