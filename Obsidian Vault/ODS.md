---
title: ODS
tags:
  - dwh
  - kavram
  - ods
---

# ODS

Operational Data Store. Takasbank'ta **tüm kaynakların toplandığı** entegre operasyonel katman.

## Kapsam kararı

Mevcut `tvsods` DB'si [[Kale]] ile anlık senkron bir kopya. Bu **ODS değil**: hiçbir şeyi entegre etmiyor ve `kaledb`'nin zaten iki replikası varken ([[Fiziksel Topoloji - Teknik Taraf]]) aynı verinin üçüncü kopyasını, yükünü azaltmaya çalıştığımız makinede tutuyor.

ODS yeniden tanımlandı: Kale'nin aynası değil, **çok kaynaklı** entegre katman.

Kaynaklar: [[Kale]] · Arşiv · ÇekDB · **BIST DB** (Borsa'nın veri ambarı) · **FTP ile gelen CSV dosyaları** · muhtemel Postgre / MSSQL kaynakları.

## İki ayrı katman

"Her şeyin durduğu yer" ile "entegre operasyonel katman" aynı şey değil; ikisi ayrı sözleşme:

- **Landing (`LND_<kaynak>`)** — kaynak şeklinde, dönüşümsüz, kaynak başına ayrı şema. Tam tarihçe, append-only (PSA). Sadece ETL erişir.
- **ODS (`ODS_*`)** — entegre, güncel değerli, temizlenmiş; `üye` burada bir kez çözülür.

Detaylı katman sözleşmesi ve yükleme desenleri: [[DWH Mimari Tasarım]]

## Kararlar

- **ODS rapor verir.** "Güncel veri lazım, tarihçe lazım değil" sınıfı raporların cevabı ODS. Hangi raporun buradan çıkacağı rapor envanteriyle netleşir: [[Proje Planı]]
- **Landing tam tarihçe tutar** (immutable, append-only). Gerekçe: geçmiş dataya update gelebiliyor ([[Aktif Sorular]]), dolayısıyla mart'ları sıfırdan yeniden üretebilmek gerekiyor. Exadata'da HCC bu maliyeti taşıyabilir.
- **Kale replikası silinmiyor, mimari katman olmaktan çıkıyor.** `sur` üstündeki replika ODS beslemesinin **okuma kaynağı** olur; böylece ETL prod Kale'ye hiç dokunmaz.
- **Yerleşim değişmeli:** çok kaynaklı ve büyüyen bir ODS, yükünü azaltmaya çalıştığımız kale Exadata'sında kalamaz. Mevcut yerleşim: [[Fiziksel Topoloji - Teknik Taraf]]

## Sonuçları

- **Replikasyon:** Dataguard sadece Oracle→Oracle; Postgre/MSSQL/CSV'yi hiç alamaz. Yani heterojen bir yol her hâlükârda gerekiyor: [[Dataguard vs Goldengate]]
- **Maskeleme sınırı yukarı taşındı:** hassas veri artık DWH değil **ODS** sınırında iniyor. Her kaynağın PowerDesigner hassasiyet eşlemesi landing'den önce yapılmalı: [[PowerDesigner]] · [[Aktif Sorular]]
- **BIST DB bir OLTP kaynağı değil**, başka bir kurumun ambarı: grain'ini ve tazeleme penceresini devralırsın, real-time alınamaz. Conformed dış besleme olarak ele alınır.

Hedef: [[DWH]]
