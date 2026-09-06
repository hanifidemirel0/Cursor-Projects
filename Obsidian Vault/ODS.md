---
title: ODS
tags:
  - dwh
  - kavram
  - ods
---

# ODS

Operational Data Store. Takasbank hedef mimarisinde kurumsal core'un **güncel-durum projeksiyonu**.

## Kapsam kararı

Mevcut `tvsods` DB'si [[Kale]] ile anlık senkron bir kopya. Bu **ODS değil**: hiçbir şeyi entegre etmiyor ve `kaledb`'nin zaten iki replikası varken ([[Fiziksel Topoloji - Teknik Taraf]]) aynı verinin üçüncü kopyasını, yükünü azaltmaya çalıştığımız makinede tutuyor.

ODS yeniden tanımlandı: Kale'nin aynası değil, **çok kaynaklı** entegre katman.

Kaynaklar: [[Kale]] · Arşiv · ÇekDB · **BIST DB** (Borsa'nın veri ambarı) · **FTP ile gelen CSV dosyaları** · muhtemel Postgre / MSSQL kaynakları.

## Katman sınırları

Üç farklı sorumluluk birbirine karıştırılmaz:

- **Landing (`LND_<kaynak>`)** — Kaynağın ne teslim ettiğini kanıtlar ve replay sağlar.
- **Kurumsal core (`CORE_*`)** — Entegre anlamı, kimlik çözümlemeyi ve bitemporal tarihçeyi sahiplenir.
- **ODS (`ODS_*`)** — Core'un şu anda geçerli kaydını operasyonel tüketim için projekte eder.

Detaylı katman sözleşmesi ve yükleme desenleri: [[DWH Hedef Mimarisi v2]]

## Kararlar

- **ODS koşullu rapor verir.** "Güncel veri lazım, tam tarihçe lazım değil" sınıfı raporlar adaydır. Rapor envanteri ve SLA olmadan ODS tablosu açılmaz: [[Proje Planı]].
- **Current view tarihçe değildir.** “Dün saat 10'da ne biliyorduk?” sorusu ODS'den değil bitemporal core'dan cevaplanır.
- **ODS mart değildir.** Yoğun aggregate, metrik ve yıldız şema `DM_*` katmanına aittir.
- **ODS işlem sistemi değildir.** Canlı takas/ödeme/teminat defterine yazmaz ve kaynak uygulamanın komut işlevini üstlenmez.
- **Fiziksel yerleşim açık karardır.** Hedef; kapasite, HA, workload ve gecikme testiyle belirlenir: [[Aktif Sorular]].

## Kaynak kapsamı

Kaynak adayları ve ingestion yolları [[Dataguard vs Goldengate]], hassasiyet/sahiplik bilgisi [[PowerDesigner]], kurum içi kapsam boşlukları [[Aktif Sorular]] notlarındadır.

Kaynak türü ODS'e doğrudan bağlantı vermez. Bütün veri önce landing ve kurumsal sözleşmeden geçer. Dış kurum ambarından gelen besleme, sunduğu grain ve yayın penceresiyle alınır; ODS onu yapay biçimde işlem seviyesine dönüştürmez.

## Sonuçları

- **Replikasyon:** Dataguard sadece Oracle→Oracle; Postgre/MSSQL/CSV'yi hiç alamaz. Yani heterojen bir yol her hâlükârda gerekiyor: [[Dataguard vs Goldengate]]
- **Maskeleme sınırı yukarı taşındı:** hassas veri artık DWH değil **ODS** sınırında iniyor. Her kaynağın PowerDesigner hassasiyet eşlemesi landing'den önce yapılmalı: [[PowerDesigner]] · [[Aktif Sorular]]
- **BIST DB bir OLTP kaynağı değil**, başka bir kurumun ambarı: grain'ini ve tazeleme penceresini devralırsın, real-time alınamaz. Conformed dış besleme olarak ele alınır.

Hedef: [[DWH]]
