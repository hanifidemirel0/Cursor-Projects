---
title: DWH Mimari Tasarım
created: 2026-09-06T03:15:00
section: Kendi Notlarım
tags:
  - dwh
  - mimari
  - modelleme
  - takasbank
status: draft
---

# DWH Mimari Tasarım

Takasbank [[DWH]] için katman mimarisi, modelleme yaklaşımı ve yükleme desenleri. Bu not **tasarım kararlarının** sahibidir; ortam/donanım gerçekleri [[Fiziksel Topoloji - Teknik Taraf]], açık sorular [[Aktif Sorular]], faz planı [[Proje Planı]] notlarında.

> [!warning] Taslak
> Aşağıdaki kararlar iş birimleriyle (UG + operasyonel ekipler) doğrulanmadı. Rapor yerleşimi analizi yapılmadan kesinleşmez: [[Aktif Sorular]].

## Karar: hibrit yaklaşım

[[Inmon vs Kimball]] sorusuna cevap: **ikisi birlikte**. Normalize bir entegrasyon katmanı + üzerine Kimball star mart'ları.

Gerekçe: [[Kale]]'de aynı kavramın (özellikle `üye`) birden fazla şemada farklı tabloları var. Doğrudan mart üretmek bu tutarsızlığı mart'lara kopyalar. Entegrasyon katmanı `üye`yi bir kez çözer, mart'lar oradan beslenir.

Teslimat yine parça parça: her fazda **bir konu alanı** dikey olarak baştan sona (kaynak → mart → MSTR) tamamlanır. Topyekün entegrasyon beklenmez; entegrasyon katmanı konu alanı geldikçe büyür.

## Katmanlar

| Kod | Şema | İçerik | Tarihçe | Erişim |
|---|---|---|---|---|
| L0 | `LND_<kaynak>` | Kaynak şeklinde ham veri, dönüşüm yok | **Tam tarihçe, append-only (PSA)** | Sadece ETL |
| L1 | `ODS_*` | Entegre, güncel değerli, temizlenmiş | Güncel değerli | Operasyonel sorgu + rapor |
| L2 | `EDW` | Entegre, normalize, kurumsal tanım | Tam tarihçe (SCD2) | Sadece ETL + analist |
| L3 | `DM_<konu>` | Star schema: fact + dimension | Fact'te olay tarihçesi | MSTR, raporlar |
| L4 | — | MSTR semantik katmanı, metrik tanımları | — | Son kullanıcı |

- **L0 kaynak başına ayrı şema:** `LND_KALE`, `LND_BIST`, `LND_CEK`, `LND_FILE`… Bürokrasi değil — çelişen birden fazla `üye` tablosunun, kimse erken bir kazanan seçmek zorunda kalmadan inebilmesi için. L0'da dönüşüm mantığı **yasak**.
- **L0 neden tam tarihçe:** Geçmiş dataya update gelebiliyor ([[Aktif Sorular]]); mart'ı sıfırdan yeniden üretebilmek için kaynağın o an ne dediğini saklamak gerekiyor. Aynı zamanda denetim izi. Exadata'da HCC bu maliyeti taşır.
- **L0 → L1 sınırı:** L0 kaynak şeklindedir, L1 entegredir. Bu sınır korunmazsa operasyonel kullanıcılar ham kaynak tablolarını sorgulamaya başlar ve `üye` problemi çözülmek yerine aşağıya taşınır. Kapsam kararı: [[ODS]]
- **L1 rapor verir:** "Güncel veri lazım, tarihçe lazım değil" sınıfı raporların cevabı L1.
- **L2 tek gerçek:** Bir kavramın tanımı burada bir kez yaşar. Mart'lar L2'yi okur, birbirini okumaz.
- **L3 mart sınırı:** Bir mart bir konu alanı + bir grain. İki UG'nin farklı `üye` tanımını aynı mart'ta karıştırmak yasak.
- **L4 metrik:** Hesaplanmış iş metrikleri (komisyon oranı, net yükümlülük) MSTR'da değil, mümkün olduğunca L3'te maddileşir. MSTR sadece sunar.

## Kaynak başına giriş yolu

Kaynak listesi ve ODS kapsam kararı: [[ODS]]. Araç seçenekleri (GoldenGate / ODI) ve rol ayrımı: [[Dataguard vs Goldengate]].

| Kaynak | Yol | Not |
|---|---|---|
| [[Kale]] | `sur` üstündeki replikadan okuma → `LND_KALE` | ETL prod Kale'ye hiç dokunmaz |
| Arşiv, ÇekDB | Oracle replikasyon veya batch extract | Tazeleme ihtiyacı henüz belirsiz |
| BIST DB | Zamanlanmış çekim, conformed dış besleme | Başka kurumun ambarı: grain'i ve penceresi devralınır, real-time yok |
| CSV / FTP | External table veya `SQL*Loader` → `LND_FILE` | Aşağıdaki dosya sözleşmesi |
| Postgre / MSSQL | ODI (JDBC) veya GoldenGate | Dataguard bu kaynakları **hiç** alamaz: [[Dataguard vs Goldengate]] |

### Dosya sözleşmesi (CSV / FTP)

Veritabanı kaynaklarında olmayan, dosyaya özgü gereksinimler:

- Dosya adı konvansiyonu + manifest veya checksum
- Varış tespiti (Automic dosya beklemesi), geç gelen ve tekrar gönderilen dosya davranışı
- Şema kayması (kolon eklenmesi/sırası)
- Türkçe karakter kodlaması
- Hatalı kayıt için karantina tablosu — dosya bütünüyle reddedilmez

## Conformed dimension sözleşmesi

Mart'ları birbirine bağlayan şey bu liste. Bir mart bu dimension'ların kendi kopyasını üretemez.

| Dimension | Anahtar | Tip | Not |
|---|---|---|---|
| `dim_uye` | `uye_sk` | SCD2 | Kale'deki çoklu üye tablosunun tek karşılığı. Kaynak anahtarları `uye_xref` ile eşlenir. |
| `dim_tarih` | `tarih_sk` (YYYYMMDD) | Statik | İş günü, takas günü, tatil bayrakları |
| `dim_piyasa` | `piyasa_sk` | SCD1 | Genelde bir UG ekibi ≈ bir piyasa |
| `dim_kiymet` | `kiymet_sk` | SCD2 | ISIN bazlı; MKK tarafıyla hizalı |
| `dim_hesap` | `hesap_sk` | SCD2 | Saklama hesapları, üye alt hesapları |
| `dim_para_birimi` | `para_sk` | SCD1 | `doviz` şemasıyla hizalı |

`üye` kimlik çözümlemesi (`uye_xref`) projenin en kritik tek parçası. Hangi şemadaki üye tablosunun otorite olduğu **PowerDesigner veri sahibi** bilgisinden türetilir: [[PowerDesigner]].

## Pilot mart: `DM_TAKAS` (tek piyasa)

Seçilen konu alanı: bir piyasanın takas süreci, t → t+2 akışı ([[Takasbank Genel Bilgilendirme]] takas süreci).

### `fact_takas_akis` — accumulating snapshot

Grain: **bir takas yükümlülüğü** (üye + hesap + kıymet + takas günü + yön).

Süreç t'de emir eşleşmesiyle başlayıp t+2'de para/kıymet hareketiyle bittiği için accumulating snapshot doğru desen: satır açılır, kilometre taşları doldukça **update** edilir.

```
fact_takas_akis
  takas_akis_sk        PK
  uye_sk, hesap_sk, kiymet_sk, piyasa_sk, para_sk          -- FK
  eslesme_tarih_sk, takas_tarih_sk, gerceklesme_tarih_sk   -- rol oynayan dim_tarih
  yon                  -- borç / alacak
  nominal_adet, tutar, net_yukumluluk
  mkk_kiymet_hareket_ts, para_takas_ts                     -- kilometre taşı zamanları
  durum                -- açık / kısmi / kapandı / temerrüt
```

### `fact_takas_gunsonu` — periodic snapshot

Grain: **gün sonu × üye × hesap × kıymet**. Gün sonu bakiyeleri ve tarihçelendirilmiş snapshot'lardan beslenir; "o gün ne görünüyordu" sorusunun kaynağı. Gün sonu penceresi: [[Fiziksel Topoloji - Teknik Taraf]].

İki fact aynı conformed dimension'ları paylaşır, grain'leri farklıdır — bu yüzden ayrı tablodur, birleştirilmez.

## Yükleme desenleri

- **Initial load:** Partition exchange ile yığın yükleme, paralel DML, sonra istatistik toplama.
- **Incremental:** Kaynak CDC → L0 → L1 → L2 delta merge → L3 partition refresh. Karar için: [[Dataguard vs Goldengate]].
- **L0 yeniden oynatma (replay):** L0 tam tarihçe tuttuğu için mart bir kaynağa tekrar gitmeden yeniden üretilebilir. Yeniden üretimin okuma kaynağı **her zaman L0'dır**, kaynak sistem değil.
- **SCD2:** `gecerli_baslangic` / `gecerli_bitis` / `aktif_mi`. Değişiklik tespiti hash kolonuyla.
- **Geriye dönük düzeltme:** Historic dataya update gelebiliyor ([[Aktif Sorular]] madde 7). Bu yüzden mart'lar **yeniden üretilebilir** olmalı: ilgili partition'ı silip yeniden hesaplama her fact için desteklenir. Append-only varsayımı yapılmaz.
- **Idempotency:** Her yük bir `yukleme_id` ile damgalanır; aynı iş tekrar koşarsa sonuç değişmez.

## Mutabakat

Takas kurumunda kaynağıyla tutmayan rapor yanlış raporla aynı şey. Bu yüzden mutabakat pilotun sonundaki bir kontrol kalemi değil, **her yükün parçası olan ayrı bir katman**. Faz planı: [[Proje Planı]].

Otorite her zaman **kaynak sistemdir** ([[Kale]] / gün sonu bakiyesi), DWH değil. Fark çıktığında DWH yanlıştır sayılır — tersini kanıtlamak gerekir.

### Üç seviye

| Seviye | Sınır | Ne karşılaştırılır | Cevapladığı soru |
|---|---|---|---|
| Teknik | Kaynak → L0 | Satır sayısı, PK min/max, dosya checksum, eksik gün taraması | Veri kayboldu mu? |
| Katman | L0 → L1 → L2 → L3 | Kontrol toplamları: tutar, nominal adet, ayrık üye sayısı | Dönüşüm veriyi bozdu mu? |
| İş | L3 / MSTR → mevcut rapor | Yeni mart çıktısı ile bugün kullanılan Kale raporu | Sayı iş birimi için doğru mu? |

- **Grain değişen her sınırda beklenen toplam ayrıca tanımlanır.** `fact_takas_akis` accumulating snapshot olduğu için satır update ediliyor; naif `SUM(tutar)` karşılaştırması burada çift sayar. Hangi toplamın hangi grain'de eşitlenmesi gerektiği kural bazında yazılır.
- **Tolerans sıfır.** Para alanlarında "yaklaşık eşit" yok. Kuruş yuvarlaması varsa kuralın kendisi bunu açıkça tanımlar; eşik koyup farkı görmezden gelmek mutabakatı anlamsızlaştırır.

### Nerede yaşar

Ayrı `MUT_` şeması: `mut_kural` (ne karşılaştırılacak), `mut_kosu` (bir `yukleme_id` için sonuç), `mut_fark` (satır bazında sapma). Fark tablosu saklanır — trend görülmezse tekrarlayan sistematik sapma tek seferlik hata gibi görünür.

### Yayın kapısı

Automic zincirinde mutabakat **her katmandan sonra** koşar, en sonda değil; yoksa farkın nerede doğduğu bulunamaz. Mart partition'ı mutabakat yeşil olmadan MSTR'a açılmaz: kırmızıysa önceki partition yerinde kalır. Bayat veri yayınlamak yanlış veri yayınlamaktan iyidir.

Gün sonu **manuel tetiklendiği** için iş seviyesi mutabakat gün sonu bitiş sinyalinden önce koşamaz — zincir bağımlılığı bu.

### Sahiplik

Fark raporu sadece ETL ekibine gitmez, ilgili UG'ye de gider. Sahibi olmayan fark kapanmaz; kapanmayan fark birikince mutabakat gürültüye dönüşür ve kimse bakmaz.

## Oracle / Exadata tarafı

DWH `sur` Exadata üzerinde ([[Fiziksel Topoloji - Teknik Taraf]]).

- Fact tabloları `takas_tarih_sk` üzerinden **RANGE partition** (aylık veya günlük).
- Geçmiş partition'larda **HCC** (`COLUMN STORE COMPRESS FOR QUERY HIGH`); aktif partition sıkıştırmasız.
- **L0 arşiv partition'ları HCC `ARCHIVE HIGH`** — tam tarihçeli landing'in maliyetini taşıyan şey bu; sadece yeniden üretimde okunur.
- **Kapasite:** L0 tam tarihçe + çok kaynak, ODS'i kaledb'nin ~10 TB'ından hızla büyütür. 1 Exadata ≈ 200 TB olduğu için yer var, ama yerleşim kararı bunu gerektiriyor: [[ODS]].
- Fact FK'larında **bitmap index**, `star_transformation_enabled` açık.
- Dimension PK'ları enforced; fact FK'ları `RELY DISABLE NOVALIDATE` (optimizer bilsin, yük yavaşlamasın).
- MSTR'ın sık çektiği toplamlar için **materialized view + query rewrite**.

## Orkestrasyon

Automic ([[Fiziksel Topoloji - Teknik Taraf]]). Zincir gün sonu bitişine bağlanır — gün sonu **manuel tetiklendiği** için DWH yükü saate değil, **bitiş sinyaline** (mail/flag) bakmalı. Sabit saatle kurgulamak kırılgan olur.

## Güvenlik

Hassas veri ve veri sahibi bilgisi [[PowerDesigner]]'dan gelir. Alınacak her kolon bu katalogla eşleştirilir.

Sınır **L0'dır, DWH değil**: çok kaynaklı landing'le hassas veri artık en dışta iniyor, dolayısıyla eşleme dosya/tablo landing'e inmeden önce yapılmalı. Gerekçe: [[ODS]]. Maskeli verinin alınıp alınmayacağı hâlâ açık: [[Aktif Sorular]] madde 6.

## Bu tasarımın bağlı olduğu açık kararlar

Hepsi [[Aktif Sorular]] notunda: replikasyon aracı, ODS konumlandırması, kritik raporların (SPK/MASAK) kaynağı, anlık rapor beklentisi, maskeleme, mutabakatın otorite kaynağı.

İlgili notlar: [[DWH]] · [[Inmon vs Kimball]] · [[ODS]] · [[Kale]] · [[Proje Planı]]
