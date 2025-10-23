# Eren Demirel - Personal Site (Dinamik)

Bu proje, Cloudflare D1 veritabanı kullanarak tamamen dinamik bir kişisel web sitesidir. Tüm içerik veritabanından çekilir ve gerçek zamanlı olarak güncellenebilir.

## 🚀 Özellikler

- **Tamamen Dinamik İçerik**: Tüm veriler Cloudflare D1 veritabanından çekilir
- **Modern React**: React 18 ile geliştirilmiş
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Loading States**: Veri yüklenirken skeleton loading gösterir
- **Error Handling**: Hata durumlarında kullanıcı dostu mesajlar
- **Contact Form**: İletişim formu veritabanına kaydedilir

## 🛠️ Teknolojiler

### Frontend
- React 18
- CSS3
- React Icons

### Backend
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Wrangler CLI

## 📦 Kurulum

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd personal_site
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Cloudflare D1 veritabanı oluşturun
```bash
# Cloudflare hesabınızda D1 veritabanı oluşturun
wrangler d1 create personal-site-db
```

### 4. Veritabanı şemasını oluşturun
```bash
wrangler d1 execute personal-site-db --file=./schema.sql
```

### 5. Environment variables ayarlayın
```bash
# .env dosyası oluşturun
cp env.example .env

# .env dosyasını düzenleyin ve API URL'inizi ekleyin
REACT_APP_API_URL=https://your-worker.your-subdomain.workers.dev
```

### 6. Wrangler konfigürasyonunu güncelleyin
`wrangler.toml` dosyasındaki `database_id` değerini güncelleyin.

## 🚀 Development

### Frontend Development
```bash
# React uygulamasını başlatın
npm start

# Browser'da http://localhost:3000 adresine gidin
```

### Worker Development
```bash
# Worker'ı deploy edin
npm run deploy:worker

# Worker loglarını izleyin
wrangler tail
```

## 🏗️ Build ve Deploy

### 1. Frontend Build
```bash
# React uygulamasını build edin
npm run build

# Build dosyalarını test edin
npx serve -s build
```

### 2. Worker Deploy
```bash
# Worker'ı deploy edin
npm run deploy:worker
```

### 3. Production Deploy
```bash
# React uygulamasını build edin
npm run build

# Build klasörünü Cloudflare Pages'e deploy edin
```

## 📊 Veritabanı Yapısı

### Tablolar
- `hero_data`: Ana sayfa bilgileri
- `about_data`: Hakkımda bölümü
- `about_highlights`: Hakkımda öne çıkan özellikler
- `experiences`: İş deneyimleri
- `experience_achievements`: Deneyim başarıları
- `education`: Eğitim bilgileri
- `education_achievements`: Eğitim başarıları
- `competencies`: Yetkinlikler
- `tools`: Araçlar ve yazılımlar
- `languages`: Dil bilgileri
- `contact_messages`: İletişim formu mesajları

## 🔧 API Endpoints

- `GET /api/hero` - Ana sayfa verileri
- `GET /api/about` - Hakkımda verileri
- `GET /api/experiences` - İş deneyimleri
- `GET /api/education` - Eğitim bilgileri
- `GET /api/competencies` - Yetkinlikler
- `GET /api/tools` - Araçlar
- `GET /api/languages` - Diller
- `POST /api/contact` - İletişim formu gönderimi

## 🎨 Özelleştirme

### Veri Güncelleme
Veritabanındaki verileri güncellemek için:

1. Cloudflare Dashboard'a gidin
2. D1 veritabanınızı seçin
3. SQL sorgularını çalıştırın

### Yeni İçerik Ekleme
Yeni deneyim, eğitim veya yetkinlik eklemek için veritabanına yeni kayıtlar ekleyin.

## 🐛 Hata Ayıklama

### Geliştirme Modu
```bash
npm start
```

### Worker Logları
```bash
wrangler tail
```

### Veritabanı Sorguları
```bash
wrangler d1 execute personal-site-db --command="SELECT * FROM hero_data"
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Eren Demirel**
- GitHub: [@demireleren877](https://github.com/demireleren877)
- LinkedIn: [demireleren877](https://linkedin.com/in/demireleren877)