# 🚀 Deployment Rehberi

Bu rehber, dinamik kişisel sitenizi Cloudflare'de deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

1. **Cloudflare Hesabı**: Ücretsiz Cloudflare hesabı oluşturun
2. **Wrangler CLI**: Cloudflare Workers için CLI aracı
3. **Node.js**: v16 veya üzeri

## 🔧 Kurulum Adımları

### 1. Wrangler CLI Kurulumu
```bash
npm install -g wrangler
```

### 2. Cloudflare'e Giriş Yapın
```bash
wrangler login
```

### 3. D1 Veritabanı Oluşturun
```bash
wrangler d1 create personal-site-db
```

Bu komut size bir `database_id` verecek. Bu ID'yi `wrangler.toml` dosyasında güncelleyin.

### 4. Veritabanı Şemasını Oluşturun
```bash
wrangler d1 execute personal-site-db --file=./schema.sql
```

### 5. Worker'ı Deploy Edin
```bash
npm run deploy:worker
```

### 6. Environment Variables Ayarlayın
```bash
# .env dosyası oluşturun
cp env.example .env
```

`.env` dosyasını düzenleyin:
```
REACT_APP_API_URL=https://your-worker.your-subdomain.workers.dev
```

### 7. React Uygulamasını Build Edin
```bash
npm run build
```

### 8. Cloudflare Pages'e Deploy Edin

#### Seçenek A: Cloudflare Pages Dashboard
1. Cloudflare Dashboard'a gidin
2. Pages > Create a project
3. Upload build folder
4. `build` klasörünü seçin
5. Deploy edin

#### Seçenek B: Git Integration
1. Projenizi GitHub'a push edin
2. Cloudflare Pages'de Git repository'yi bağlayın
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `build`

## 🔍 Test Etme

### 1. API Endpointlerini Test Edin
```bash
# Hero data test
curl https://your-worker.your-subdomain.workers.dev/api/hero

# About data test
curl https://your-worker.your-subdomain.workers.dev/api/about
```

### 2. Veritabanı Sorguları
```bash
# Tüm hero data'yı görüntüle
wrangler d1 execute personal-site-db --command="SELECT * FROM hero_data"

# Contact mesajlarını görüntüle
wrangler d1 execute personal-site-db --command="SELECT * FROM contact_messages"
```

## 🛠️ Güncelleme İşlemleri

### Veri Güncelleme
1. Cloudflare Dashboard > D1 > personal-site-db
2. SQL sorgularını çalıştırın

### Worker Güncelleme
```bash
npm run deploy:worker
```

### Frontend Güncelleme
```bash
npm run build
# Cloudflare Pages otomatik olarak güncellenecek
```

## 🐛 Hata Ayıklama

### Worker Logları
```bash
wrangler tail
```

### Veritabanı Bağlantısı
```bash
wrangler d1 execute personal-site-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### CORS Hataları
Worker'ınızda CORS headers'ların doğru ayarlandığından emin olun.

## 📊 Monitoring

### Cloudflare Analytics
- Dashboard'da Workers ve D1 kullanımını izleyin
- Pages Analytics ile site performansını takip edin

### Log Monitoring
```bash
# Real-time logs
wrangler tail --format=pretty
```

## 🔒 Güvenlik

### Environment Variables
- API URL'lerini environment variables'da saklayın
- Production'da debug mode'u kapatın

### CORS Ayarları
- Sadece gerekli origin'lere izin verin
- Production'da wildcard (*) kullanmayın

## 📈 Performans Optimizasyonu

### Caching
- Static assets için Cloudflare CDN kullanın
- API responses için cache headers ekleyin

### Database Optimization
- Gereksiz sorguları azaltın
- Index'leri optimize edin

## 🆘 Sorun Giderme

### Yaygın Hatalar

1. **CORS Error**: Worker'da CORS headers'ları kontrol edin
2. **Database Connection**: D1 binding'ini kontrol edin
3. **Build Failures**: Node.js versiyonunu kontrol edin
4. **API 404**: Route'ları kontrol edin

### Destek
- Cloudflare Docs: https://developers.cloudflare.com/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/
