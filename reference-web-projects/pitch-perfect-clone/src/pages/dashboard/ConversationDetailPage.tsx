import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { formatDateTime, generateId } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConversationMessage } from "@/lib/types";

export default function ConversationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conv = MOCK_CONVERSATIONS.find((c) => c.id === id);
  const [messages, setMessages] = useState<ConversationMessage[]>(conv?.messages || []);
  const [newMsg, setNewMsg] = useState("");

  if (!conv) return <div className="text-center py-12 text-muted-foreground">Conversation not found</div>;

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: generateId(), direction: "outbound", body: newMsg, timestamp: new Date().toISOString(), status: "sent" }]);
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-semibold text-primary">{conv.contactName.split(" ").map(n=>n[0]).join("")}</span></div>
        <div><p className="font-semibold text-foreground">{conv.contactName}</p><p className="text-xs text-muted-foreground">{conv.contactPhone}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[75%] ${m.direction === "outbound" ? "ml-auto" : "mr-auto"}`}>
            <div className={`p-3 rounded-xl text-sm ${m.direction === "outbound" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>{m.body}</div>
            <p className={`text-[10px] text-muted-foreground mt-1 ${m.direction === "outbound" ? "text-right" : ""}`}>{formatDateTime(m.timestamp)}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-4 border-t">
        <Input placeholder="Type a message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
        <Button onClick={handleSend} size="icon"><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
