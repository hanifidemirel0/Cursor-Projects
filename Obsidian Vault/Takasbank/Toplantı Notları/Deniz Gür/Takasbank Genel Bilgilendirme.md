---
title: Takasbank Genel Bilgilendirme
created: 2026-09-02T16:18:00
source: OneNote
notebook: My Notebook
section: Toplantı Notları / Deniz Gür
tags:
  - dwh
  - takasbank
  - toplantı
  - mstr
---

# Takasbank Genel Bilgilendirme

Wednesday, 2 September 2026, 4:18 pm

## Süreç

Operasyon Kullanıcısı → Yeni talep → Bilgi İşlem → Uygulama Geliştirme (UG) → Yazılımcı + Analist → Test (SG Testi)

- Operasyon kullanıcısı bütün üyelerin ekranını görür. Talebin çıkış noktasıdır.
- Raporlar eskiden UG tarafından yapılıyordu. Artık UG bize geliyor, eski raporlar hariç. Yeni rapor geliştirdikleri de oluyor zaman zaman.
- Biz MSTR'a taşıdığımız raporlar için UG raporuyla **cross-check** yapıyoruz. Ayrıca ekranlarda da çok fazla kontrol var. Kaynak data oldukça temiz bu yüzden. Birçok kontrol noktasından geçiyor.

## DB'ler

- [[Kale]]
- Arşiv
- ÇekDB

## Veri kalitesi

- Kale'de birden fazla şemada üye tablosu olabiliyor, DQ sorunu bu.
- Her piyasanın kendi üye tablosu da olabiliyor bazen.
- Her UG ekibi bir piyasaya tekabül ediyor genel olarak. Çek piyasası, hisse piyasası gibi...

## DWH'ın amacı

1. Kale'deki yükü azaltmak. Sürekli Exadata'yı büyütmek çözüm değil.
2. Yapay zeka: Veriyi [[DWH]]'dan okumak daha hızlı ve daha temiz olacak. Semantik layer da ileride AI için çok faydalı olacak.
3. MSTR üzerinden self-servis BI şu anda tam olarak yok. Sürükle bırak yapılmıyor. Bunun da önü açılmış olacak. Elimizde grain'i düzgün modellenmiş tablolar olacak.

- [ ] ⭐ **DWH building steps belirlenmeli !!!**

## Açık sorular

- Kritik raporlar [[DWH]] üzerinden çıkmalı mı?
- DWH inşa adımları nasıl olmalı?
- DWH'den anlık rapor alınabilmeli mi?
- DWH ingestion: [[Dataguard vs Goldengate]]

Aynı liste: [[Aktif Sorular]]

## Piyasalar

1. Merkezi karşı taraf: Risk ölçer, limitleri belirler. Risk hesaplamaları yapar.

## Takas süreci

Borsa → Emir eşleşmesi (t günü) → Takasbank üye bilgisi (t günü) → alıcı-satıcı → takas günü (t+2 günü) → hisse para yer değiştirmesi → hisse senedi hareketi MKK tarafından yapılıyor → para takası Takasbank tarafından yapılıyor.

## Ek notlar

- 5 UG ekibi var ama alt ekipleri de var fazlaca.
- Şu ana kadar UG'lerin raporlarının %10–20'si taşınmıştır.
- Birden fazla source MSTR üzerinde birleştiriliyor.

## Yasal raporlar

- Hazine ekibi hazırlıyor mesela. Maliye Bakanlığı'na gidiyor.
- İleride hepsini MSTR ve DWH üzerinden gönderme hedefleniyor.

İlgili notlar: [[Aktif Sorular]] · [[Aktarım #1]] · [[Takasbank Genel Bilgilendirme 2]]
