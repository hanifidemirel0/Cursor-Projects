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

- **Dataguard:** Tablo bazında filtreleme yok. Ayrıca kullanılırsa target read-only olmak zorunda.
- **GoldenGate:** Bakımı ve yönetimi zor, ama tablo bazında filtreleme yapılabilir.

## Soru artık ya/ya değil

[[DWH Hedef Mimarisi v2]] birden çok kaynak türünü landing'e aldığı için karşılaştırma yeniden çerçevelendi:

- **Dataguard yalnızca Oracle→Oracle.** Postgre, MSSQL ve CSV kaynaklarını **hiç** alamaz; en fazla Kale bacağını kapatır.
- **GoldenGate heterojen kaynakları destekliyor** (Postgre, SQL Server dahil).
- Heterojen bir yol her hâlükârda gerekiyor. Dolayısıyla soru "hangisi" değil: "Kale bacağı + geri kalanı" nasıl bölünecek.

## Kısıtlar pazarın çoğunu baştan eliyor

Ürün listesine geçmeden önce; aşağıdaki dört gerçek, değerlendirmeye girmeden seçenekleri kesiyor:

1. **Veri kurum dışına çıkamaz** (düzenlemeye tabi piyasa altyapısı kurumu). Bu, SaaS ingestion katmanının tamamını eler: Fivetran, Airbyte Cloud, Matillion, Rivery.
2. **Kaynak ve hedef ikisi de Exadata.** Compute zaten satın alınmış durumda; doğru desen **hedefe pushdown yapan ELT**. Kendi ağır dönüşüm motorunu getiren araçlar compute'u ikinci kez satın almak olur.
3. **Ekip profili Oracle DBA + PL/SQL**, Python/Kafka platform ekibi değil. Streaming platformu gerektiren her seçenek gizli bir kadro maliyeti taşır.
4. **Satın alma süreci yavaş.** "Pilotu bu ay neyle açarım" sorusu, "hedef durumda hangi araç olmalı" sorusundan ayrıdır. → iki paralel yol, en altta.

## Kategoriler

### 1. Oracle-native

GoldenGate, ODI, Dataguard, external table / `SQL*Loader`. Tek tedarikçi, tek destek sözleşmesi, Exadata'ya pushdown, DBA'ler için yeni öğrenme yok. Detaylı kırılım aşağıda.

### 2. Klasik kurumsal ETL suit'leri

Informatica PowerCenter / IDMC, IBM DataStage, SAP Data Services, Ab Initio, Talend (artık Qlik).

Önemli nokta: **TDM üzerinden Informatica ile ticari ilişki zaten var** ([[Fiziksel Topoloji - Teknik Taraf]]). PowerCenter/IDMC hakkı eklemek, satın almada sıfırdan yeni tedarikçi onboard etmekten kolay ve ucuz olabilir. Oracle'ı tek yol saymadan önce bir Informatica hesap yöneticisi görüşmesi.

### 3. Bağımsız CDC / replikasyon ürünleri

Not'ta eksik olan kategori, ve ilginç olan:

- **Qlik Replicate** (eski Attunity) ve **Quest SharePlex** — log tabanlı Oracle CDC. Bankalarda yaygın olma sebebi tam olarak GoldenGate'ten **çok daha kolay işletilmeleri**. Kendi notumuz GG için "bakımı zor" diyor; bu ürünler o şikâyetin evrensel olmasından doğdu.
- Ayrıca: IBM InfoSphere Data Replication, Precisely Connect CDC, Striim, Fivetran HVR (SaaS connector'ları değil, on-prem çalışan ürün).

### 4. Açık kaynak

**Debezium** → Kafka → Kafka Connect ile landing. Lisans maliyeti sıfır, mühendislik maliyeti gerçek: Kafka ve onu sahiplenen bir ekip gerekiyor. Debezium'un Oracle connector'ı ya **XStream** (GoldenGate lisansı ister — yani yol daireye kapanıyor) ya **LogMiner** (kaynakta ağır) kullanır. Sadece Takasbank'ta hâlihazırda ekibiyle işleyen bir Kafka varsa mantıklı.

### 5. Sadece dönüşüm araçları

**dbt Core** (Oracle adapter) veya SQLMesh. Veri **almazlar**, ama "yeni lisans yok" yolunun asıl zayıflığını çözerler: versiyon kontrollü SQL, otomatik lineage grafiği, veri testleri — lisans maliyeti sıfır, çalıştığı yer Exadata'nın içi.

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

Ama üçüncü bir yol var: **`sur` üstündeki replikadan batch okuma**. Dataguard zaten Enterprise Edition'ın içinde; ODI replikayı batch okursa Kale CDC problemi büyük ölçüde ortadan kalkar. Gecikme = replika lag + batch penceresi; gün sonu sınıfındaki bir veri ürünü için yeterli olabilir.

Dolayısıyla **GoldenGate kararı, gecikme gereksinimi netleşmeden verilmemeli**: [[Aktif Sorular]] madde 3 (DWH'dan anlık rapor alınabilmeli mi?) bu kararın kapısı.

## Gecikme sınıfı araçtan önce gelir

[[DWH Hedef Mimarisi v2]] her veri ürününü ayrı sınıflandırır:

- **S0:** olay yakın gerçek zamanlı,
- **S1:** gün içi mikro-batch,
- **S2:** gün sonu,
- **S3:** planlı dosya/harici besleme,
- **S4:** backfill/replay.

GoldenGate veya başka CDC ürünü yalnızca S0/S1 gereksinimi kaynak ve iş SLA'sıyla kanıtlanan akışlarda değerlendirilir. Bir kritik raporun saat bazında SLA'sı olması, bütün DWH'ın streaming olması gerektiği anlamına gelmez.

## Öneri: tek karar değil, iki paralel yol

**A — Pilotu şimdi "yeni lisans yok" yoluyla başlat.** Kale bacağı Dataguard replikasından, CSV bacağı external table ile, dönüşümler **dbt Core** ile — böylece lineage ve testler ilk günden var, sonradan eklenmeye çalışılmaz. Kontrol, landing, gerekli party/üyelik core'u ve seçilen rapor/dosya aynı dikey dilimde kurulur; satın alma beklenmeden iş sonucu gösterilir.

**B — Hedef durum aracını paralelde değerlendir; GoldenGate'e karşı değil, geniş listeye karşı.** ODI mimari gerekçelerle (Exadata pushdown, tek tedarikçi desteği) hâlâ öneri, ama iki şey önce doğrulanmalı:

- ODI'nin **onaylanabilir bir fiyatla lisanslanabilir** olması — veritabanından ayrı lisanslanıyor, GoldenGate gibi.
- Informatica'nın mevcut **TDM ilişkisi üzerinden daha ucuz teklif** verip vermediği.

Gün içi gereksinimi gerçek çıkarsa: GoldenGate'i varsayılan kabul etmek yerine **Qlik Replicate / SharePlex ile birlikte** değerlendir — bu ürünlerin sattığı şey tam olarak "materyal olarak daha az işletme yüküyle düşük gecikmeli Oracle CDC".

## Araç ne olursa olsun yapılmayacaklar

- Prod Kale'ye **trigger** veya **materialized view log** koymak — ikisi de canlı işlem sistemine yazma yükü ekler.
- Prod Kale'yi **doğrudan dblink** ile sorgulamak.

Kale'yi okuyan her yol `sur` üstündeki replikayı kullanır; diğer kaynaklar kendi onaylı landing yolundan gelir.

İlgili notlar: [[ODS]] · [[DWH Hedef Mimarisi v2]] · [[DWH Mimari Tasarım]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[Aktif Sorular]] · [[Proje Planı]] ([[Ortamlar hakkında]])
