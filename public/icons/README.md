# Icons Directory Structure

Bu klasör Skills section'ı için ikonları organize eder.

## 📁 Klasör Yapısı

```
public/icons/
├── competencies/          # Yetkinlik ikonları
│   ├── business-development.png
│   ├── analytical-thinking.png
│   ├── problem-solving.png
│   ├── data-analysis.png
│   ├── project-management.png
│   └── strategic-planning.png
├── tools/                # Araç ve yazılım ikonları
│   ├── python-svgrepo-com.svg
│   ├── excel-svgrepo-com.svg
│   ├── New_Power_BI_Logo.svg
│   ├── sas-logo-horiz.svg
│   ├── sql-svgrepo-com.svg
│   └── flutter-svgrepo-com.svg
└── languages/            # Dil bayrakları (gelecekte)
```

## 🎯 Kullanım

### Yeni İkon Ekleme

1. **Competency İkonu:**
   ```
   public/icons/competencies/leadership.png
   ```

2. **Tool İkonu:**
   ```
   public/icons/tools/react-logo.svg
   ```

3. **Language Bayrağı:**
   ```
   public/icons/languages/turkey-flag.svg
   ```

### Skills.js'te Tanımlama

```javascript
const getIconUrl = (name, type) => {
  const iconMap = {
    // Tools & Software
    'React': '/icons/tools/react-logo.svg',
    'Node.js': '/icons/tools/nodejs-logo.svg',
    
    // Competencies
    'Leadership': '/icons/competencies/leadership.png',
    'Communication': '/icons/competencies/communication.png',
    
    // Languages
    'Turkish': '/icons/languages/turkey-flag.svg',
    'English': '/icons/languages/uk-flag.svg'
  };
  
  return iconMap[name] || null;
};
```

## 📋 Desteklenen Formatlar

- **SVG** (önerilen - vektörel, ölçeklenebilir)
- **PNG** (şeffaf arka plan)
- **JPG** (fotoğraf için)

## 🎨 İkon Boyutları

- **Competencies:** 64x64 piksel
- **Tools:** 64x64 piksel  
- **Languages:** Bayrak emojileri (otomatik)

## 🔗 İkon Kaynakları

- [Heroicons](https://heroicons.com/) - SVG ikonlar
- [Simple Icons](https://simpleicons.org/) - Tool logoları
- [Flaticon](https://www.flaticon.com/) - Özel ikonlar
- [Icons8](https://icons8.com/) - Çeşitli ikonlar
