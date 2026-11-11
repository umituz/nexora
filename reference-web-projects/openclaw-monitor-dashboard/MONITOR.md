# OpenClaw Monitor Dashboard - Cloudflare Moltworker Entegrasyonu

## 📋 Özet

Bu proje, Cloudflare Moltworker (https://github.com/cloudflare/moltworker) ile OpenClaw AI asistanının Cloudflare Sandbox container'larında çalıştırılmasını yöneten bir monitor dashboard'udur. Dashboard, moltworker API'si ile entegre olarak gerçek zamanlı sistem sağlık göstergeleri, canlı log akışı ve süreç yönetimi sağlar.

**Deploy URL:** https://99fe72ca.openclaw-monitor-dashboard.pages.dev

---

## ✅ Tamamlanan İşler

### 1. API Entegrasyonu

#### `src/lib/config.ts`
- Moltworker bağlantı yapılandırmasını yönetir
- localStorage ile konfigürasyon saklama
- Environment variable fallback desteği
- URL builder fonksiyonları (auth, debug, websocket için)

```typescript
interface MoltworkerConfig {
  url: string;
  token: string;
  cdpSecret?: string;
}
```

#### `src/lib/api/moltworker.ts`
- Tüm moltworker endpoint'leri için complete API client
- TypeScript tip tanımları:
  - `MoltworkerVersion`: OpenClaw ve Moltbot versiyon bilgileri
  - `MoltworkerProcess`: Çalışan süreçler (id, name, status, cpu, memory, uptime)
  - `MoltworkerLogEntry`: Log girdileri
  - `MoltworkerSystemHealth`: CPU, RAM, Disk, Uptime bilgileri

API Metotları:
- `getVersion()`: Versiyon bilgisi
- `getProcesses()`: Çalışan süreçlerin listesi
- `getLogs(processId, limit)`: Log girdileri
- `getSystemHealth()`: Sistem sağlık göstergeleri
- `restartGateway()`: Gateway yeniden başlatma
- `triggerBackup()`: Yedekleme tetikleme
- `getPairedDevices()`: Eşleşmiş cihazlar

#### `src/lib/hooks/useMoltworker.ts`
React Query tabanlı data fetching hook'leri:

| Hook | Refresh Interval | Açıklama |
|-----|-----------------|----------|
| `useMoltworkerVersion` | 5 dakika | Versiyon bilgisi |
| `useMoltworkerHealth` | 15 saniye | Sistem sağlık göstergeleri |
| `useMoltworkerProcesses` | 10 saniye | Çalışan süreçler |
| `useMoltworkerLogs` | 10 saniye | Log girdileri |
| `useMoltworkerWebSocket` | Real-time | WebSocket bağlantısı |
| `useRestartGateway` | Manual | Gateway restart mutation |
| `useTriggerBackup` | Manual | Backup trigger mutation |

### 2. UI Component Güncellemeleri

#### `src/components/SystemHealthPanel.tsx`
- ✅ Mock data kaldırıldı
- ✅ Real API data entegrasyonu
- ✅ Loading ve error state'leri eklendi
- ✅ CPU, RAM, Disk, Uptime kartları canlı güncelleniyor
- ✅ Grafikler Recharts ile görselleştiriliyor

#### `src/components/LiveFeedPanel.tsx`
- ✅ WebSocket entegrasyonu
- ✅ Bağlantı durumu göstergesi (Bağlı/Bağlanıyor)
- ✅ Auto-reconnect özelliği
- ✅ Mesaj temizleme butonu
- ✅ 3 mesaj tipi: agent, system, warning

#### `src/components/SessionsPanel.tsx` → Süreçler Paneli
- ✅ İsim değişikliği: Sessions → Süreçler
- ✅ Real-time süreç listesi
- ✅ CPU, Memory, Uptime gösterimi
- ✅ Search ve filter fonksiyonelliği
- ✅ Durum filtreleri: Tümü, Çalışıyor, Durduruldu, Hata

#### `src/components/SettingsPanel.tsx`
- ✅ Moltworker konfigürasyon UI'ı
- ✅ Worker URL, Gateway Token, CDP Secret inputları
- ✅ Bağlantı test butonu (live feedback ile)
- ✅ Konfigürasyon validation
- ✅ localStorage'a kaydetme

### 3. Environment Konfigürasyonu

#### `.env.example`
```bash
# Moltworker Worker URL (e.g., https://your-worker.workers.dev)
VITE_MOLTWORKER_URL=

# Gateway Token (generate with: openssl rand -hex 32)
VITE_MOLTWORKER_TOKEN=

# CDP Secret for debug endpoints (optional)
VITE_MOLTWORKER_CDP_SECRET=
```

### 4. Deployment

- ✅ Vite build yapılandırması tamamlandı
- ✅ Cloudflare Pages deployment başarılı
- ✅ Production URL: https://99fe72ca.openclaw-monitor-dashboard.pages.dev

---

## 🔧 Yapılandırma Talimatları

### 1. Environment Variables (Opsiyonel)

Dashboard'u çalıştırmadan önce `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını doldurun:
```bash
VITE_MOLTWORKER_URL=https://your-worker.workers.dev
VITE_MOLTWORKER_TOKEN=your_gateway_token_here
VITE_MOLTWORKER_CDP_SECRET=your_cdp_secret_here  # Optional
```

**Not:** Environment variables set etmek zorunlu değildir. Dashboard'u açtıktan sonra Settings panelinden de konfigüre edebilirsiniz.

### 2. Token Oluşturma

Gateway token oluşturmak için:
```bash
openssl rand -hex 32
```

### 3. Dashboard Kullanımı

1. Dashboard'u açın
2. **Ayarlar** paneline gidin
3. Aşağıdaki bilgileri girin:
   - **Worker URL**: Cloudflare Workers URL'si (örn: `https://moltbot-subdomain.workers.dev`)
   - **Gateway Token**: `MOLTBOT_GATEWAY_TOKEN` environment variable'ı
   - **CDP Secret** (Opsiyonel): `CDP_SECRET` environment variable'ı
4. **"Bağlantıyı Test Et"** butonuna tıklayın
5. Başarılı olduğunda **"Kaydet"** butonuna tıklayın

---

## 📡 API Endpoint'leri

### Debug Endpoints (CDP Secret gerektirir)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/debug/version` | GET | OpenClaw ve Moltbot versiyon bilgileri |
| `/debug/processes` | GET | Çalışan süreçlerin listesi |
| `/debug/logs` | GET | Log girdileri |
| `/debug/health` | GET | Sistem sağlık göstergeleri |

### Admin Endpoints (Cloudflare Access gerektirir)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/_admin/api/restart` | POST | Gateway yeniden başlatma |
| `/_admin/api/backup` | POST | Yedekleme tetikleme |
| `/_admin/api/devices` | GET | Eşleşmiş cihazlar |

### WebSocket

| Endpoint | Parametre | Açıklama |
|----------|-----------|----------|
| `/ws` | `token` | Real-time mesaj akışı için WebSocket bağlantısı |

---

## 📝 Yapılacaklar (TODO)

### High Priority

1. **Admin Endpoints Entegrasyonu**
   - [ ] Cloudflare Access entegrasyonu (Zero Trust)
   - [ ] `/_admin/api/restart` endpoint'i için UI butonu ekle
   - [ ] `/_admin/api/backup` endpoint'i için UI butonu ekle
   - [ ] `/_admin/api/devices` endpoint'i için cihaz yönetim paneli

2. **Log Detay Paneli**
   - [ ] Her süreç için detaylı log görüntüleme
   - [ ] Log filtreleme (tarih aralığı, seviye, kelime arama)
   - [ ] Log export (JSON, TXT)
   - [ ] Real-time log streaming

3. **Settings Panel - Quick Actions**
   - [ ] "OpenClaw Yeniden Başlat" butonu çalışır hale getir (admin endpoint)
   - [ ] "Dashboard Yeniden Başlat" butonu için backend entegrasyonu
   - [ ] "Log Temizle" butonu için backend entegrasyonu

### Medium Priority

4. **Environment Info Paneli**
   - [ ] Gerçek environment bilgilerini API'den çek
   - [ ] `DASHBOARD_PORT`, `WORKSPACE_DIR`, `OPENCLAW_AGENT` bilgileri
   - [ ] Node.js versiyonu ve uptime bilgisi

5. **Error Handling**
   - [ ] Network error handling'i geliştir
   - [ ] Offline mode indicator
   - [ ] Retry mekanizması (exponential backoff)
   - [ ] Error boundary component ekle

6. **UI/UX İyileştirmeleri**
   - [ ] Loading skeleton'lar ekle
   - [ ] Empty state'leri iyileştir
   - [ ] Dark/light mode toggle (opsiyonel)
   - [ ] Responsive design test et ve düzelt

### Low Priority

7. **Performance**
   - [ ] Chart data için caching stratejisi
   - [ ] WebSocket message buffering
   - [ ] Virtual scrolling for long logs
   - [ ] Image optimization

8. **Testing**
   - [ ] Unit tests for API client
   - [ ] Integration tests for hooks
   - [ ] E2E tests for critical flows
   - [ ] WebSocket connection tests

9. **Documentation**
   - [ ] API documentation (OpenAPI/Swagger)
   - [ ] Component documentation (Storybook)
   - [ ] Deployment guide
   - [ ] Troubleshooting guide

---

## 🐛 Bilinen Sorunlar ve Sınırlamalar

1. **Admin Endpoints Erişimi**
   - Cloudflare Access (Zero Trust) gerektirir
   - Dashboard'dan çağırmak için additional authentication katmanı gerekli
   - Geçici çözüm: Manuel olarak Cloudflare dashboard'dan çağırın

2. **Environment Info**
   - Şu anda hardcoded değerler gösteriliyor
   - Gerçek environment bilgileri için backend endpoint gerekli

3. **WebSocket Reconnect**
   - Auto-reconnect mevcuz ancak exponential backoff eksik
   - Network değişikliklerinde handle edilmesi gerekiyor

4. **Chart Data**
   - History data mock olarak üretiliyor
   - Production'da API'den gelmeli

5. **Rate Limiting**
   - React Query refetch intervals hardcoded
   - Dynamic rate limiting eklenebilir

---

## 🔌 Entegrasyon Detayları

### Authentication Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenClaw Monitor Dashboard              │
│                         (React + Vite)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  Config Store │
                    │ (localStorage │
                    │   + .env)     │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Debug Endpoints│  │ Admin Endpoint│  │   WebSocket   │
│   (CDP Secret) │  │   (Cloudflare │  │  (Gateway     │
│               │  │     Access)    │  │    Token)     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ▼       ▼       ▼
            ┌───────────────────────────────┐
            │   Cloudflare Moltworker       │
            │   (Workers + CP Sandbox)      │
            └───────────────────────────────┘
```

### Veri Akışı

1. **Dashboard Settings Panel** → Konfigürasyon (localStorage)
2. **Config Store** → API Client (moltworker.ts)
3. **React Query Hooks** → Component'ler
4. **WebSocket Hook** → Real-time mesajlar
5. **Admin Mutations** → Gateway restart/backup

---

## 🚀 Deployment Komutları

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 📚 Faydalı Linkler

- **Cloudflare Moltworker**: https://github.com/cloudflare/moltworker
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **React Query**: https://tanstack.com/query/latest
- **Recharts**: https://recharts.org/

---

## 📌 Notlar

- Bu dashboard **tugcantopaloglu/openclaw-dashboard** projesinden farklıdır. O proje Node.js tabanlı local OpenClaw monitoring içindir.
- Bu proje sadece **Cloudflare Moltworker** API entegrasyonu içindir.
- Local OpenClaw monitoring için farklı bir dashboard gerekir.

---

## 📞 Destek

Sorun yaşarsanız veya özellik isteğiniz varsa:
1. GitHub Issues kullanın
2. Cloudflare Moltworker docs'u inceleyin
3. API endpoint'leri Postman/Insomnia ile test edin
