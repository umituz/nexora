
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="px-4 py-3 border-b border-border">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary" />
        <h1 className="text-xl font-bold text-foreground">
          Anlık Gündem Asistanı
        </h1>
      </div>
    </header>
  );
};

export default Header;
