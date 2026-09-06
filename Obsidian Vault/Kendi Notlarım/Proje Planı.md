---
title: Proje Planı
source: OneNote
notebook: My Notebook
section: Kendi Notlarım
tags:
  - dwh
  - plan
status: partial
---

# Proje Planı

Hedef mimari: [[DWH Hedef Mimarisi v2]]. Eski taslak geçmiş karşılaştırması için korunuyor: [[DWH Mimari Tasarım]].

> [!info] Teslimat ilkesi
> Her faz **dikey** ilerler ve çalışan bir iş sonucu bırakır. Kurumsal `party`, hesap veya araç modeli tek başına aylar süren ön proje yapılmaz; seçilen veri ürününün ihtiyaç duyduğu kapsamda kurulup sonraki dilimlerde genişletilir.

## Başarı ölçütleri

- [[Kale]] üzerindeki raporlama yükünde ölçülebilir azalma.
- Seçilen rapor/dosyanın eski çıktıyla onaylı mutabakatı.
- Kaynaktan MSTR/dış teslimata kolon seviyesinde lineage.
- Aynı yükün tekrar koşmasında idempotent sonuç.
- Geriye dönük düzeltmenin kaynağa dönmeden landing'den yeniden üretilebilmesi.
- Her veri ürününde sahip, SLA, hassasiyet, saklama ve operasyon sorumlusu.
- İkinci konu alanında ortak taraf/hesap/piyasa sözleşmesinin bozulmadan tekrar kullanılması.

## Faz 0 — Keşif ve karar kapıları

### Rapor ve veri ürünü envanteri

- [ ] UG ve operasyon ekipleriyle rapor/dosya envanteri çıkar: sahibi, tüketicisi, sıklığı, SLA'sı, kritikliği, kaynakları ve bugünkü doğrulama yöntemi.
- [ ] Team Developer, web ve MSTR kullanım loglarından en çok kullanılan çıktıları belirle.
- [ ] SPK, MASAK, üst yönetim ve üye teslimatlarını ayrı kritik sınıfta işaretle.
- [ ] Her çıktı için Kale / ODS / DWH / kaynak uygulama hedef yerleşimini kararlaştır.

### İş ve kaynak haritası

- [ ] [[Takasbank İş Alanları ve Temel Varlıklar]] kapsamını ilgili iş sahipleriyle doğrula.
- [ ] `piyasa × hizmet × kaynak sistem × UG/operasyon sahibi` envanterini çıkar.
- [ ] Pilot adaylarında atomik işlem, MKT bacağı, net yükümlülük, talimat ve hareket grain'lerinden hangilerinin gerçekten bulunduğunu örnek veriyle kanıtla.
- [ ] Kaynak PK, değişiklik zamanı, geçmiş update/delete davranışı ve veri hacmini ölç.
- [ ] Veri elemanı bazında otorite matrisi oluştur; PowerDesigner sahibini onay sürecine bağla.

### SLA, güvenlik ve işletim kararları

- [ ] Her veri ürününü S0 yakın gerçek zamanlı / S1 gün içi / S2 gün sonu / S3 dosya / S4 backfill sınıfına ata.
- [ ] Prod ve non-prod maskeleme/tokenization politikasını onaylat.
- [ ] Online/archive saklama, yasal hold, RPO ve RTO değerlerini belirle.
- [ ] PREPROD/DSS gün sonu anlatımlarını tek timeline ve otoritatif kontrol sinyaliyle uzlaştır.
- [ ] ODS fiziksel hedefini kapasite, HA, workload ve gecikme testiyle seç.

### Araç ve kapasite

- [ ] [[Dataguard vs Goldengate]] değerlendirmesini onaylı latency sınıflarıyla sonuçlandır.
- [ ] İlk üç aday konu alanı için günlük değişim, initial history, retention ve büyüme ölçümü yap.
- [ ] Raw/core/mart, indeks, temp, backup ve DR dahil kapasite modeli çıkar.
- [ ] Automic kontrol zinciri ve servis hesabı modelini güvenlik ekibiyle onayla.

> [!failure] Faz 0 çıkış kapısı
> Rapor sahibi, pilot iş çıktısı, kaynak grain'i, otorite, SLA, hassasiyet ve mutabakat referansı belli değilse fiziksel mart tasarımına başlanmaz.

## Pilot seçimi

Toplantı notlarında iki farklı yön var:

- üyelere çok sayıda dosya gönderen proje adayı: [[Takasbank Genel Bilgilendirme 2]],
- eski taslaktaki tek piyasa takas martı: [[DWH Mimari Tasarım]].

Temmuz 2025 sunumunda 4 örnek uygulama üzerinden akış da çizilmiş: [[DWH Sunum Temmuz 2025]].

Hiçbiri henüz kesin pilot değildir. Adaylar 1–5 arasında puanlanır:

- ölçülebilir iş değeri ve Kale yükü,
- kaynak ve iş sahibi hazır olma,
- güvenilir mutabakat referansı,
- SLA'nın gerçekleştirilebilirliği,
- ortak party/hesap/piyasa modeline katkı,
- ikinci veri ürününde tekrar kullanım,
- hassasiyet ve yasal risk,
- grain ve dönüşüm karmaşıklığı,
- altı–on iki haftada uçtan uca teslim edilebilirlik.

### Önerilen seçim ilkesi

Üye-dosya projesi; sahibi, alıcısı, mevcut çıktısı ve kabul kriteri netse ilk tercihtir. Bu şartlar sağlanmıyorsa tek piyasa ve tek rapor ailesiyle takas/mutabakat dilimi seçilir. Çok piyasayı veya bütün yasal raporları birleştiren çıktı ilk pilot yapılmaz.

## Faz 1 — Kontrol ve landing temeli

- [ ] `CTL_` yükleme, checkpoint, veri sözleşmesi, lineage, kalite ve yayın kayıtlarını oluştur.
- [ ] `LND_<kaynak>` standardı ve zorunlu teknik metadata'yı uygula.
- [ ] İlk Oracle kaynağını prod yerine `sur` replikasından al; SCN/snapshot ve replika lag'ini kaydet.
- [ ] Dosya varsa manifest, checksum, schema version, duplicate ve karantina akışını kur.
- [ ] Backfill ve replay koşusunu ayrı `yukleme_id` ile test et.
- [ ] Automic'te teslimat → landing → teknik kontrol zincirini kur.
- [ ] Teknik farkın sahibi ve bildirim/escalation yolunu tanımla.

Bu faz pilot datasıyla tamamlanır; boş platform kurulumu olarak teslim edilmez.

## Faz 2 — Uçtan uca MVP

### Kurumsal core

Entity, ilişki ve grain başlangıç modeli: [[DWH Logical Data Model]].

- [ ] Pilot kapsamındaki `party`, `party_identifier`, `party_role`, `membership`, `account`, `market`, `service` ve xref kayıtlarını oluştur.
- [ ] Fuzzy eşlemeyi otomatik golden record yapmadan inceleme kuyruğuna yönlendir.
- [ ] Pilotun gerçek grain'lerine göre işlem/netleştirme/yükümlülük/talimat/hareket olaylarını modelle.
- [ ] İş zamanı ve sistem zamanını örnek geriye dönük düzeltmeyle test et.
- [ ] `T+0/T+1/T+2/değer tarihi` davranışını veriye dayalı `settlement_rule` ile doğrula.

### ODS, mart ve yayın

- [ ] Gerçek güncel-durum SLA'sı varsa core'dan `ODS_<konu>` projeksiyonu üret; gerekmiyorsa ODS tablosu açma.
- [ ] Seçilen rapor/dosya için grain'i açık yıldız şema veya yayın görünümü oluştur.
- [ ] MSTR semantik modeli veya üye dosya sözleşmesini uçtan uca bağla.
- [ ] Dosya teslimatında içerik hash'i, alıcı, sürüm, gönderim ve teslim kanıtını sakla.
- [ ] Metrik tanımlarını rapor içinde tekrar yazmak yerine sertifikalı veri ürününde sahiplen.

### Mutabakat ve operasyon

- [ ] Teslimat, teknik, dönüşüm ve iş mutabakatlarını pilot koşusunda çalıştır.
- [ ] Kaynak → core → mart → mevcut rapor/dosya kontrol toplamlarını aynı grain'de belgeleyip onaylat.
- [ ] Kırmızı sonuçta yeni sürümü açmayan yayın kapısını test et.
- [ ] Hatalı koşuyu landing'den replay ederek aynı sonucu üret.
- [ ] RPO/RTO, runbook, alarm, dashboard ve escalation dry-run yap.
- [ ] Veri sahibi, UG ve operasyon ekibinden üretim kabulü al.

## Faz 3 — Risk, teminat ve temerrüt

MKT, takas ve merkezi uzlaştırma işlerinin ortak çekirdeği olduğu için pilot sonrası öncelikli genişleme:

- [ ] Risk maruziyeti, limit ve pozisyon snapshot grain'lerini doğrula.
- [ ] Teminat hareketi ile teminat değerleme snapshot'ını ayır.
- [ ] Fiyat kaynağı, haircut, uygunluk ve konsantrasyon kuralını geçerlilik tarihli modelle.
- [ ] Marjin çağrısı, garanti fonu ve temerrüt olaylarını ekle.
- [ ] Teminat alt defterini ilgili saklama/dış bakiye ile mutabık kıl.
- [ ] İlgili MSTR risk veri ürününü sertifikalandır.

## Faz 4 — Kurumsal yayılım

Her yeni dilim Faz 0'ın daraltılmış keşif kapısından ve Faz 2'nin üretim kabulünden geçer.

Önerilen sıra, iş değeri puanıyla doğrulanmak üzere:

1. ikinci piyasa takas/mutabakat dilimi,
2. ödeme ve nakit/kıymet hareketi,
3. saklama ve kurumsal aksiyon,
4. fon ve emeklilik,
5. enerji/emtia/kıymetli maden,
6. çek, kredi ve escrow,
7. ücret, komisyon ve finansal mutabakat,
8. numaralandırma ve düzenleyici bildirim.

- [ ] İkinci dilimde conformed party/account/market/service sözleşmesini kırmadan tekrar kullan.
- [ ] Her yeni kaynakta şema kayması ve replay testini zorunlu yap.
- [ ] Her veri ürününü kalite, güvenlik ve yayın kapısı olmadan üretime açma.
- [ ] Domain onboarding ve grain yazım rehberi hazırla; [[Rastgele Notlar]] içindeki onboarding ihtiyacını karşıla.

## Faz 5 — Kritik ve yasal raporlar

Kritik raporlar sırf DWH var diye taşınmaz.

- [ ] Yasal dayanak, kesim zamanı, SLA, kabul sistemi ve düzeltme sürecini rapor bazında belgeleyin.
- [ ] `as originally reported` ve `as corrected` sürümlerini değişmez saklayın.
- [ ] Kaynaktan kabul cevabına kadar lineage ve içerik hash'ini kanıtlayın.
- [ ] Paralel koşum boyunca eski ve yeni çıktıyı iş sahibiyle mutabık kılın.
- [ ] Failover, geç teslim ve manuel override senaryolarını test edin.
- [ ] İlgili düzenleyici/iş sahibi yazılı kabul vermeden eski üretimi kapatmayın.

## Her veri ürünü için Definition of Done

- [ ] İş sahibi ve teknik sahibi belli.
- [ ] Grain, doğal anahtar ve ölçü davranışı onaylı.
- [ ] Otorite matrisi ve source-to-target lineage tamam.
- [ ] Bitemporal düzeltme ve replay testi geçti.
- [ ] Kalite ve mutabakat kuralları yeşil.
- [ ] Hassasiyet, erişim ve saklama politikası uygulanmış.
- [ ] SLA, RPO/RTO, alarm ve runbook test edilmiş.
- [ ] MSTR/dosya/rapor metrikleri sertifikalı.
- [ ] Yayın kapısı ve rollback sürümü çalışıyor.
- [ ] İş sahibi üretim kabulü vermiş.

Açık kararlar: [[Aktif Sorular]]
