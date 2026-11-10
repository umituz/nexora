import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star, Archive, Send } from "lucide-react";
import { useState } from "react";
import { timeAgo, generateId } from "@/lib/calculations";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { inboxMessages, setInboxMessages } = useData();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(inboxMessages[0]?.id ?? null);
  const [newMessage, setNewMessage] = useState("");

  const filtered = inboxMessages.filter(
    (m) => !m.archived && m.leadName.toLowerCase().includes(search.toLowerCase())
  );
  const selectedConversation = inboxMessages.find((m) => m.id === selectedId);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedId) return;
    setInboxMessages((prev) =>
      prev.map((m) =>
        m.id === selectedId
          ? {
              ...m,
              messages: [...m.messages, { id: generateId(), content: newMessage, sender: "user", timestamp: new Date().toISOString(), type: "text" }],
              lastMessageAt: new Date().toISOString(),
              unread: false,
            }
          : m
      )
    );
    setNewMessage("");
  };

  const toggleStar = (id: string) => {
    setInboxMessages((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
  };

  const archiveMessage = (id: string) => {
    setInboxMessages((prev) => prev.map((m) => (m.id === id ? { ...m, archived: true } : m)));
    if (selectedId === id) setSelectedId(filtered.find((m) => m.id !== id)?.id ?? null);
  };

  const markRead = (id: string) => {
    setInboxMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Unified Inbox</h1>
        <p className="text-muted-foreground">Manage all conversations in one place</p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] gap-0 rounded-lg border border-border overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedId(m.id); markRead(m.id); }}
                className={cn(
                  "w-full text-left px-3 py-3 border-b border-border hover:bg-secondary/50 transition-colors",
                  selectedId === m.id && "bg-secondary",
                  m.unread && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <img src={m.leadAvatar} alt="" className="h-9 w-9 rounded-full bg-secondary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm truncate", m.unread && "font-semibold")}>{m.leadName}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(m.lastMessageAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.messages[m.messages.length - 1]?.content}</p>
                  </div>
                  {m.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <img src={selectedConversation.leadAvatar} alt="" className="h-9 w-9 rounded-full bg-secondary" />
                  <div>
                    <p className="text-sm font-semibold">{selectedConversation.leadName}</p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.leadTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStar(selectedConversation.id)} className="rounded p-1.5 hover:bg-secondary">
                    <Star className={cn("h-4 w-4", selectedConversation.starred ? "fill-warning text-warning" : "text-muted-foreground")} />
                  </button>
                  <button onClick={() => archiveMessage(selectedConversation.id)} className="rounded p-1.5 hover:bg-secondary">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    )}>
                      <p>{msg.content}</p>
                      <p className={cn("text-[10px] mt-1", msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {timeAgo(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="resize-none"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                  <Button onClick={handleSend} size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
