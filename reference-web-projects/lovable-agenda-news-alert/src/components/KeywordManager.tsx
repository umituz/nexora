
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface KeywordManagerProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({ keywords, onAddKeyword }) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Anahtar Kelimeler</CardTitle>
        <CardDescription>Takip edilecek kelimeleri yönetin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary">{keyword}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Örn: Bitcoin"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}>
            <PlusCircle className="h-4 w-4 mr-2" /> Ekle
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default KeywordManager;
