# ObservAI - Komple Kullanım Kılavuzu

## 📋 İçindekiler

1. [Sistem Gereksinimleri](#sistem-gereksinimleri)
2. [İlk Kurulum](#ilk-kurulum)
3. [Programı Çalıştırma](#programı-çalıştırma)
4. [Kamera Kaynaklarını Kullanma](#kamera-kaynaklarını-kullanma)
5. [iPhone Kamera Overlay](#iphone-kamera-overlay)
6. [Live Stream Desteği](#live-stream-desteği)
7. [Web Dashboard](#web-dashboard)
8. [Port Yönetimi](#port-yönetimi)
9. [Sorun Giderme](#sorun-giderme)

---

## 🖥️ Sistem Gereksinimleri

### Gerekli Yazılımlar

- **macOS** (10.15+)
- **Python** 3.9+
- **Node.js** 18+
- **pnpm** 8+
- **Git**

### İsteğe Bağlı (Live Stream için)

- **yt-dlp** - YouTube live stream desteği
- **streamlink** - Twitch/diğer platformlar

```bash
# İsteğe bağlı araçları yükle
brew install yt-dlp streamlink
```

---

## 🚀 İlk Kurulum

### 1. Projeyi İndir ve Bağımlılıkları Yükle

```bash
cd ~/Desktop/ObservAI/observai

# Node.js bağımlılıkları
pnpm install

# Python AI bağımlılıkları (camera-analytics)
cd packages/camera-analytics
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
cd ../..

# Python web servisi bağımlılıkları (ai-camera)
cd apps/ai-camera
python3 -m pip install -r requirements.txt
cd ../..
```

### 2. Veri Klasörünü Oluştur

```bash
mkdir -p ~/Desktop/ObservAI/observai/data/camera
```

---

## ▶️ Programı Çalıştırma

### Yöntem 1: Manuel (3 Terminal)

#### **Terminal 1 - Backend API + Web Frontend**

```bash
cd ~/Desktop/ObservAI/observai
pnpm dev
```

- Backend API: http://localhost:3001
- Web Frontend: http://localhost:5174

#### **Terminal 2 - Kamera Servisi (iPhone Overlay)**

```bash
cd ~/Desktop/ObservAI/observai/apps/ai-camera
python3 main.py
```

- iPhone Kamera Overlay: http://localhost:8002

#### **Terminal 3 - AI Analiz Motoru**

```bash
cd ~/Desktop/ObservAI/observai/packages/camera-analytics
source .venv/bin/activate
python -m camera_analytics --source 0 --display
```

### Yöntem 2: Script ile (Önerilen)

```bash
cd ~/Desktop/ObservAI

# Webcam (index 0) ile başlat
./start_camera.sh 0 --display

# iPhone kamerası (index 1) ile başlat
./start_camera.sh 1 --display

# Video dosyası ile başlat
./start_camera.sh path/to/video.mp4 --display

# Zone'ları göstermek için
./start_camera.sh 0 --display --show-zones
```

---

## 📹 Kamera Kaynaklarını Kullanma

### 1. Webcam (Varsayılan)

```bash
./start_camera.sh 0 --display
```

### 2. iPhone Kamerası

#### iPhone'u DroidCam ile Kullanma

1. **iPhone'a Yükle:**
   - App Store'dan "DroidCam Webcam" indir (ÜCRETSİZ)

2. **Mac'e Client Kur:**

   ```bash
   brew install droidcam
   ```

3. **Başlat:**
   - iPhone ve Mac'i aynı WiFi'ye bağla
   - iPhone'da DroidCam aç, IP adresini not et
   - Mac'te DroidCam Client aç, bağlan

4. **Kamera İndeksini Bul:**

   ```bash
   python3 -c "import cv2; [print(f'Camera {i}: OK') for i in range(10) if cv2.VideoCapture(i).read()[0]]"
   ```

5. **ObservAI ile Kullan:**
   ```bash
   ./start_camera.sh 1 --display
   # (1 yerine bulunan indeksi kullan)
   ```

### 3. Video Dosyası

```bash
./start_camera.sh ~/Videos/restaurant.mp4 --display
```

---

## 📱 iPhone Kamera Overlay

iPhone'unuzu **kamera görüntüsü üzerinde grafikler olan canlı analiz ekranı** olarak kullanın.

### Kurulum

1. **Servisleri Başlat:**

   ```bash
   # Terminal 1
   cd ~/Desktop/ObservAI/observai
   pnpm dev

   # Terminal 2
   cd ~/Desktop/ObservAI/observai/apps/ai-camera
   python3 main.py

   # Terminal 3 - AI analiz için kamerayı başlat
   cd ~/Desktop/ObservAI
   ./start_camera.sh 1 --display
   ```

2. **Mac'in IP Adresini Öğren:**

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
   ```

   Örnek çıktı: `192.168.1.100`

3. **iPhone Safari'den Aç:**

   ```
   http://192.168.1.100:8002
   ```

4. **Kamerayı Başlat:**
   - "Kamerayı Başlat" butonuna bas
   - Kamera izni ver
   - Artık kamera görüntüsü üzerinde grafikler göreceksin!

### Overlay Özellikleri

**Üst Panel (İstatistikler):**

- Mevcut kişi sayısı
- Saatlik giriş/çıkış
- Ortalama kalma süresi

**Alt Sol (Cinsiyet Dağılımı):**

- Pasta grafik
- Erkek/Kadın/Bilinmeyen

**Alt Sağ (Yaş Grupları):**

- Bar grafik
- 0-18, 19-30, 31-45, 46-60, 60+ yaş aralıkları

**Sağ Üst:**

- Canlı bağlantı göstergesi (yeşil nokta)
- Bağlantı durumu

**Özellikler:**

- ✅ Gerçek zamanlı WebSocket veri akışı
- ✅ Şeffaf overlay grafikler
- ✅ Arka kamera desteği
- ✅ Ekran uykusunu engelleme
- ✅ Responsive tasarım
- ✅ Tam ekran mod

---

## 🌐 Live Stream Desteği

ObservAI, YouTube, Twitch, Facebook Live ve diğer canlı yayın platformlarından doğrudan analiz yapabilir.

### Desteklenen Platformlar

- **YouTube Live**
- **Twitch**
- **Facebook Live**
- **Instagram Live**
- **Genel RTSP/RTMP stream'ler**

### Gerekli Araçlar

**ÖNEMLİ:** YouTube live stream kullanmak için yt-dlp ZORUNLU.

```bash
# YouTube live stream için (ZORUNLU)
brew install yt-dlp

# Twitch için (opsiyonel)
brew install streamlink

# İkisini de yükleyin - otomatik olarak uygun olan seçilir
```

### Kullanım Örnekleri

#### YouTube Live Stream

```bash
cd ~/Desktop/ObservAI

# YouTube live yayın linki ile
./start_camera.sh "https://www.youtube.com/watch?v=LIVE_VIDEO_ID" --display

# YouTube şu anda canlı olan bir kanal
./start_camera.sh "https://www.youtube.com/@channel/live" --display
```

#### Twitch Live Stream

```bash
./start_camera.sh "https://www.twitch.tv/channel_name" --display
```

#### Doğrudan RTSP/RTMP Stream

```bash
# IP kamera
./start_camera.sh "rtsp://192.168.1.100:554/stream" --display

# RTMP stream
./start_camera.sh "rtmp://server.com/live/stream" --display
```

#### Python Modülü ile Kullanım

```bash
cd ~/Desktop/ObservAI/observai/packages/camera-analytics
source .venv/bin/activate

# YouTube
python -m camera_analytics --source "https://www.youtube.com/watch?v=VIDEO_ID" --display

# Twitch
python -m camera_analytics --source "https://www.twitch.tv/channel" --display
```

### Nasıl Çalışır?

1. **URL Algılama:** Sistem YouTube/Twitch gibi URL'leri otomatik algılar
2. **Stream Çıkarma:** yt-dlp veya streamlink ile gerçek stream URL'ini çıkarır
3. **OpenCV Bağlantısı:** Çıkarılan URL OpenCV'ye beslenir
4. **Analiz:** Normal kamera gibi gerçek zamanlı analiz yapılır

### İpuçları

- **Kalite:** `yt-dlp -f best` ile en iyi kalite alınır
- **Gecikme:** Canlı yayınlarda 5-30 saniye gecikme olabilir
- **Bant Genişliği:** HD stream için hızlı internet gerekir
- **Stabilite:** Stream kesilirse otomatik yeniden bağlanma yoktur

---

## 🖥️ Web Dashboard

### Erişim

```
http://localhost:5174
```

### Sayfalar

#### 1. Ana Sayfa (/)

- ObservAI tanıtımı
- Modül linkleri

#### 2. Dashboard (/dashboard)

- Genel restoran metrikleri
- Bugünkü satışlar
- Aktif siparişler
- Popüler ürünler

#### 3. Kamera Analytics (/camera)

**Gerçek zamanlı kamera analizleri:**

- Mevcut ziyaretçi sayısı
- Giriş/Çıkış istatistikleri
- Yaş dağılımı grafiği
- Cinsiyet dağılımı grafiği
- Isı haritası (heatmap)
- Masa doluluk durumu
- Zaman serisi grafikleri

#### 4. POS (/pos)

- Hızlı satış noktası
- Sipariş oluşturma
- Kasa işlemleri

#### 5. Menu (/menu)

- Menü yönetimi
- Kategori ve ürün düzenleme
- Fiyatlandırma

#### 6. Kitchen (/kitchen)

- Mutfak ekranı
- Öncelikli siparişler
- Sipariş durumu

#### 7. Inventory (/inventory)

- Stok takibi
- Malzeme yönetimi
- Satıcı bilgileri

#### 8. Alerts (/alerts)

- Sistem uyarıları
- Eşik bildirimleri

#### 9. Settings (/settings)

- Organizasyon ayarları
- Mağaza yönetimi
- Vergi ve roller

---

## 🔌 Port Yönetimi

### Kullanılan Portlar

| Servis         | Port | Açıklama                    |
| -------------- | ---- | --------------------------- |
| Backend API    | 3001 | NestJS REST API             |
| Web Frontend   | 5174 | React Vite                  |
| Kamera Servisi | 8002 | FastAPI (iPhone overlay)    |
| AI İşleme      | 8001 | Python Analytics (internal) |

### Port Çakışması Hatası

```bash
# Tüm portları temizle
lsof -ti:3001 | xargs kill -9
lsof -ti:5174 | xargs kill -9
lsof -ti:8002 | xargs kill -9
lsof -ti:8001 | xargs kill -9
```

### Port Kontrol

```bash
# Belirli bir portu kim kullanıyor?
lsof -i :3001

# Tüm ObservAI servislerini göster
lsof -i :3001 -i :5174 -i :8002 -i :8001
```

---

## 🐛 Sorun Giderme

### 1. "pip: command not found"

**Çözüm:**

```bash
# pip yerine python3 -m pip kullan
python3 -m pip install -r requirements.txt
```

### 2. "No module named 'fastapi'"

**Çözüm:**

```bash
cd ~/Desktop/ObservAI/observai/apps/ai-camera
python3 -m pip install -r requirements.txt
```

### 3. "Cannot GET /" (404 hatası)

**Açıklama:** Bu normaldir. Servisler çalışıyor.

**Kontrol:**

- Backend API health check: http://localhost:3001/health
- Web Frontend: http://localhost:5174
- iPhone Overlay: http://localhost:8002

### 4. Kamera açılmıyor

**Kontrol listesi:**

```bash
# Kamera izinlerini kontrol et
# System Preferences > Security & Privacy > Camera

# Kameraları listele
python3 -c "import cv2; [print(f'Cam {i}') for i in range(5) if cv2.VideoCapture(i).read()[0]]"
```

### 5. iPhone'dan bağlanamıyorum

**Kontrol:**

1. Aynı WiFi ağında mısınız?

   ```bash
   ifconfig | grep "inet "
   ```

2. Mac'in firewall'u kapalı mı?

   ```bash
   # System Preferences > Security & Privacy > Firewall
   # "Turn Off Firewall" veya Python'a izin ver
   ```

3. Port açık mı?
   ```bash
   lsof -i :8002
   ```

### 6. Live stream URL çıkartılamıyor

**YouTube Live için ZORUNLU:**

```bash
# yt-dlp yükle (yoksa)
brew install yt-dlp

# Güncelle (varsa)
brew upgrade yt-dlp

# Manuel test
yt-dlp -f "95/96/best" -g "YOUTUBE_LIVE_URL"

# Twitch için streamlink
brew install streamlink
streamlink --stream-url "TWITCH_URL" best
```

**Not:** YouTube YOLO ile doğrudan çalışmaz - yt-dlp stream URL'ini çıkartır, OpenCV'ye besler.

### 7. WebSocket bağlantısı kesildi

**iPhone Overlay'de görüyorsanız:**

- AI analiz motorunun (Terminal 3) çalıştığından emin olun
- `data/camera/latest_metrics.json` dosyasının oluştuğunu kontrol edin:
  ```bash
  ls -la ~/Desktop/ObservAI/observai/data/camera/
  ```

### 8. TypeScript rootDir hatası

**Çözüm:** Bu düzeltildi. Eğer hala alıyorsanız:

```bash
cd ~/Desktop/ObservAI/observai
git pull origin main
pnpm install
```

---

## 📊 Veri Akışı

```
┌─────────────────┐
│  Kamera Kaynağı │
│  (iPhone/Web/   │
│  Live Stream)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AI Analiz Motoru       │
│  (camera-analytics)     │
│  Port: 8001 (internal)  │
│  • YOLO kişi tespiti    │
│  • Zone tracking        │
│  • Age/gender (opt)     │
└────────┬────────────────┘
         │
         ▼ (JSON)
┌─────────────────────────┐
│  data/camera/           │
│  latest_metrics.json    │
└────────┬────────────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌───────┐  ┌────────────┐
│ Camera│  │  Web       │
│Service│  │ Dashboard  │
│ 8002  │  │  5174      │
│       │  │            │
│iPhone │  │ • Grafik   │
│Overlay│  │ • Tablo    │
│       │  │ • Heatmap  │
└───────┘  └────────────┘
```

---

## 🎯 Hızlı Başlangıç Özeti

### En Basit Kullanım (Webcam)

```bash
# Terminal 1
cd ~/Desktop/ObservAI/observai && pnpm dev

# Terminal 2
cd ~/Desktop/ObservAI && ./start_camera.sh 0 --display

# Tarayıcı
http://localhost:5174
```

### iPhone Kamera Overlay

```bash
# Terminal 1
cd ~/Desktop/ObservAI/observai && pnpm dev

# Terminal 2
cd ~/Desktop/ObservAI/observai/apps/ai-camera && python3 main.py

# Terminal 3
cd ~/Desktop/ObservAI && ./start_camera.sh 1 --display

# iPhone Safari
http://[MAC_IP]:8002
```

### YouTube Live Analizi

```bash
# Terminal 1
cd ~/Desktop/ObservAI/observai && pnpm dev

# Terminal 2
cd ~/Desktop/ObservAI
./start_camera.sh "https://www.youtube.com/watch?v=LIVE_ID" --display

# Tarayıcı
http://localhost:5174/camera
```

---

## 📞 Destek

Sorun mu yaşıyorsunuz?

1. Bu kılavuzu kontrol edin
2. Logları kontrol edin:
   - Terminal çıktılarına bakın
   - Tarayıcı console'unu açın (F12)
3. GitHub Issues'a başvurun

---

## 🔄 Güncelleme

```bash
cd ~/Desktop/ObservAI/observai
git pull origin main
pnpm install
cd packages/camera-analytics
source .venv/bin/activate
pip install -e . --upgrade
```

---

**Son güncelleme:** 14 Ekim 2025
**Versiyon:** 1.0.0
