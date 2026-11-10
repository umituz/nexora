
import React, { useState } from 'react';
import AgendaItem, { AgendaItemData } from './AgendaItem';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AgendaFeedProps {
  items: AgendaItemData[];
}

const AgendaFeed: React.FC<AgendaFeedProps> = ({ items }) => {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredItems = showVerifiedOnly
    ? items.filter(item => item.verified)
    : items;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2 self-end">
        <Switch 
            id="verified-filter"
            checked={showVerifiedOnly}
            onCheckedChange={setShowVerifiedOnly}
        />
        <Label htmlFor="verified-filter">Sadece Doğrulanmış Kaynaklar</Label>
      </div>
      <div className="space-y-4">
        {filteredItems.map(item => (
          <AgendaItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AgendaFeed;
