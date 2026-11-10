
import React, { useState } from 'react';
import Header from '@/components/Header';
import KeywordManager from '@/components/KeywordManager';
import AgendaFeed from '@/components/AgendaFeed';
import { AgendaItemData } from '@/components/AgendaItem';

// Örnek veriler
const initialKeywords = ["Apple", "Bitcoin", "Yeni Yasa", "Teknoloji"];
const initialAgendaItems: AgendaItemData[] = [
  { id: 1, source: "Twitter", title: "Apple, yeni M4 çipini duyurdu, performans beklentilerin üzerinde.", timestamp: "2 dakika önce", link: "https://example.com/news1", verified: true },
  { id: 2, source: "Haber Sitesi", title: "Bitcoin'de sert düşüş: Yatırımcılar endişeli.", timestamp: "5 dakika önce", link: "https://example.com/news2", verified: false },
  { id: 3, source: "Resmi Gazete", title: "Yeni sosyal medya yasası meclisten geçti.", timestamp: "25 dakika önce", link: "https://example.com/news3", verified: true },
  { id: 4, source: "Teknoloji Blogu", title: "Yapay zeka alanında yeni bir dönem başlıyor: GPT-5 iddiaları.", timestamp: "1 saat önce", link: "https://example.com/news4", verified: false },
];


const Index = () => {
    const [keywords, setKeywords] = useState<string[]>(initialKeywords);
    const [agendaItems, setAgendaItems] = useState<AgendaItemData[]>(initialAgendaItems);

    const handleAddKeyword = (keyword: string) => {
        if (!keywords.includes(keyword)) {
            setKeywords(prev => [...prev, keyword]);
        }
    };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 flex flex-col gap-8">
            <KeywordManager keywords={keywords} onAddKeyword={handleAddKeyword} />
          </aside>
          <section className="lg:col-span-2">
            <AgendaFeed items={agendaItems} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
