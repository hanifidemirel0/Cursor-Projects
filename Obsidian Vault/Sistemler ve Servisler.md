---
title: Sistemler ve Servisler
tags:
  - dwh
  - kavram
  - replikasyon
  - oracle
  - etl
  - kaynak
  - kale
  - ods
  - powerdesigner
  - veri-sahiplendirme
---

# Sistemler ve Servisler

[[#1. DWH|DWH]] · [[#2. Goldengate|Goldengate]] · [[#3. Kale|Kale]] · [[#4. ODS|ODS]] · [[#5. PowerDesigner|PowerDesigner]]

## 1. DWH

Takasbank veri ambarı. OneNote notlarından derlenen amaç ve açık sorular.

### 1.1 Amaç

1. [[Sistemler ve Servisler#3. Kale|Kale]] üzerindeki yükü azaltmak; Exadata'yı sürekli büyütmek çözüm değil.
2. Yapay zeka: veriyi DWH'dan okumak daha hızlı ve temiz olacak. Semantik layer ileride AI için faydalı.
3. MSTR'da self-servis BI (sürükle-bırak) henüz yok; grain'i düzgün tablolarla önü açılacak.

### 1.2 Mevcut raporlama

Operasyonel kullanıcılar (iş birimleri) **Team Developer** kullanıyor; raporlar peyderpey UG'nin yönettiği web tarafına aktarılıyor. Nihai hedef MSTR. Üyelerin terminal ekranlarına açılan raporlar da var. ([[Takasbank Genel Bilgilendirme 2]])

### 1.3 Mimari

- Başlangıç duruşu, fazlar ve yönlendirme kararları: [[Başlangıç Yaklaşımı]]
- Güncel hedef: [[DWH Hedef Mimarisi v2]]
- Korunan ilk taslak: [[DWH Mimari Tasarım]]

İş alanları ve kurumsal varlık modeli: [[Takasbank İş Alanları ve Temel Varlıklar]]

Mantıksal veri modeli: [[DWH Logical Data Model]]

### 1.4 Açık sorular

[[Aktif Sorular]]

### 1.5 Plan

[[Proje Planı]]

## 2. Goldengate

Bu bölüm **veri alma (ingestion) aracı** kararının sahibidir. ODS tanımı [[Sistemler ve Servisler#4. ODS|ODS]], katman sözleşmesi [[DWH Hedef Mimarisi v2]], ortam gerçekleri [[Fiziksel Topoloji - Teknik Taraf]] notlarındadır.

> [!note] ODS bacağı kararlaştı
> `ODS_` şemaları GoldenGate ile beslenir: [[#4.1 Karar|ODS kararı (02.11.2026)]]. Takasbank'ın 336 CPU'luk GG lisansı var; Borsa İstanbul'un da lisansı olduğu için iki kurum arasında GG akışı kurulabilir: [[Fiziksel Topoloji - Teknik Taraf#GoldenGate lisansları|GoldenGate lisansları]]. Aşağıdaki değerlendirme GG'nin alamadığı kaynaklar (dosya, web servisleri) ve DWH içi dönüşüm aracı için geçerliliğini korur.

### 2.1 Başlangıç notları


- **GoldenGate:** Bakımı ve yönetimi zor, ama tablo bazında filtreleme yapılabilir.


- **GoldenGate heterojen kaynakları destekliyor** (Postgre, SQL Server dahil).


### 2.2 Kısıtlar pazarın çoğunu baştan eliyor

Ürün listesine geçmeden önce; aşağıdaki dört gerçek, değerlendirmeye girmeden seçenekleri kesiyor:

1. **Veri kurum dışına çıkamaz** (düzenlemeye tabi piyasa altyapısı kurumu). Bu, SaaS ingestion katmanının tamamını eler: Fivetran, Airbyte Cloud, Matillion, Rivery.
2. **Kaynak ve hedef ikisi de Exadata.** Compute zaten satın alınmış durumda; doğru desen **hedefe pushdown yapan ELT**. Kendi ağır dönüşüm motorunu getiren araçlar compute'u ikinci kez satın almak olur.
3. **Ekip profili Oracle DBA + PL/SQL**, Python/Kafka platform ekibi değil. Streaming platformu gerektiren her seçenek gizli bir kadro maliyeti taşır.
4. **Satın alma süreci yavaş.** 

### 2.3 Kategoriler

#### 2.3.1 Oracle-native

GoldenGate, ODI,, external table / `SQL*Loader`. Tek tedarikçi, tek destek sözleşmesi, Exadata'ya pushdown, DBA'ler için yeni öğrenme yok. Detaylı kırılım aşağıda.

#### 2.3.2 Klasik kurumsal ETL suit'leri

Informatica PowerCenter / IDMC, IBM DataStage, SAP Data Services, Ab Initio, Talend (artık Qlik).



#### 2.3.3 Bağımsız CDC / replikasyon ürünleri

Not'ta eksik olan kategori, ve ilginç olan:

- **Qlik Replicate** (eski Attunity) ve **Quest SharePlex** — log tabanlı Oracle CDC. Bankalarda yaygın olma sebebi tam olarak GoldenGate'ten **çok daha kolay işletilmeleri**. Kendi notumuz GG için "bakımı zor" diyor; bu ürünler o şikâyetin evrensel olmasından doğdu.
- Ayrıca: IBM InfoSphere Data Replication, Precisely Connect CDC, Striim, Fivetran HVR (SaaS connector'ları değil, on-prem çalışan ürün).

#### 2.3.4 Açık kaynak

**Debezium** → Kafka → Kafka Connect ile landing. Lisans maliyeti sıfır, mühendislik maliyeti gerçek: Kafka ve onu sahiplenen bir ekip gerekiyor. Debezium'un Oracle connector'ı ya **XStream** (GoldenGate lisansı ister — ) kullanır. Sadece Takasbank'ta hâlihazırda ekibiyle işleyen bir Kafka varsa mantıklı ki yok



### 2.4 GoldenGate vs ODI — aynı işi yapmıyorlar

Bunlar alternatif değil, **farklı rollerde** araçlar. Oracle da ikisini birlikte konumlandırıyor (ODI, GG'nin beslediği journal tablolarını JKM ile tüketebiliyor).

- **GoldenGate = CDC / replikasyon.** Log tabanlı, satır seviyesi, düşük gecikme. Dönüşüm yapmaz, iş akışı yönetmez.
- **ODI = ELT / orkestrasyon.** Batch, dönüşüm yapar, küme bazlı SQL üretip **hedef veritabanında** çalıştırır. Dosya ve JDBC kaynaklarını doğrudan destekler.

Doğrulanması gereken kaynak adaylarına göre kapsama:

| Kaynak | GoldenGate | ODI |
|---|---|---|
| [[Sistemler ve Servisler#3. Kale\|Kale]] | Log tabanlı CDC, tablo bazında filtre | Batch; log tabanlı CDC'si GG olmadan yok |
| Arşiv, ÇekDB | Var | Var |
| BIST DB | Var — Borsa İstanbul'un da GG lisansı var; kurumlar arası akış kurulabilir ([[Fiziksel Topoloji - Teknik Taraf#GoldenGate lisansları\|GoldenGate lisansları]]) | Zamanlanmış çekim |
| CSV / FTP | **Yok** — GG kaynak olarak transaction log okur | Native dosya desteği |
| Postgre / MSSQL | Var | JDBC ile var |
| LND→CORE→ODS/DM/PUB dönüşümleri | Yok | Asıl işi |

Sonuç: **GoldenGate tek başına yetmez** (dosya bacağını ve tüm dönüşümü kapatamaz). **ODI tek başına yetebilir**; tek zayıf noktası prod Kale'de log tabanlı CDC.

### 2.5 Seçeneklerin bizim durumumuza göre puanı

| Seçenek | Dosya/FTP | Heterojen | Gün içi | İşletme yükü | Satın alma |
|---|---|---|---|---|---|
| ODI | Native | JDBC | Sadece batch | Orta | Yeni lisans |
| GoldenGate | Yok | Var | Var | Yüksek | **Mevcut lisans** (336 CPU) |
| Qlik Replicate / SharePlex | Kısıtlı | Var | Var | Düşük–orta | Yeni tedarikçi |
| Informatica PowerCenter / IDMC | Native | Var | CDC opsiyonuyla | Orta | **Mevcut tedarikçi** |
| Debezium + Kafka | Yok | Var | Var | Yüksek | Lisans bedava, işletmesi pahalı |
| External table + PL/SQL + dbt | Native | Gateway ile | Yok | Düşük | **Maliyetsiz** |

### 2.6 Kale bacağı: CDC'ye gerçekten ihtiyaç var mı

ODI'nin Kale'de GG'siz CDC seçenekleri trigger veya timestamp/watermark kolonu. Prod Exadata OLTP'sine trigger koymak kötü fikir; watermark ise kaynakta güvenilir değişiklik tarihi olmasını gerektirir — geçmiş dataya update gelebildiği için ([[Aktif Sorular]]) bu Kale'de şüpheli.



### 2.7 Gecikme sınıfı araçtan önce gelir

[[DWH Hedef Mimarisi v2]] her veri ürününü ayrı sınıflandırır:

- **S0:** olay yakın gerçek zamanlı,
- **S1:** gün içi mikro-batch,
- **S2:** gün sonu,
- **S3:** planlı dosya/harici besleme,
- **S4:** backfill/replay.

`ODS_` şemaları kararla GoldenGate'ten beslenir ([[#4.1 Karar|ODS]]). Bunun dışındaki akışlarda CDC yalnızca S0/S1 gereksinimi kaynak ve iş SLA'sıyla kanıtlandığında değerlendirilir. Bir kritik raporun saat bazında SLA'sı olması, bütün DWH katmanlarının streaming olması gerektiği anlamına gelmez.



### 2.8 Araç ne olursa olsun yapılmayacaklar

- Prod Kale'ye **trigger** veya **materialized view log** koymak — ikisi de canlı işlem sistemine yazma yükü ekler.
- Prod Kale'yi **doğrudan dblink** ile sorgulamak.

Kale'yi okuyan batch yollar `sur` üstündeki replikayı kullanır; diğer kaynaklar kendi onaylı landing yolundan gelir. GoldenGate extract'ının prod Kale'den mi standby'dan mı (downstream / ADG kaynaklı extract) okuyacağı ve prod'da supplemental logging etkisi açık: [[Aktif Sorular]] madde 4.

İlgili notlar: [[Sistemler ve Servisler#4. ODS|ODS]] · [[DWH Hedef Mimarisi v2]] · [[DWH Mimari Tasarım]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[Aktif Sorular]] · [[Proje Planı]] ([[Ortamlar hakkında]])

## 3. Kale

Takasbank'ın **ana veritabanı**. Tüm verinin yaklaşık **%90**'ı burada tutuluyor. Diğer kaynaklar: Arşiv, ÇekDB.

- Birden fazla şemada üye tablosu olabiliyor (DQ sorunu).
- Her piyasanın kendi üye tablosu da olabiliyor.
- DWH'ın birinci amacı Kale yükünü azaltmak.

Bkz. [[Takasbank Genel Bilgilendirme]], [[Sistemler ve Servisler#5. PowerDesigner|PowerDesigner]], [[Sistemler ve Servisler#4. ODS|ODS]], [[Sistemler ve Servisler#1. DWH|DWH]], [[Aktif Sorular]].

## 4. ODS

Operational Data Store. Takasbank hedef mimarisinde kaynak sistem verisinin, DWH veritabanı içinde GoldenGate ile güncel tutulan **kaynak şeklindeki kopyası**.

### 4.1 Karar

> [!important] ODS kararı (02.11.2026)
> Kaynak: Hanifi'nin 02.11.2026 tarihli aktarımı ("ods ile ilgili son karar").
>
> - **ODS için ayrı bir veritabanı olmayacak.** ODS, DWH veritabanının içinde konumlanır.
> - **Her kaynak sistem şeması için DWH'da `ODS_` önekli bir şema** oluşturulur (ör. Kale `BANKA` şeması → `ODS_BANKA`).
> - **`ODS_` şemaları GoldenGate ile beslenir.**
>
> Bu karar şunların yerine geçer: [[Başlangıç Yaklaşımı]]'nın Ekim 2026 önerisi (ayrı fiziksel ODS yok, entegre güncel-durum core üstünde projeksiyon, gün içi raporlama standby'dan), [[DWH Sunum Temmuz 2025]]'teki "ODS, kale Exadata'da 4. veritabanı" yerleşimi, [[DWH Hedef Mimarisi v2]]'deki "ODS = core projeksiyonu" tanımı. v2 yönetici özetindeki "ods, dwh ile aynı veritabanında; her kaynak sistem için ayrı şema" maddesiyle uyumludur.

### 4.2 Kararın sonuçları

- **ODS kaynak şeklindedir, entegre değildir.** `ODS_<şema>` kaynak tabloların güncel durumunu yapısını koruyarak taşır. Üye/hesap kimlik çözümlemesi ve kurumsal anlam `CORE_*`'da kalır; çok kaynaklı birleştirme gerektiren rapor ODS'den değil core/mart'tan verilir.
- **`tvsods` hedef mimaride yer almaz.** Ayrı ODS veritabanı olmayacağı için Kale ile anlık senkron `tvsods` kopyası, `ODS_` şemaları devreye girdikten sonra gereksizleşir. Kapatma takvimi açık: [[Aktif Sorular]] madde 4.
- **ODS'in yeri DWH'ın yeridir.** Ayrı ODS yerleşimi sorusu kapandı; DWH veritabanının makinesi (`sur` / `hisar`) hâlâ açık: [[Fiziksel Topoloji - Teknik Taraf#DWH yerleşim adayları]].
- **GoldenGate ODS bacağının aracıdır.** Lisans mevcut (336 CPU: [[Fiziksel Topoloji - Teknik Taraf#GoldenGate lisansları|GoldenGate lisansları]]). Sürüm/destek kontrolü, extract kaynağı (prod Kale / `sur` standby) ve işletme sahipliği (DBA ekibi GG'ye güvenmiyor, 7/24 ekibi yok) ön koşul hâline geldi: [[Aktif Sorular]] madde 4 ve 14.2. Dönüşüm/ELT aracı ayrı karardır: [[#2. Goldengate|Goldengate]]
- **Hassas veri ODS sınırında iner.** Kaynak şemalar DWH'a ham geldiği için PowerDesigner hassasiyet eşlemesi ve erişim kontrolü `ODS_` şemaları açılmadan yapılmalı: [[#5. PowerDesigner|PowerDesigner]] · [[Aktif Sorular]] madde 6.
- **Kapasite:** Kaynak şemaların güncel kopyası DWH kapasitesine kaynak hacmini (kaledb ~10 TB) ekler.

### 4.3 Katman sınırları

- **ODS (`ODS_<kaynak şema>`)** — Kaynak şemanın GoldenGate ile güncel tutulan kopyası; kaynak şeklinde, güncel değerli.
- **Landing (`LND_<kaynak>`)** — Kaynağın ne teslim ettiğini kanıtlar ve replay sağlar. Landing'in `ODS_`'den mi yoksa kaynaktan ayrı çıkarımla mı besleneceği açık: [[Aktif Sorular]] madde 4.
- **Kurumsal core (`CORE_*`)** — Entegre anlamı, kimlik çözümlemeyi ve bitemporal tarihçeyi sahiplenir.

Detaylı katman sözleşmesi: [[DWH Hedef Mimarisi v2]]

Değişmeyen kurallar:

- **Current view tarihçe değildir.** "Dün saat 10'da ne biliyorduk?" sorusu ODS'den değil bitemporal core'dan cevaplanır.
- **ODS mart değildir.** Yoğun aggregate, metrik ve yıldız şema `DM_*` katmanına aittir.
- **ODS işlem sistemi değildir.** Canlı takas/ödeme/teminat defterine yazmaz ve kaynak uygulamanın komut işlevini üstlenmez.

### 4.4 Kaynak kapsamı

Kaynak adayları: [[Sistemler ve Servisler#3. Kale|Kale]] · Arşiv · ÇekDB · **BIST DB** (Borsa'nın veri ambarı) · **FTP ile gelen CSV dosyaları** · muhtemel Postgre / MSSQL kaynakları.

GoldenGate transaction log okuyan bir CDC aracıdır; veritabanı kaynakları (Kale, Arşiv, ÇekDB, Postgre/MSSQL) için uygundur. BIST DB / Replica BIDB için, Borsa İstanbul'un da GG lisansı olduğundan kurumlar arası GG akışı kurulabilir ([[Fiziksel Topoloji - Teknik Taraf#GoldenGate lisansları|GoldenGate lisansları]]). FTP/CSV ve web servisleri için GG yolu yoktur ([[#2.4 GoldenGate vs ODI — aynı işi yapmıyorlar|2.4]]). Bu kaynakların ODS'de yer alıp almayacağı açık: [[Aktif Sorular]] madde 4.

Hedef: [[Sistemler ve Servisler#1. DWH|DWH]]

## 5. PowerDesigner

Kaynak sistem kataloğu / veri sahiplendirme aracı. ER modeli tutulmuyor.

- Amaç: **veri sahiplendirme** (hassas veri flag'i, veri sahibi). Açıklama, primary key vb. de var.
- Her UG'nin kendi veri modeli var.
- Kurumsal mimari, düzenli **fark raporu** ile güncel tutuyor; bütün tablolar ve kolonlar içeride.
- BT mimari kontak: **Aytaç**.

Kaynak: [[PowerDesigner Bilgilendirme]] · [[Takasbank Genel Bilgilendirme 2]]
