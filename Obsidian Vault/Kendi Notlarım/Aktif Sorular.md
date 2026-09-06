---
title: Aktif Sorular
created: 2026-09-04T14:41:00
source: OneNote
notebook: My Notebook
section: Kendi Notlarım
tags:
  - dwh
  - soru
  - takasbank
---

# Aktif Sorular

Friday, 4 September 2026, 2:41 pm

1. Kritik raporlar [[DWH]] üzerinden verilmeli mi?
    1. SPK, MASAK raporları: kritik ve saat bazında SLA var; birçok farklı piyasadan veriler birleştiriliyor. ([[Takasbank Genel Bilgilendirme 2]])
    2. Üst yönetime nasıl raporlar veriliyor?
    3. Düzenleyici raporlar için `as originally reported` ve düzeltilmiş sürüm kaç yıl, hangi kabul/ret cevabıyla saklanmalı?
2. DWH inşa adımları nasıl olmalı?
    1. Parça parça mı? Öyleyse priority nasıl belirlenmeli?
    2. Topyekün mü?
    3. [[Inmon vs Kimball]] — hedef karar iteratif kurumsal core + dimensional veri ürünleri: [[DWH Hedef Mimarisi v2]] (iş birimleriyle doğrulanmadı)
    4. En çok kullanılan raporlar nasıl çıkartılabilir?
    5. İlk pilot hangisi: [[Takasbank Genel Bilgilendirme 2|üye-dosya projesi]] mi, eski taslaktaki tek piyasa takas martı mı, Temmuz 2025 sunumundaki 4 örnek uygulamadan biri mi ([[DWH Sunum Temmuz 2025]])? Sahip, mevcut çıktı, mutabakat referansı ve 6–12 haftalık teslim edilebilirlikle puanlanmalı: [[Proje Planı]].
    6. Pilot kaynakta atomik işlem → MKT bacağı → netleştirme → yükümlülük → talimat → hareket lineage'ı var mı, yoksa yalnızca net yükümlülük mü tutuluyor?
3. DWH'dan anlık rapor alınabilmeli mi? → **GoldenGate kararının kapısı**: gün içi beklenti yoksa replikadan batch okuma yetiyor ([[Dataguard vs Goldengate]])
    1. Her veri ürünü için yakın gerçek zamanlı / gün içi / gün sonu / dosya / backfill sınıfı ve maksimum bayatlık nedir?
4. [[ODS]]'i nasıl konumlandırmalı? → mantıksal kapsam kararı verildi: kurumsal core'un, yalnızca operasyonel SLA gereken konularda açılan güncel-durum projeksiyonu. Fiziksel hedef açık: [[ODS]]
    1. [[Kale]] haricinde hangi kaynaklar alınmalı? → Arşiv, ÇekDB, BIST DB, FTP/CSV, muhtemel Postgre/MSSQL
    2. Hangi raporlar Kale'den, hangileri ODS'den, hangileri DWH'den verilmeli? **Açık.** Tek tek analiz; önce ilgili UG ve operasyonel ekiplerle (iş birimleri) görüşmek lazım.
    3. ODS'in fiziksel yerleşimi: kale Exadata'sından taşınması gerekiyor, hedef makine kararlaşmadı.
5. [[Dataguard vs Goldengate]] — soru yeniden çerçevelendi: eldeki seçenekler GoldenGate ve ODI; farklı roller, GG tek başına yetmiyor. Karar madde 3'e bağlı.
6. Maskeli veriler DWH'e alınmalı mı? ([[PowerDesigner Bilgilendirme]])
    1. Üretimde doğruluk için açık ama erişim kontrollü/tokenized veri, non-prod'da Informatica TDM ile maskeleme yaklaşımı onaylanıyor mu?
    2. Gerçek kişi/BES/escrow verilerinin izinli kullanım amacı ve satır/kolon erişim modeli nedir?
7. Historic dataya hangi durumlarda update geliyor? İlgili UG'den sorulacak. ([[Ortamlar hakkında]])
8. Mutabakatın otorite kaynağı ne olacak? Her konu alanı için "sayı bununla tutmak zorunda" denilen rapor/tablo tek tek belirlenmeli; bugün bu rolü hangi raporun oynadığı belli değil. Mekanizma tasarımı: [[DWH Hedef Mimarisi v2]]
    1. Bugünkü raporların kendi arasında farkı varsa hangisi doğru sayılacak?
    2. Fark çıktığında kim karar veriyor — DWH ekibi mi, ilgili UG mi?
    3. Otorite tablo bazında değil veri elemanı/metrik, piyasa, grain ve zaman kesimi bazında kim tarafından onaylanacak?
    4. Kıymet için MKK/TCMB, nakit için TCMB/muhabir banka, operasyonel alt defter için genel muhasebe mutabakat kayıtlarına erişim var mı?
9. [[Takasbank İş Alanları ve Temel Varlıklar|İş alanları]] için `piyasa × hizmet × kaynak sistem × UG/operasyon sahibi` envanterinin tamamı nedir?
    1. Hangi piyasada yalnızca merkezi takas/teminat, hangisinde MKT garantisi var?
    2. BISTECH, MKK, TCMB, EPİAŞ, TÜRİB, SWIFT ve diğer dış sistemlerin hangileri doğrudan kaynak; hangileri Kale üzerinden geliyor?
10. Piyasa/ürün bazında yürürlük tarihli takas çevrimi, takvim, yarım gün ve cutoff kurallarının otorite kaydı nerede?
    1. Pay Piyasası T+1 hazırlığı DWH kaynak ve raporlarına hangi tarihte, hangi test planıyla yansıyacak?
11. DWH ve her kritik veri ürünü için RPO, RTO, maksimum bayatlık, online/archive saklama ve legal hold süresi nedir?
    1. Landing replay penceresi ile hassas veri saklama sınırı nasıl dengelenecek?
    2. Backup, standby ve restore testi hangi ekip tarafından sahiplenilecek?
12. Otoritatif gün sonu tamamlanma sinyali nedir?
    1. Deniz'in 21:30–~06:00 anlatımı ile Ozan'ın ~03:00 bitiş / 04:00–07:00 flashback anlatımı tek timeline'da nasıl birleşiyor? [[Fiziksel Topoloji - Teknik Taraf]]
    2. Mail dışında iş tarihi, koşu kimliği ve snapshot/SCN taşıyan DB flag veya batch-control kaydı üretilebilir mi?

## Fon Bilgilendirme logical model

Kaynak model: [[DWH Logical Data Model#Fon Bilgilendirme — ayrıntılı logical model]]

1. Fund'un kurumsal business key'i ve otoritesi nedir?
    1. Fon, fon sınıfı ve share class ayrımı kaynakta nasıl tutuluyor?
2. Fon Bilgilendirme dosyasında gerçek satır grain'i nedir?
    1. Cash, instrument ve türev pozisyon satırları aynı şemada mı?
    2. Bir dosya yalnızca bir fund/submission mı içeriyor, yoksa batch dosyada birden fazla fon veya bildirim bulunabiliyor mu?
3. Correction bütün dosyayı mı, yalnızca değişen satırları mı yeniden gönderiyor?
    1. Cutoff sonrası correction restatement mı, ertesi iş günü girdisi mi?
4. Reported price ile hesaplamada kullanılan price source aynı mı?
    1. Değerleme ve getiri formülleri nerede, hangi yürürlük tarihleriyle versiyonlanıyor?
5. Mevcut rapor tablosu otorite kaynak mı, kontrol çıktısı mı?
6. CSV ve webservis aynı yayın kesimi ve authorization modelini mi kullanıyor?
    1. On yıllık servis için sorgu grain'i, pagination ve maksimum cevap süresi nedir?

İlgili notlar: [[DWH Hedef Mimarisi v2]] · [[DWH Logical Data Model]] · [[Proje Planı]] · [[Fiziksel Topoloji - Teknik Taraf]] · [[Takasbank Genel Bilgilendirme]] · [[Takasbank Genel Bilgilendirme 2]] · [[PowerDesigner Bilgilendirme]]
