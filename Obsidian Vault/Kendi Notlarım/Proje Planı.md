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

- DWH inşa adımları belirlenmeli: [[Takasbank Genel Bilgilendirme]] → taslak aşağıda, mimari [[DWH Mimari Tasarım]]
- Rapor yerleşimi (Kale / ODS / DWH) için önce UG ve operasyonel ekiplerle (iş birimleri) görüşmek: [[Takasbank Genel Bilgilendirme 2]]
- Pilot adayı: üyelere çok fazla dosya göndermeyi gerektiren proje

## İnşa adımları (taslak)

Mimari kararlar: [[DWH Mimari Tasarım]]. Her faz **dikey** ilerler — kaynaktan MSTR'a kadar çalışan bir sonuç bırakır.

### Faz 0 — Zemin

- [ ] Rapor envanteri: hangi rapor kimin, hangi kaynaktan, ne sıklıkta, SLA'sı var mı
- [ ] En çok kullanılan raporların tespiti (kullanım logu var mı?)
- [ ] Gecikme gereksinimi: gün içi / anlık rapor beklentisi var mı? (GoldenGate kararının kapısı)
- [ ] Veri alma aracı kararı — üç yol: yeni lisans yok / ODI belkemiği / ODI + GoldenGate: [[Dataguard vs Goldengate]]
- [ ] Katman şemalarının `sur` üzerinde açılması, isimlendirme standardının onayı
- [ ] Automic zincir iskeleti + gün sonu bitiş sinyaline bağlanma

### Faz 1 — `üye` conformed dimension

- [ ] Otorite üye tablosunun tespiti (PowerDesigner veri sahibi bilgisiyle): [[PowerDesigner]]
- [ ] `uye_xref` kimlik eşleme tablosu
- [ ] `dim_uye` SCD2 yüklemesi + mevcut raporla cross-check

Bu faz tek başına rapor üretmez ama sonraki her şey buna bağlı.

### Faz 2 — Mutabakat çatısı

Mart'tan önce gelir: mutabakat mekanizması pilotun sonuna bırakılırsa pilot "çalışıyor" görünüp sayısı tutmayan bir mart bırakır. Tasarım: [[DWH Mimari Tasarım]].

- [ ] `MUT_` şeması: `mut_kural` / `mut_kosu` / `mut_fark`
- [ ] Teknik mutabakat: kaynak → L0 satır sayısı, PK aralığı, dosya checksum, eksik gün taraması
- [ ] Katman mutabakatı: L0 → L1 kontrol toplamları (ilk kaynak [[Kale]] üzerinde)
- [ ] `dim_uye` mutabakatı — Faz 1'in çıktısı ilk gerçek testi
- [ ] Automic'te her katman sonrası mutabakat adımı + kırmızıda yayın kapısı
- [ ] Fark raporunun ilgili UG'ye gitme yolu (sahiplik olmadan fark kapanmıyor)

### Faz 3 — Pilot mart: tek piyasa takas

- [ ] Grain doğrulaması ilgili UG ile
- [ ] `dim_tarih`, `dim_kiymet`, `dim_hesap`, `dim_piyasa`, `dim_para_birimi`
- [ ] `fact_takas_akis` + `fact_takas_gunsonu`
- [ ] Fact'lerin mutabakat kuralları (accumulating snapshot'ta çift sayma tuzağı)
- [ ] MSTR semantik katmanı ve bir rapor uçtan uca
- [ ] İş mutabakatı: eski rapor ile cross-check ([[Takasbank Genel Bilgilendirme]])

### Faz 4 — Yayılma

- [ ] İkinci piyasa aynı conformed dimension'larla (sözleşme burada test edilir)
- [ ] Her yeni kaynak/mart mutabakat kuralı olmadan yayına açılmaz
- [ ] Dosya gönderim pilot projesinin DWH'e taşınması
- [ ] Kritik/yasal raporların (SPK, MASAK) kaynak kararı — [[Aktif Sorular]] madde 1 kapanmadan başlanmaz
- [ ] Onboarding dökümanı: [[Rastgele Notlar]]

Açık sorular: [[Aktif Sorular]]
