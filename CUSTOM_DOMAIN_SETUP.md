# Cloudflare Custom Domain Otomasyonu Kurulum Rehberi

Bu rehber, kullanıcıların login olduğunda otomatik olarak custom domain oluşturma özelliğini nasıl kuracağınızı açıklar.

## 🚀 Özellikler

- ✅ Kullanıcı login olduğunda otomatik custom domain oluşturma
- ✅ Cloudflare API entegrasyonu
- ✅ DNS kayıt otomasyonu
- ✅ Kullanıcı dashboardunda domain yönetimi
- ✅ Mevcut sitelere custom domain ekleme

## 📋 Gereksinimler

1. **Cloudflare Hesabı**: API erişimi için
2. **Cloudflare Zone ID**: Ana domain'iniz için
3. **Cloudflare API Token**: DNS kayıtları oluşturmak için

## 🔧 Kurulum Adımları

### 1. Cloudflare API Token Oluşturma

1. Cloudflare Dashboard'a giriş yapın
2. "My Profile" > "API Tokens" bölümüne gidin
3. "Create Token" butonuna tıklayın
4. "Custom token" seçin
5. Aşağıdaki izinleri verin:
   - **Zone**: `Zone:Read`, `DNS:Edit`
   - **Account**: `Account:Read`
6. Token'ı kopyalayın ve güvenli bir yerde saklayın

### 2. Zone ID Bulma

1. Cloudflare Dashboard'da domain'inizi seçin
2. Sağ taraftaki "API" bölümünden Zone ID'yi kopyalayın

### 3. Environment Variables Ayarlama

`wrangler.toml` dosyasını düzenleyin:

```toml
# Cloudflare API credentials for custom domain management
[vars]
CLOUDFLARE_ZONE_ID = "your-zone-id-here"
CLOUDFLARE_WORKER_DOMAIN = "your-worker-domain.workers.dev"
```

### 4. Secret Ayarlama

Cloudflare API token'ınızı secret olarak ayarlayın:

```bash
wrangler secret put CLOUDFLARE_API_TOKEN
```

### 5. Worker'ı Deploy Etme

```bash
wrangler deploy
```

## 🎯 Kullanım

### Otomatik Domain Oluşturma

Kullanıcı yeni site oluştururken custom domain ekleyebilir:

```javascript
// Site oluştururken custom domain ekleme
const response = await fetch('/api/user/sites', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
    },
    body: JSON.stringify({
        subdomain: 'john-doe',
        site_name: 'John Doe Portfolio',
        custom_domain: 'johndoe.com'
    })
});
```

### Mevcut Siteye Domain Ekleme

Dashboard'dan mevcut sitelere custom domain ekleyebilirsiniz:

```javascript
// Mevcut siteye custom domain ekleme
const response = await fetch('/api/user/domain', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
    },
    body: JSON.stringify({
        site_id: 123,
        custom_domain: 'myportfolio.com'
    })
});
```

## 🔧 API Endpoints

### Yeni Endpoints

- `POST /api/user/domain` - Mevcut siteye custom domain ekleme
- `POST /api/user/sites` - Site oluştururken custom domain ekleme (güncellenmiş)

### Request/Response Örnekleri

#### Custom Domain Ekleme

**Request:**
```json
{
    "site_id": 123,
    "custom_domain": "myportfolio.com"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Custom domain added successfully"
}
```

## 🛠️ Teknik Detaylar

### DNS Kayıt Oluşturma

Sistem otomatik olarak şu DNS kaydını oluşturur:

- **Type**: CNAME
- **Name**: subdomain (örn: `www`)
- **Content**: Worker domain'iniz
- **TTL**: Auto (1)
- **Proxied**: true (Cloudflare proxy aktif)

### Veritabanı Değişiklikleri

`user_sites` tablosunda `domain` alanı kullanılır:

```sql
ALTER TABLE user_sites ADD COLUMN domain TEXT;
```

## 🔒 Güvenlik

- API token'ları secret olarak saklanır
- Kullanıcı sadece kendi sitelerine domain ekleyebilir
- DNS kayıt oluşturma hataları graceful olarak handle edilir

## 🐛 Troubleshooting

### Yaygın Hatalar

1. **"Cloudflare credentials not configured"**
   - `CLOUDFLARE_ZONE_ID` ve `CLOUDFLARE_API_TOKEN` değerlerini kontrol edin

2. **"Cloudflare API error"**
   - API token'ın doğru izinlere sahip olduğunu kontrol edin
   - Zone ID'nin doğru olduğunu kontrol edin

3. **DNS kayıt oluşturulamıyor**
   - Domain'in Cloudflare'de yönetildiğini kontrol edin
   - API token'ın DNS edit iznine sahip olduğunu kontrol edin

### Debug

Worker loglarını kontrol etmek için:

```bash
wrangler tail
```

## 📈 Gelişmiş Özellikler

### SSL Sertifika Otomasyonu

Cloudflare otomatik olarak SSL sertifikası oluşturur (proxied kayıtlar için).

### Subdomain Yönetimi

Sistem otomatik olarak subdomain'leri yönetir ve çakışmaları önler.

### Monitoring

DNS kayıt oluşturma işlemlerini loglayarak monitoring yapabilirsiniz.

## 🎉 Sonuç

Bu kurulum ile kullanıcılarınız:

1. Login olduklarında otomatik olarak custom domain oluşturabilir
2. Dashboard'dan domain'lerini yönetebilir
3. Mevcut sitelerine custom domain ekleyebilir
4. DNS kayıtları otomatik olarak oluşturulur

Sistem tamamen otomatik çalışır ve kullanıcı deneyimini kesintisiz hale getirir.
