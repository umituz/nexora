import { mockAppointments, type Appointment } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const [appointments] = useLocalStorage<Appointment[]>("dmchamp_appointments", mockAppointments);
  const statusColors: Record<string, string> = { scheduled: "bg-info/10 text-info", completed: "bg-success/10 text-success", cancelled: "bg-destructive/10 text-destructive", "no-show": "bg-warning/10 text-warning" };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Appointments</h1>
      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex-1"><p className="font-medium">{a.contactName}</p><p className="text-xs text-muted-foreground">{a.date} at {a.time} · {a.duration}min · {a.agentName}</p></div>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[a.status])}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
