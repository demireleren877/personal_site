# 🧪 Test Senaryoları - Personal Site Builder

Bu dokümanda Personal Site Builder uygulamasının tüm özelliklerini test etmek için detaylı senaryolar bulunmaktadır.

## 📋 İçindekiler

1. [Authentication Test Senaryoları](#authentication-test-senaryoları)
2. [Site Builder Test Senaryoları](#site-builder-test-senaryoları)
3. [Domain Management Test Senaryoları](#domain-management-test-senaryoları)
4. [Dashboard Test Senaryoları](#dashboard-test-senaryoları)
5. [API Test Senaryoları](#api-test-senaryoları)
6. [Error Handling Test Senaryoları](#error-handling-test-senaryoları)
7. [Performance Test Senaryoları](#performance-test-senaryoları)
8. [Mobile Responsive Test Senaryoları](#mobile-responsive-test-senaryoları)

---

## 🔐 Authentication Test Senaryoları

### 1.1 Email ile Kayıt Olma

**Test Adımları:**
1. Ana sayfaya git: `http://localhost:3000`
2. "Kayıt Ol" butonuna tıkla
3. Form doldur:
   - **Ad Soyad**: "Test User"
   - **Email**: "test@example.com"
   - **Şifre**: "123456"
   - **Şifre Tekrar**: "123456"
4. "Kayıt Ol" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Email verification ekranı görünür
- ✅ Firebase'de kullanıcı oluşturulur
- ✅ Email doğrulama maili gönderilir
- ✅ D1 veritabanında kullanıcı kaydı oluşturulur

**Test Verileri:**
```
Email: test@example.com
Şifre: 123456
Ad: Test User
```

### 1.2 Google ile Giriş Yapma

**Test Adımları:**
1. Ana sayfaya git
2. "Google ile Giriş Yap" butonuna tıkla
3. Google hesabını seç
4. İzinleri onayla

**Beklenen Sonuç:**
- ✅ Google popup açılır
- ✅ Kullanıcı seçimi yapılır
- ✅ Dashboard'a yönlendirilir
- ✅ D1'de kullanıcı ve site oluşturulur

### 1.3 Email Doğrulama

**Test Adımları:**
1. Email ile kayıt ol
2. Email'deki doğrulama linkine tıkla
3. "Email Doğrulandı" sayfasına git
4. "Giriş Yap" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Email doğrulama başarılı
- ✅ Dashboard'a erişim sağlanır
- ✅ Kullanıcı bilgileri güncellenir

### 1.4 Hatalı Giriş Senaryoları

**Test 1: Yanlış Şifre**
```
Email: test@example.com
Şifre: yanlis123
```
**Beklenen**: "Yanlış şifre" hatası

**Test 2: Olmayan Email**
```
Email: olmayan@example.com
Şifre: 123456
```
**Beklenen**: "Bu email adresi ile kayıtlı kullanıcı bulunamadı" hatası

**Test 3: Geçersiz Email Formatı**
```
Email: geçersiz-email
Şifre: 123456
```
**Beklenen**: "Geçersiz email adresi" hatası

---

## 🏗️ Site Builder Test Senaryoları

### 2.1 Hero Section Düzenleme

**Test Adımları:**
1. Dashboard'a git
2. "Site Builder" butonuna tıkla
3. "Hero Section" sekmesine git
4. Form alanlarını doldur:
   - **Name**: "John Doe"
   - **Title**: "Full Stack Developer"
   - **Description**: "Passionate developer with 5+ years experience"
   - **Birth Date**: "1990-01-01"
   - **Location**: "Istanbul, Turkey"
   - **Current Job**: "Senior Developer at Tech Corp"
   - **GitHub URL**: "https://github.com/johndoe"
   - **LinkedIn URL**: "https://linkedin.com/in/johndoe"
   - **CV URL**: "/cv.pdf"
5. "Save Changes" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Tüm alanlar kaydedilir
- ✅ Loading state gösterilir
- ✅ Başarı mesajı görünür
- ✅ Veriler API'ye gönderilir

### 2.2 Experience Ekleme

**Test Adımları:**
1. "Experience" sekmesine git
2. "+ Add Experience" butonuna tıkla
3. Yeni experience'ı doldur:
   - **Company**: "Tech Corp"
   - **Position**: "Senior Developer"
   - **Start Date**: "2020-01-01"
   - **End Date**: "2023-12-31"
   - **Description**: "Led development of web applications"
4. "Save Changes" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Experience kartı oluşturulur
- ✅ Tarih validasyonu çalışır
- ✅ Veriler kaydedilir

### 2.3 Education Ekleme

**Test Adımları:**
1. "Education" sekmesine git
2. "+ Add Education" butonuna tıkla
3. Education bilgilerini doldur:
   - **School**: "Istanbul Technical University"
   - **Degree**: "Bachelor's Degree"
   - **Field of Study**: "Computer Engineering"
   - **Start Date**: "2015-09-01"
   - **End Date**: "2019-06-30"
4. "Save Changes" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Education kartı oluşturulur
- ✅ Tarih sıralaması kontrol edilir
- ✅ Veriler kaydedilir

### 2.4 Skills Yönetimi

**Test Adımları:**
1. "Skills" sekmesine git
2. **Competencies** bölümünde:
   - "+ Add Competency" butonuna tıkla
   - "Business Development" seç
3. **Tools** bölümünde:
   - "+ Add Tool" butonuna tıkla
   - "Python" seç
   - Usage purpose: "Data Analysis" yaz
4. **Languages** bölümünde:
   - "+ Add Language" butonuna tıkla
   - "English" seç
   - Level: "Fluent" seç
5. "Save Changes" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Tüm skill kategorileri kaydedilir
- ✅ Custom input'lar çalışır
- ✅ Level seçimleri kaydedilir

### 2.5 Tarih Validasyonu

**Test Senaryoları:**

**Test 1: End Date < Start Date**
```
Start Date: 2023-01-01
End Date: 2022-12-31
```
**Beklenen**: "End date cannot be earlier than start date" hatası

**Test 2: Present Toggle**
```
Start Date: 2020-01-01
End Date: (boş bırak)
Present: ✓ (işaretli)
```
**Beklenen**: End date boş kalır, "Present" gösterilir

---

## 🌐 Domain Management Test Senaryoları

### 3.1 Custom Domain Ekleme

**Test Adımları:**
1. SiteBuilder'da "Domainleriniz" sekmesine git
2. "Custom Domain Ekle" butonuna tıkla
3. Domain bilgilerini doldur:
   - **Domain Adı**: "test-site"
4. "Domain Ekle" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Modal açılır
- ✅ Domain preview gösterilir: "test-site.erendemirel.com.tr"
- ✅ Loading state gösterilir
- ✅ Cloudflare DNS kaydı oluşturulur
- ✅ Domain Pages'e eklenir

### 3.2 Domain Değiştirme

**Test Adımları:**
1. Mevcut domain'i olan site seç
2. "Domain Değiştir" butonuna tıkla
3. Yeni domain gir:
   - **Domain Adı**: "new-site"
4. "Domain Güncelle" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Eski domain kaldırılır
- ✅ Yeni domain eklenir
- ✅ "Eski domain kaldırıldı ve yeni domain eklendi" mesajı
- ✅ DNS kayıtları güncellenir

### 3.3 Domain Çakışma Testleri

**Test 1: Aynı Domain**
```
Mevcut: test-site.erendemirel.com.tr
Yeni: test-site.erendemirel.com.tr
```
**Beklenen**: "Bu domain zaten eklenmiş!" hatası

**Test 2: Başka Site Kullanıyor**
```
Domain: kullanilan-domain.erendemirel.com.tr
```
**Beklenen**: "Bu domain zaten kullanımda!" hatası

### 3.4 Domain Modal UI Testleri

**Test Adımları:**
1. Domain modal'ını aç
2. Input alanını test et:
   - Boş bırak → "Domain Ekle" butonu devre dışı
   - Geçerli input → Buton aktif
3. Loading durumunu test et:
   - Butona tıkla → Loading spinner göster
   - Input devre dışı kalır
   - Modal kapatılamaz

**Beklenen Sonuç:**
- ✅ Input validation çalışır
- ✅ Loading state tutarlı
- ✅ Spam koruması aktif

---

## 📊 Dashboard Test Senaryoları

### 4.1 Dashboard Yükleme

**Test Adımları:**
1. Giriş yap
2. Dashboard'a git
3. Sayfa yüklenmesini gözlemle

**Beklenen Sonuç:**
- ✅ Kullanıcı bilgileri yüklenir
- ✅ Site listesi görünür
- ✅ Loading state gösterilir
- ✅ Hata durumunda uygun mesaj

### 4.2 Site Listesi

**Test Adımları:**
1. Dashboard'da site listesini kontrol et
2. Her site için:
   - Site adı görünür
   - Domain bilgisi (varsa) görünür
   - Status bilgisi görünür
   - "Siteyi Görüntüle" butonu çalışır

**Beklenen Sonuç:**
- ✅ Tüm site bilgileri doğru
- ✅ Link'ler çalışır
- ✅ Status'lar doğru

### 4.3 Logout İşlemi

**Test Adımları:**
1. Dashboard'da "Logout" butonuna tıkla
2. Onay ver
3. Ana sayfaya yönlendiril

**Beklenen Sonuç:**
- ✅ Firebase'den çıkış yapılır
- ✅ localStorage temizlenir
- ✅ Ana sayfaya yönlendirilir

---

## 🔌 API Test Senaryoları

### 5.1 Authentication API

**Test Endpoints:**
```
POST /api/auth/firebase-register
POST /api/user/sites
GET /api/user/sites
```

**Test Adımları:**
1. Network sekmesini aç
2. Giriş yap
3. API çağrılarını kontrol et

**Beklenen Sonuç:**
- ✅ Firebase registration çağrısı
- ✅ User sites çağrısı
- ✅ Doğru authorization header
- ✅ Başarılı response'lar

### 5.2 Site Data API

**Test Endpoints:**
```
GET /api/site/{subdomain}/hero
GET /api/site/{subdomain}/experiences
GET /api/site/{subdomain}/education
POST /api/site/{subdomain}/hero
```

**Test Adımları:**
1. SiteBuilder'ı aç
2. Network sekmesini kontrol et
3. Veri kaydetme işlemini test et

**Beklenen Sonuç:**
- ✅ Tüm endpoint'ler çalışır
- ✅ Doğru HTTP method'lar
- ✅ Başarılı response'lar

### 5.3 Domain API

**Test Endpoints:**
```
POST /api/user/domain
```

**Test Adımları:**
1. Domain ekleme işlemini test et
2. Network sekmesini kontrol et

**Beklenen Sonuç:**
- ✅ Domain API çağrısı
- ✅ Cloudflare API entegrasyonu
- ✅ DNS kayıt oluşturma

---

## ❌ Error Handling Test Senaryoları

### 6.1 Network Hataları

**Test Adımları:**
1. Network'ü devre dışı bırak
2. Giriş yapmaya çalış
3. Site kaydetmeye çalış

**Beklenen Sonuç:**
- ✅ "Bağlantı hatası" mesajı
- ✅ Loading state sonlanır
- ✅ Kullanıcı bilgilendirilir

### 6.2 API Hataları

**Test Senaryoları:**

**Test 1: 401 Unauthorized**
- Token'ı sil
- API çağrısı yap
**Beklenen**: "Unauthorized" hatası

**Test 2: 500 Internal Server Error**
- Backend'de hata oluştur
- API çağrısı yap
**Beklenen**: "Internal Server Error" mesajı

**Test 3: Validation Errors**
- Geçersiz domain formatı
- Eksik required field'lar
**Beklenen**: Uygun validation mesajları

### 6.3 Firebase Hataları

**Test Senaryoları:**

**Test 1: Invalid API Key**
```
API Key: geçersiz-key
```
**Beklenen**: "Firebase: Error (auth/invalid-api-key)"

**Test 2: Email Already in Use**
```
Email: mevcut@example.com
```
**Beklenen**: "Bu email adresi zaten kullanılıyor"

**Test 3: Weak Password**
```
Şifre: 123
```
**Beklenen**: "Şifre çok zayıf"

---

## ⚡ Performance Test Senaryoları

### 7.1 Loading Performance

**Test Adımları:**
1. Chrome DevTools'u aç
2. Network sekmesini aç
3. Sayfa yüklenmesini test et

**Ölçümler:**
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 4s
- **Time to Interactive**: < 5s

### 7.2 API Performance

**Test Adımları:**
1. Network sekmesinde API çağrılarını kontrol et
2. Response time'ları ölç

**Beklenen Sonuç:**
- ✅ API response time < 2s
- ✅ Paralel API çağrıları
- ✅ Caching çalışır

### 7.3 Memory Usage

**Test Adımları:**
1. Chrome DevTools > Memory sekmesi
2. Memory leak'leri kontrol et
3. Component unmount'ları test et

**Beklenen Sonuç:**
- ✅ Memory leak yok
- ✅ Component'ler düzgün unmount
- ✅ Event listener'lar temizlenir

---

## 📱 Mobile Responsive Test Senaryoları

### 8.1 Mobile Layout

**Test Cihazları:**
- iPhone SE (375x667)
- iPhone 12 (390x844)
- Samsung Galaxy S20 (360x800)

**Test Adımları:**
1. Responsive mode'u aç
2. Farklı cihaz boyutlarını test et
3. Layout'u kontrol et

**Beklenen Sonuç:**
- ✅ Tüm elementler görünür
- ✅ Touch target'lar yeterli (44px+)
- ✅ Text okunabilir

### 8.2 Mobile Domain Modal

**Test Adımları:**
1. Mobile'da domain modal'ını aç
2. Input alanını test et
3. Butonları test et

**Beklenen Sonuç:**
- ✅ Modal tam ekran
- ✅ Input kolay kullanılabilir
- ✅ Butonlar erişilebilir

### 8.3 Touch Interactions

**Test Adımları:**
1. Touch gesture'ları test et
2. Scroll performance'ı kontrol et
3. Zoom işlemlerini test et

**Beklenen Sonuç:**
- ✅ Smooth scrolling
- ✅ Touch response hızlı
- ✅ Zoom çalışır

---

## 🧪 Test Verileri

### Test Kullanıcıları

```javascript
// Test User 1 - Email
{
  email: "test1@example.com",
  password: "123456",
  name: "Test User 1"
}

// Test User 2 - Google
{
  email: "test2@gmail.com",
  name: "Test User 2"
}

// Test User 3 - Edge Case
{
  email: "test+special@example.com",
  password: "P@ssw0rd123!",
  name: "Test User 3"
}
```

### Test Domain'leri

```javascript
// Valid Domains
[
  "test-site",
  "my-portfolio",
  "john-doe-portfolio",
  "test123"
]

// Invalid Domains
[
  "test_site", // underscore
  "test.site", // dot
  "test site", // space
  "", // empty
  "a" // too short
]
```

### Test Site Data

```javascript
// Complete Site Data
{
  hero: {
    name: "John Doe",
    title: "Full Stack Developer",
    description: "Passionate developer with 5+ years experience",
    birth_year: "1990-01-01",
    location: "Istanbul, Turkey",
    current_job: "Senior Developer at Tech Corp",
    github_url: "https://github.com/johndoe",
    linkedin_url: "https://linkedin.com/in/johndoe",
    cv_url: "/cv.pdf"
  },
  experiences: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      start_date: "2020-01-01",
      end_date: "2023-12-31",
      description: "Led development of web applications"
    }
  ],
  education: [
    {
      institution: "Istanbul Technical University",
      degree: "Bachelor's Degree",
      field: "Computer Engineering",
      start_date: "2015-09-01",
      end_date: "2019-06-30"
    }
  ]
}
```

---

## 📝 Test Checklist

### Authentication
- [ ] Email kayıt olma
- [ ] Google giriş
- [ ] Email doğrulama
- [ ] Hatalı giriş senaryoları
- [ ] Logout işlemi

### Site Builder
- [ ] Hero section düzenleme
- [ ] Experience ekleme/düzenleme
- [ ] Education ekleme/düzenleme
- [ ] Skills yönetimi
- [ ] Tarih validasyonu
- [ ] Form kaydetme

### Domain Management
- [ ] Custom domain ekleme
- [ ] Domain değiştirme
- [ ] Domain çakışma testleri
- [ ] Modal UI testleri
- [ ] Loading state testleri

### Dashboard
- [ ] Dashboard yükleme
- [ ] Site listesi
- [ ] Logout işlemi

### API
- [ ] Authentication API
- [ ] Site data API
- [ ] Domain API
- [ ] Error handling

### Performance
- [ ] Loading performance
- [ ] API performance
- [ ] Memory usage

### Mobile
- [ ] Mobile layout
- [ ] Mobile domain modal
- [ ] Touch interactions

---

## 🚀 Test Çalıştırma

### Manuel Test
1. Bu dokümandaki senaryoları sırayla takip edin
2. Her test için beklenen sonuçları kontrol edin
3. Hata durumlarını raporlayın

### Otomatik Test (Gelecek)
```bash
# Test script'leri (henüz mevcut değil)
npm run test:auth
npm run test:sitebuilder
npm run test:domain
npm run test:api
```

### Test Raporu
Her test sonrası aşağıdaki bilgileri kaydedin:
- Test adı
- Test tarihi
- Sonuç (✅/❌)
- Hata mesajları (varsa)
- Ekran görüntüleri (gerekirse)

---

## 📞 Test Desteği

Test sırasında sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Network sekmesini kontrol edin
3. Firebase console'u kontrol edin
4. Cloudflare dashboard'u kontrol edin

**Test Environment:**
- Browser: Chrome 120+
- OS: Windows 10/11
- Network: Stable internet connection
- Firebase: Development environment
