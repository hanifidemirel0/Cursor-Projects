---
title: Ortamlar hakkında
created: 2026-09-06T03:08:00
notebook: My Notebook
section: Toplantı Notları / Ozan Yağmuroğlu
tags:
  - toplantı
  - ortam
  - altyapi
---

# Ortamlar hakkında

Sunday, 6 September 2026, 3:08 am

## Maskeleme

Maskeleme **Informatica TDM** ürünü aracılığıyla yapılıyor.

## Ortamlar ve gün sonu

- **PREPROD:** Gün sonu işlemleri için Oracle **flashback** ile snapshot'lar alınıyor. Gece 4'te başlıyor, 7'de bitiyor; gün sonu işlemleri 3 gibi bitiyor. Son testler burada yapılıyor.
- **DSS:** Aynı şekilde çalışıyor. Kullanım amacı prod'un eşleniği; read-only senkron. DSS'de test yapılmıyor.
- DSS ve PREPROD saat 7'de [[Sistemler ve Servisler#3. Kale|Kale]]'den kopartılıyor.
- **TVSODS:** Şu an Kale ile anlık senkron.
- Gün sonu işlemleri bittiğinde mail geliyor. İşlemler operasyon tarafından **manuel** tetikleniyor; DB ekibi bir yere flag atabilir.

## Donanım / yerleşim

- [[Sistemler ve Servisler#4. ODS|ODS]] şu an **kale** Exadata makinesinde (makinenin adı da kale, DB'nin adı da kale).
- [[Sistemler ve Servisler#1. DWH|DWH]] **sur** Exadata makinesinde.
- 1 Exadata yaklaşık **200 TB**; kaledb yaklaşık **10 TB**.
- kaledb'nin 2 adet replikası daha var: biri kale Exadata üstünde, diğeri sur Exadata üstünde.

## Replikasyon

Bkz. [[Sistemler ve Servisler#2. Goldengate|Goldengate]].

## Veri

Historic dataya bazen **update** gelebiliyor — ilgili UG'den sorgulamak lazım. ([[Aktif Sorular]])

İlgili notlar: [[Fiziksel Topoloji - Teknik Taraf]] · [[Aktif Sorular]] · [[Sistemler ve Servisler#2. Goldengate|Goldengate]]
