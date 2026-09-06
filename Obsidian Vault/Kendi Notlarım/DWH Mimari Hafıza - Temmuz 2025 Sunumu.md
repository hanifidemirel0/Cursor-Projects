---
title: DWH Mimari Hafıza - Temmuz 2025 Sunumu
created: 2026-09-06T23:43:00
updated: 2026-09-06T23:43:00
section: Kendi Notlarım
tags:
  - dwh
  - mimari
  - hafiza
  - pilot
status: reviewed
source_note: "[[DWH Sunum Temmuz 2025]]"
---

# DWH Mimari Hafıza - Temmuz 2025 Sunumu

Bu not, [[DWH Sunum Temmuz 2025]] incelemesinden çıkan **mimari değerlendirmelerin** sahibidir. Sunumun söylediği ham bilgiler kaynak notta, hedef tasarım [[DWH Hedef Mimarisi v2]], entity modeli [[DWH Logical Data Model]], işler [[Proje Planı]], cevap bekleyen konular [[Aktif Sorular]] notlarındadır.

## Ana sonuç

Temmuz 2025 sunumu, [[DWH Hedef Mimarisi v2]] yaklaşımını değiştirmiyor; gerçek hacim, düzeltme davranışı, zamanlama ve teslimat kanallarıyla somutlaştırıyor.

Hatırlanacak temel ayrım:

- Sunumdaki bazı “ODS” kullanımları geçici temizleme/hesaplama alanını tarif ediyor.
- Hedef mimaride bu görev `STG_*` katmanına aittir.
- Hedef `ODS_*`, kurumsal core'un yalnızca güncel-durum SLA'sı gereken konularda açılan projeksiyonudur.

## V2'ye eklenmesi değerli desenler

### SWIFT mesaj modeli

Kaynak: [[DWH Sunum Temmuz 2025#Slayt 11 — SWIFT yasal raporlar]] · [[DWH Sunum Temmuz 2025#Slayt 12 — SWIFT hacim]] · [[DWH Sunum Temmuz 2025#Slayt 13 — SWIFT yeni yapı]]

Önerilen model:

- bir mesaj için tekil envelope/header kaydı,
- tekrar eden message detail/segment kayıtları,
- serbest metinden çıkarılan kimlik için ayrı occurrence/index kaydı,
- parser ve normalizasyon kuralı sürümü,
- orijinal mesajın immutable landing kaydı,
- yasal sorgunun hangi parser sürümüyle üretildiğinin lineage'ı.

Özet tablo performans için kullanılabilir; ham detayın ve serbest alanın yerine geçmez. Kimlik araması nedeniyle veri sınıflandırması, erişim audit'i ve yanlış pozitif/negatif kontrolü zorunludur.

### Düzeltilebilir fon bildirimi

Kaynak: [[DWH Sunum Temmuz 2025#Slayt 15 — Fon Bilgilendirme Platformu]] · [[DWH Sunum Temmuz 2025#Slayt 16 — Fon Bilgilendirme mevcut ve yeni yapı]] · [[DWH Sunum Temmuz 2025#Slayt 17 — Fon Bilgilendirme teslimat]]

Önerilen model:

- her fon dosyası/bildirimi değişmez submission olayı,
- düzeltmenin önceki bildirime referansı,
- hesaplama koşusu ve kural sürümü,
- iş zamanı ile DWH'ın düzeltmeyi gördüğü sistem zamanının ayrılması,
- gün içi mikro-batch/checkpoint,
- tarihsel CSV ve webservis için ortak, sürümlü `PUB_*` veri ürünü,
- 10 yıllık sorgu için pagination, kesim zamanı ve as-of sözleşmesi.

Bu senaryo bitemporal core, idempotency, backfill ve çok kanallı yayın kararlarını birlikte test eder.

### Fon işlem defteri

Kaynak: [[DWH Sunum Temmuz 2025#Slayt 19 — Fon işlem defterleri]] · [[DWH Sunum Temmuz 2025#Slayt 20 — Fon işlem defterleri ODS ETL]] · [[DWH Sunum Temmuz 2025#Slayt 21 — Fon işlem defterleri akış diyagramı]]

Önerilen model:

- Borsa DWH teslimatının immutable landing'e gecikmeden alınması,
- kısa kaynak saklama süresinden bağımsız replay,
- piyasa kapanışı ve koşu kimliği bazlı orkestrasyon,
- hesap/fon uyuşmazlığında silme yerine reason-code ile quarantine,
- temizlenen/elenen her kaydın lineage'ı,
- işlem defteri dosyasında içerik hash'i, piyasa, alıcı, sürüm ve teslimat kanıtı,
- ilk dilimde tek piyasa ve tek dosya ailesi.

Sunumda “ODS'den silme” olarak anlatılan akış hedef mimaride geçici `STG_*` temizliğidir; landing kanıtı silinmez.

### BISTECH SPK raporları

Kaynak: [[DWH Sunum Temmuz 2025#Slayt 22 — BISTECH SPK raporları kaynaklar]] · [[DWH Sunum Temmuz 2025#Slayt 23 — BISTECH SPK yeni yapı]] · [[DWH Sunum Temmuz 2025#Slayt 24 — BISTECH SPK akış diyagramı]]

Önerilen model:

- Replica BIDB ve NOMX için ayrı record-source lineage,
- kaynak → hesaplama → onaylı rapor satırı bağı,
- T-1 kesiminin değişmez yayın sürümü,
- `as originally reported` ve `as corrected` ayrımı,
- eski formata uyumun core/martta değil `PUB_*` compatibility view'da sağlanması,
- SPK erişiminin kontrollü yayın şemasına verilmesi,
- paralel koşum ve yazılı iş/regülatör kabulü olmadan eski raporun kapatılmaması.

Bu konu kritik rapor olduğu için ilk teknik pilot değil, platform ve mutabakat mekanizması kanıtlandıktan sonraki faz olmalıdır.

### Piyasa olayına bağlı orkestrasyon

Tek bir kurumsal “gece ETL'i” yeterli değildir:

- fon bildirimleri gün içi düzeltme penceresine,
- fon işlem defterleri piyasa kapanışlarına,
- SWIFT ve SPK çıktıları onaylı gün sonu sinyaline

bağlanmalıdır.

Schedule; piyasa, veri ürünü, iş tarihi, cutoff ve koşu türüyle versiyonlanır. Saat tek başına otoritatif tamamlanma sinyali değildir.

## Pilot değerlendirme hafızası

Mevcut bilgiyle önerilen sıra:

1. **Fon Bilgilendirme Platformu:** Sınırı daha kontrollü; düzeltme, gün içi yük, tarihçe, CSV ve webservisi birlikte kanıtlar.
2. **Fon işlem defteri — tek piyasa:** Kısa kaynak saklama, yoğun filtreleme, piyasa kapanışı ve dış dosya teslimatını test eder.
3. **SWIFT yasal raporları:** Yüksek hacim ve güçlü fayda; serbest metin kimlik, mahremiyet ve yasal yeniden üretim riski nedeniyle daha sonra.
4. **BISTECH SPK raporları:** En yüksek düzenleyici risk; mutabakat ve yayın kapısı olgunlaştıktan sonra.

Bu sıra kesin karar değildir. [[Proje Planı]] puanlaması; sahip, kabul kriteri, gerçek grain, dönemsel hacim, kaynak erişimi ve mutabakat referansıyla yapılmalıdır.

## Doğrudan hedef kabul edilmeyecek noktalar

Kaynak: [[DWH Sunum Temmuz 2025#Slayt 4 — Önceki toplantı özeti]] · [[DWH Sunum Temmuz 2025#Slayt 8 — Exadata yerleşimi]]

- DSS'nin ODS olarak kullanılması,
- ODS'nin Kale Exadata üzerinde kalması,
- ETL'in mutlaka ODS ile aynı makinede olması,
- bütün DWH'ın tek tip T-1 çalışması

Temmuz 2025'te değerlendirilmiş seçeneklerdir; güncel hedef karar değildir. Ortam gerçeklerinin sahibi [[Fiziksel Topoloji - Teknik Taraf]] notudur. Yerleşim; kapasite, HA, workload ve gecikme testiyle belirlenmelidir.

## Doğrulanması gerekenler

- “ODVM mimarisi” tam olarak nedir ve DWH/ODS ile sınırı nasıldır?
- Sunumdaki hacimler günlük mü, tek koşu mu, toplam mı?
- Fon Bilgilendirme için bildirim, fon, dosya ve hesaplama grain'leri nedir?
- Fon işlem defteri için her piyasanın gerçek kapanış sinyali ve iki koşunun amacı nedir?
- Beş günlük kaynak saklama hâlen geçerli mi?
- Borsa DWH verisi doğrudan landing'e alınabilir mi, yoksa Kale/TPS zorunlu kayıt sistemi midir?
- SWIFT serbest metin kimlik aramasının onaylı parser ve yasal eşleşme kuralı var mı?
- SPK raporlarında kabul/ret cevabı ve resmî teslimat kanıtı üretiliyor mu?

Bu soruların kalıcı sahibi: [[Aktif Sorular]].

İlgili notlar: [[DWH Sunum Temmuz 2025]] · [[DWH Hedef Mimarisi v2]] · [[DWH Logical Data Model]] · [[Proje Planı]] · [[Aktif Sorular]] · [[ODS]]
