---
title: Dataguard vs Goldengate
tags:
  - replikasyon
  - oracle
  - etl
---

# Dataguard vs Goldengate

Bu not **veri alma (ingestion) aracı** kararının sahibidir. ODS tanımı [[ODS]], katman sözleşmesi [[DWH Hedef Mimarisi v2]], ortam gerçekleri [[Fiziksel Topoloji - Teknik Taraf]] notlarındadır.

> [!note] Not başlığı içeriğinden dar
> Artık sadece Dataguard/GoldenGate karşılaştırması değil; genel araç kararını taşıyor. `Veri Alma Araçları` adına taşınması gündemde.

## Başlangıç notları


- **GoldenGate:** Bakımı ve yönetimi zor, ama tablo bazında filtreleme yapılabilir.


- **GoldenGate heterojen kaynakları destekliyor** (Postgre, SQL Server dahil).


## Kısıtlar pazarın çoğunu baştan eliyor

Ürün listesine geçmeden önce; aşağıdaki dört gerçek, değerlendirmeye girmeden seçenekleri kesiyor:

1. **Veri kurum dışına çıkamaz** (düzenlemeye tabi piyasa altyapısı kurumu). Bu, SaaS ingestion katmanının tamamını eler: Fivetran, Airbyte Cloud, Matillion, Rivery.
2. **Kaynak ve hedef ikisi de Exadata.** Compute zaten satın alınmış durumda; doğru desen **hedefe pushdown yapan ELT**. Kendi ağır dönüşüm motorunu getiren araçlar compute'u ikinci kez satın almak olur.
3. **Ekip profili Oracle DBA + PL/SQL**, Python/Kafka platform ekibi değil. Streaming platformu gerektiren her seçenek gizli bir kadro maliyeti taşır.
4. **Satın alma süreci yavaş.** 

## Kategoriler

### 1. Oracle-native

GoldenGate, ODI,, external table / `SQL*Loader`. Tek tedarikçi, tek destek sözleşmesi, Exadata'ya pushdown, DBA'ler için yeni öğrenme yok. Detaylı kırılım aşağıda.

### 2. Klasik kurumsal ETL suit'leri

Informatica PowerCenter / IDMC, IBM DataStage, SAP Data Services, Ab Initio, Talend (artık Qlik).



### 3. Bağımsız CDC / replikasyon ürünleri

Not'ta eksik olan kategori, ve ilginç olan:

- **Qlik Replicate** (eski Attunity) ve **Quest SharePlex** — log tabanlı Oracle CDC. Bankalarda yaygın olma sebebi tam olarak GoldenGate'ten **çok daha kolay işletilmeleri**. Kendi notumuz GG için "bakımı zor" diyor; bu ürünler o şikâyetin evrensel olmasından doğdu.
- Ayrıca: IBM InfoSphere Data Replication, Precisely Connect CDC, Striim, Fivetran HVR (SaaS connector'ları değil, on-prem çalışan ürün).

### 4. Açık kaynak

**Debezium** → Kafka → Kafka Connect ile landing. Lisans maliyeti sıfır, mühendislik maliyeti gerçek: Kafka ve onu sahiplenen bir ekip gerekiyor. Debezium'un Oracle connector'ı ya **XStream** (GoldenGate lisansı ister — ) kullanır. Sadece Takasbank'ta hâlihazırda ekibiyle işleyen bir Kafka varsa mantıklı ki yok



## GoldenGate vs ODI — aynı işi yapmıyorlar

Bunlar alternatif değil, **farklı rollerde** araçlar. Oracle da ikisini birlikte konumlandırıyor (ODI, GG'nin beslediği journal tablolarını JKM ile tüketebiliyor).

- **GoldenGate = CDC / replikasyon.** Log tabanlı, satır seviyesi, düşük gecikme. Dönüşüm yapmaz, iş akışı yönetmez.
- **ODI = ELT / orkestrasyon.** Batch, dönüşüm yapar, küme bazlı SQL üretip **hedef veritabanında** çalıştırır. Dosya ve JDBC kaynaklarını doğrudan destekler.

Doğrulanması gereken kaynak adaylarına göre kapsama:

| Kaynak | GoldenGate | ODI |
|---|---|---|
| [[Kale]] | Log tabanlı CDC, tablo bazında filtre | Batch; log tabanlı CDC'si GG olmadan yok |
| Arşiv, ÇekDB | Var | Var |
| BIST DB | Pratikte hayır (başka kurumun log'una erişim) | Zamanlanmış çekim — doğal yer |
| CSV / FTP | **Yok** — GG kaynak olarak transaction log okur | Native dosya desteği |
| Postgre / MSSQL | Var | JDBC ile var |
| LND→CORE→ODS/DM/PUB dönüşümleri | Yok | Asıl işi |

Sonuç: **GoldenGate tek başına yetmez** (dosya bacağını ve tüm dönüşümü kapatamaz). **ODI tek başına yetebilir**; tek zayıf noktası prod Kale'de log tabanlı CDC.

## Seçeneklerin bizim durumumuza göre puanı

| Seçenek | Dosya/FTP | Heterojen | Gün içi | İşletme yükü | Satın alma |
|---|---|---|---|---|---|
| ODI | Native | JDBC | Sadece batch | Orta | Yeni lisans |
| GoldenGate | Yok | Var | Var | Yüksek | Yeni lisans |
| Qlik Replicate / SharePlex | Kısıtlı | Var | Var | Düşük–orta | Yeni tedarikçi |
| Informatica PowerCenter / IDMC | Native | Var | CDC opsiyonuyla | Orta | **Mevcut tedarikçi** |
| Debezium + Kafka | Yok | Var | Var | Yüksek | Lisans bedava, işletmesi pahalı |
| External table + PL/SQL + dbt | Native | Gateway ile | Yok | Düşük | **Maliyetsiz** |

## Kale bacağı: CDC'ye gerçekten ihtiyaç var mı

ODI'nin Kale'de GG'siz CDC seçenekleri trigger veya timestamp/watermark kolonu. Prod Exadata OLTP'sine trigger koymak kötü fikir; watermark ise kaynakta güvenilir değişiklik tarihi olmasını gerektirir — geçmiş dataya update gelebildiği için ([[Aktif Sorular]]) bu Kale'de şüpheli.



## Gecikme sınıfı araçtan önce gelir

[[DWH Hedef Mimarisi v2]] her veri ürününü ayrı sınıflandırır:

- **S0:** olay yakın gerçek zamanlı,
- **S1:** gün içi mikro-batch,
- **S2:** gün sonu,
- **S3:** planlı dosya/harici besleme,
- **S4:** backfill/replay.

GoldenGate veya başka CDC ürünü yalnızca S0/S1 gereksinimi kaynak ve iş SLA'sıyla kanıtlanan akışlarda değerlendirilir. Bir kritik raporun saat bazında SLA'sı olması, bütün DWH'ın streaming olması gerektiği anlamına gelmez.



## Araç ne olursa olsun yapılmayacaklar

- Prod Kale'ye **trigger** veya **materialized view log** koymak — ikisi de canlı işlem sistemine yazma yükü ekler.
- Prod Kale'yi **doğrudan dblink** ile sorgulamak.

Kale'yi okuyan her yol `sur` üstündeki replikayı kullanır; diğer kaynaklar kendi onaylı landing yolundan gelir.

İlgili notlar: [[ODS]] · [[DWH Hedef Mimarisi v2]] · [[DWH Mimari Tasarım]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[Aktif Sorular]] · [[Proje Planı]] ([[Ortamlar hakkında]])
