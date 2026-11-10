import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactsImportPage() {
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState("");
  const [imported, setImported] = useState(false);

  const handleImport = () => {
    if (!csvData.trim()) { toast.error("Please paste CSV data"); return; }
    setImported(true);
    toast.success("Contacts imported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Import Contacts</h1><p className="text-sm text-muted-foreground">Import contacts from CSV</p></div>
      </div>
      {imported ? (
        <Card><CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Import Complete</h2>
          <p className="text-muted-foreground mb-4">Your contacts have been imported successfully.</p>
          <Button onClick={() => navigate("/dashboard/contacts")}>View Contacts</Button>
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>CSV Import</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-foreground font-medium mb-1">Drag & drop your CSV file here</p>
              <p className="text-xs text-muted-foreground">or paste your data below</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Expected format: firstName, lastName, phone, email</p>
              <Textarea placeholder="John,Doe,+14155551234,john@email.com" value={csvData} onChange={(e) => setCsvData(e.target.value)} rows={6} />
            </div>
            <Button onClick={handleImport} className="w-full gap-2"><FileSpreadsheet className="w-4 h-4" />Import Contacts</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
