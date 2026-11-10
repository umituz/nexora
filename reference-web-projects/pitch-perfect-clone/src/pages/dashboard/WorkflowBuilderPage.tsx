import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { generateId } from "@/lib/calculations";
import type { WorkflowStep } from "@/lib/types";

export default function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("manual");
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: generateId(), type: "send_sms", config: { message: "" } },
  ]);

  const addStep = (type: WorkflowStep["type"]) => {
    setSteps([...steps, { id: generateId(), type, config: {} }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!name) { toast.error("Please enter a workflow name"); return; }
    toast.success("Workflow saved!");
    navigate("/dashboard/workflows");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Workflow Builder</h1><p className="text-sm text-muted-foreground">Build automated SMS sequences</p></div>
      </div>
      <Card><CardHeader><CardTitle>Workflow Settings</CardTitle></CardHeader><CardContent className="space-y-4">
        <div><Label>Workflow Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome New Leads" /></div>
        <div><Label>Trigger</Label>
          <Select value={trigger} onValueChange={setTrigger}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="tag_applied">Tag Applied</SelectItem>
              <SelectItem value="contact_created">Contact Created</SelectItem>
              <SelectItem value="reply_received">Reply Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-foreground">Steps</h3>
        {steps.map((step, i) => (
          <div key={step.id}>
            <Card><CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{i + 1}</div>
                <span className="text-sm font-medium text-foreground capitalize">{step.type.replace("_", " ")}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </CardContent></Card>
            {i < steps.length - 1 && <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-muted-foreground" /></div>}
          </div>
        ))}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => addStep("send_sms")}>+ Send SMS</Button>
          <Button variant="outline" size="sm" onClick={() => addStep("wait")}>+ Wait</Button>
          <Button variant="outline" size="sm" onClick={() => addStep("add_tag")}>+ Add Tag</Button>
          <Button variant="outline" size="sm" onClick={() => addStep("condition")}>+ Condition</Button>
        </div>
      </div>

      <div className="flex gap-3"><Button onClick={handleSave} className="flex-1">Save Workflow</Button><Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button></div>
    </div>
  );
}
