
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, CheckCircle } from "lucide-react";

export interface AgendaItemData {
  id: number;
  source: string;
  title: string;
  timestamp: string;
  link: string;
  verified: boolean;
}

interface AgendaItemProps {
  item: AgendaItemData;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ item }) => {
    const handleShare = () => {
        console.log(`Link sohbete gönderildi: ${item.link}`);
        // Burada chat entegrasyonu API çağrısı yapılabilir.
    };
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
            <Badge variant={item.verified ? "default" : "secondary"}>{item.source}</Badge>
            {item.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{item.title}</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={handleShare}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Sohbete Gönder
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgendaItem;
