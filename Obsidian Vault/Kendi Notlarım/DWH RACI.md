---
title: DWH RACI
created: 2026-11-24
status: taslak
tags:
  - dwh
  - raci
  - governance
---

# DWH RACI

Bu not, DWH programında **kimin ne yaptığını** iki tabloda tutar: proje teslimi ve veri sahipliği/işletim. Rol tanımları ve karar ilkeleri [[DWH Ownership Operating Model]]'dedir; bu not onu Takasbank'ta bugün var olan ekiplere indirger. İş adımlarının kendisi [[Proje Planı]]'ndadır. Açık sorular: [[Aktif Sorular]] madde 17.

> [!warning] Taslak
> Ekiplerle henüz konuşulmadı. Hiçbir atama kabul edilmiş sayılmaz.

## Harfler ve sütunlar

- **R** — İşi yapan. **A** — Sonuçtan hesap veren, onaylayan; her satırda **tek A**. **C** — Görüşü alınan. **I** — Bilgilendirilen.
- A ve R aynı ekip olabilir (**A/R**), görevler ayrılığı gerektiren satırlar hariç.
- **†** işaretli satırlarda nihai karar yönlendirme komitesinindir; tablodaki A, öneriyi hazırlayıp savunan ekiptir.

| Kısaltma | Taraf |
|---|---|
| DWH | DWH ve raporlama ekibi (tek ekip; MSTR / Pusula dahil) |
| UG | Uygulama Geliştirme |
| DBA | Veritabanı yönetimi |
| SİS | Sistem / altyapı |
| BG | Bilgi Güvenliği |
| İD | İç Denetim / Uyum |
| İŞ | İş birimleri (veri ve rapor sahipleri) |

## 1. Proje teslimi

### Keşif ve kararlar (Faz 0)

| # | İş | DWH | UG | DBA | SİS | BG | İD | İŞ |
|---|---|---|---|---|---|---|---|---|
| P1 | Kale yük çalışması (AWR/ASH, raporlama kaynaklı DB-time) | A | C | R | I |  |  |  |
| P2 | Kaynak profilleme (PK, değişiklik zamanı, delete deseni, hacim) | A/R | C | C |  |  |  |  |
| P3 | ADG lisansı, standby açılış modu ve gün sonu prosedürlerinin standby'da koşabilirliği | C | C | A/R | C |  |  |  |
| P4 | Rapor ve dosya envanteri (sahip, tüketici, SLA, kritiklik) | A/R | R | I |  |  |  | C |
| P5 | Pilot seçimi † | A/R | C | I |  | I | I | C |
| P6 | Veri ürünlerinin SLA sınıfı (S0–S4) | R | C | C | C |  |  | A |
| P7 | Maskeleme ve erişim politikası | R | I | C |  | A | C | C |
| P8 | Saklama süresi, RPO ve RTO | C |  | R | R | C | C | A |

### Platform kurulumu

| # | İş | DWH | UG | DBA | SİS | BG | İD | İŞ |
|---|---|---|---|---|---|---|---|---|
| P9 | GoldenGate ile `ODS_` beslemesi (extract kaynağı, tablo kapsamı, lag izleme) | C |  | A/R | C | C |  |  |
| P10 | Borsa İstanbul ile kurumlar arası GoldenGate akışı | C |  | A/R | R | C |  |  |
| P11 | DWH veritabanı yerleşimi ve kapasite (`hisar` / `sur`) | C |  | A | R |  |  |  |
| P12 | Sunucu, ağ ve depolama | I |  | C | A/R | C |  |  |
| P13 | ETL aracı, Git ve CI kurulumu | A/R |  | C | R | C |  |  |
| P14 | Orkestrasyon aracı seçimi † | A/R | C | C | C | C |  |  |
| P15 | Orkestrasyon kurulumu ve gün sonu kaydına bağlı iş zinciri | A | C | C | R | C |  |  |
| P16 | Servis hesapları ve sır kasası | C |  | R | R | A | I |  |
| P17 | ETL aracı ürün kararı (Pilot B çıkışı) † | A/R | C | C | C | C | C | I |

### Geliştirme

| # | İş | DWH | UG | DBA | SİS | BG | İD | İŞ |
|---|---|---|---|---|---|---|---|---|
| P18 | `ODS_` şema standardı ve kontrol tabloları (`CTL_`) | A/R |  | C |  |  |  |  |
| P19 | İş tanımları ve veri otoritesi onayı | R | C |  |  |  |  | A |
| P20 | Core model ve dönüşümler | A/R | C |  |  |  |  | C |
| P21 | UG gün sonu prosedürlerinin DWH'a taşınması (Pilot B) | A | R | C |  |  |  | I |
| P22 | Mart ve MSTR semantik modeli | A/R |  |  |  |  |  | C |
| P23 | Rapor ve dosya geliştirme (Pusula) | A/R |  |  |  |  |  | C |

### Test, kabul ve devreye alma

| # | İş | DWH | UG | DBA | SİS | BG | İD | İŞ |
|---|---|---|---|---|---|---|---|---|
| P24 | Teknik test (replay, idempotent yükleme, kalite kuralları) | A/R |  | C |  |  |  |  |
| P25 | Eski çıktıyla mutabakat | R | C |  |  |  |  | A |
| P26 | Güvenlik testi ve erişim doğrulaması | R |  | C |  | A/R | I |  |
| P27 | Kontrol ve kanıtların bağımsız gözden geçirilmesi | C |  |  |  | C | A/R |  |
| P28 | Üretim kabulü | R | C |  |  | C |  | A |
| P29 | Üretime devreye alma (değişiklik yönetimi) | R |  | R | A | C |  | I |
| P30 | Eski rapor veya işin kapatılması | R | R |  |  |  | C | A |

## 2. Veri sahipliği ve işletim

| # | Karar / iş | DWH | UG | DBA | SİS | BG | İD | İŞ |
|---|---|---|---|---|---|---|---|---|
| O1 | Veri tanımı, metrik anlamı ve otoritatif kaynak | R | C |  |  |  |  | A |
| O2 | Kaynak teslim sözleşmesi (gün sonu tamamlanma kaydı, şema değişikliği bildirimi) | C | A | R |  |  |  | I |
| O3 | Kalite eşiği ve tolerans | R |  |  |  |  |  | A |
| O4 | Kalite kurallarının uygulanması ve izlenmesi | A/R |  |  |  |  |  | I |
| O5 | Sayı uyuşmazlığında karar | R | R |  |  |  |  | A |
| O6 | Gün sonu gecikmesi veya yükleme hatası | A/R | C | C |  |  |  | I |
| O7 | Veritabanı veya sunucu arızası | C |  | A/R | R |  |  | I |
| O8 | Rapor veya dosya hatası | A/R |  |  |  |  |  | I |
| O9 | Erişim talebinin onayı | C |  | R |  | R |  | A |
| O10 | Periyodik erişim gözden geçirmesi | I |  | R |  | A | C | R |
| O11 | Test ortamlarında maskeleme | R |  | R |  | A | I |  |
| O12 | Yedekleme ve geri dönüş | C |  | A/R | R |  | I |  |
| O13 | Uçtan uca DR tatbikatı | R |  | R | A |  | I | C |
| O14 | Kaynak şema değişikliğinin etki analizi | A | R | C |  |  |  | I |
| O15 | Üretim değişikliği onayı | R |  | C | A | C |  | I |
| O16 | Geçici kontrol istisnası | R |  |  |  | C | C | A |
| O17 | Saklama ve imha uygulaması | C |  | R | R | C | C | A |
| O18 | Kontrol tasarımı ve kanıtın denetimi | C |  | C |  | C | A/R |  |

## Tasarım tercihleri

- **Anlamın sahibi iş birimidir.** Veri tanımı, kalite eşiği, uyuşmazlık ve üretim kabulü İŞ'tedir; DWH uygular ama tanımı tek başına değiştiremez (O1, O3, O5, P28).
- **DWH ve raporlama tek ekiptir.** Kaynaktan rapora kadar teslimat aynı ekipte uçtan uca: mart, MSTR semantik modeli, Pusula raporları ve rapor hataları DWH'da A/R (P22, P23, O8). Ekip kendi çıktısını kabul edemez; mutabakat ve üretim kabulünde A iş birimidir (P25, P28).
- **Platform DBA ve sistemdedir.** GoldenGate, yedekleme ve veritabanı DBA'da; sunucu, ağ ve değişiklik yönetimi SİS'te. DWH bu satırlarda C'dir. Yedekleme sahipliği (O12) [[Aktif Sorular]] madde 11.2'ye öneridir.
- **Yükleme zincirinin işletimi DWH'dadır** (O6). Bu, [[Aktif Sorular]] madde 16.3'e öneridir; araç seçilince SİS ile sınır yeniden konuşulur.
- **UG kaynak sahibidir.** Kale'nin ürettiği verinin anlamı ve gün sonu sinyali UG sorumluluğudur (O2); DWH'a taşınan prosedürleri UG yazar, DWH sonuçtan hesap verir (P21).
- **Denetim kontrol işletmez.** İD hiçbir satırda işi yapan değildir; yalnızca bağımsız gözden geçirmede A/R'dir (P27, O18).
