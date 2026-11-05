"""Takasbank DWH Durum Bilgilendirmesi-5 (Kasım 2026) sunumunu üretir.

Çalıştırma: python3 build_deck.py  ->  "5 - DWHSunum_Kasim2026.pptx"
İçerik kaynakları her slaydın konuşmacı notunda listelenir.
"""

import re
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

OUT = Path(__file__).with_name("5 - DWHSunum_Kasim2026.pptx")

NAVY = RGBColor(0x1F, 0x2D, 0x7B)
NAVY_DARK = RGBColor(0x15, 0x1F, 0x5C)
INK = RGBColor(0x1E, 0x23, 0x33)
MUTED = RGBColor(0x5A, 0x63, 0x73)
GOLD = RGBColor(0xE8, 0xA3, 0x3D)
LIGHT = RGBColor(0xEE, 0xF1, 0xF8)
LINE = RGBColor(0xC9, 0xD0, 0xE0)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RED = RGBColor(0xC0, 0x39, 0x2B)
GREEN = RGBColor(0x2E, 0x7D, 0x4F)
TEAL = RGBColor(0x1D, 0x7A, 0x8C)

FONT = "Calibri"
W, H = Inches(13.333), Inches(7.5)

prs = Presentation()
prs.slide_width, prs.slide_height = W, H
BLANK = prs.slide_layouts[6]
page_no = 0


# ---------------------------------------------------------------- helpers

def _runs(paragraph, text, size, color, bold=False):
    """Adds runs to a paragraph; **text** segments are bold."""
    for i, part in enumerate(re.split(r"\*\*", text)):
        if not part:
            continue
        r = paragraph.add_run()
        r.text = part
        r.font.name = FONT
        r.font.size = Pt(size)
        r.font.bold = bold or (i % 2 == 1)
        r.font.color.rgb = color


def textbox(slide, x, y, w, h, text, size=14, color=INK, bold=False,
            align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line_spacing=1.05):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for m in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, m, Inches(0.04))
    lines = text if isinstance(text, list) else [text]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line_spacing
        _runs(p, line, size, color, bold)
    return tb


def bullets(slide, x, y, w, h, items, size=15, color=INK, gap=6, marker="›", indent=0.28,
            hang=0.24):
    """Chevron bullets like the earlier decks. ("-", text) items are sub-bullets."""
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    for m in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, m, Inches(0.04))
    for i, item in enumerate(items):
        sub = isinstance(item, tuple)
        text = item[1] if sub else item
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_before = Pt(2 if sub else gap)
        p.line_spacing = 1.05
        pPr = p._p.get_or_add_pPr()
        left = Inches(indent + 0.27 if sub else indent)
        pPr.set("marL", str(int(left)))
        pPr.set("indent", str(-int(Inches(hang))))
        r = p.add_run()
        r.text = ("–" if sub else marker) + "\t"
        r.font.name = FONT
        r.font.size = Pt(size - (2 if sub else 0))
        r.font.bold = True
        r.font.color.rgb = MUTED if sub else GOLD
        _runs(p, text, size - (2 if sub else 0), color)
    return tb


def box(slide, x, y, w, h, fill=LIGHT, line=None, shape=MSO_SHAPE.ROUNDED_RECTANGLE,
        text=None, size=13, color=INK, bold=False, align=PP_ALIGN.CENTER,
        anchor=MSO_ANCHOR.MIDDLE, radius=0.08, line_w=1.25):
    s = slide.shapes.add_shape(shape, x, y, w, h)
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = radius
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(line_w)
    s.shadow.inherit = False
    if text is not None:
        tf = s.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        for m in ("margin_left", "margin_right"):
            setattr(tf, m, Inches(0.08))
        for m in ("margin_top", "margin_bottom"):
            setattr(tf, m, Inches(0.04))
        lines = text if isinstance(text, list) else [text]
        for i, line_text in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = align
            p.line_spacing = 1.0
            _runs(p, line_text, size, color, bold)
    return s


def arrow(slide, x1, y1, x2, y2, color=NAVY, width=1.75, label=None, label_dx=0,
          label_dy=-0.28, label_w=1.9, dashed=False):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, x1, y1, x2, y2)
    c.line.color.rgb = color
    c.line.width = Pt(width)
    ln = c.line._get_or_add_ln()
    if dashed:
        etree.SubElement(ln, qn("a:prstDash")).set("val", "dash")
    tail = etree.SubElement(ln, qn("a:tailEnd"))
    tail.set("type", "triangle")
    tail.set("w", "med")
    tail.set("len", "med")
    if label:
        mx = (x1 + x2) / 2 + Inches(label_dx) - Inches(label_w) / 2
        my = (y1 + y2) / 2 + Inches(label_dy)
        textbox(slide, Emu(int(mx)), Emu(int(my)), Inches(label_w), Inches(0.3), label,
                size=10, color=MUTED, align=PP_ALIGN.CENTER)
    return c


def table(slide, x, y, w, rows, col_w, size=11, header_size=12, row_h=0.4,
          first_col_bold=True):
    n_rows, n_cols = len(rows), len(rows[0])
    gt = slide.shapes.add_table(n_rows, n_cols, x, y, w, Inches(row_h * n_rows))
    t = gt.table
    tblPr = t._tbl.tblPr
    style = tblPr.find(qn("a:tableStyleId"))
    if style is None:
        style = etree.SubElement(tblPr, qn("a:tableStyleId"))
    style.text = "{5940675A-B579-460E-94D1-54222C63F5DA}"  # No Style, Table Grid
    for j, cw in enumerate(col_w):
        t.columns[j].width = Inches(cw)
    for i, row in enumerate(rows):
        t.rows[i].height = Inches(row_h)
        for j, val in enumerate(row):
            cell = t.cell(i, j)
            cell.margin_left = cell.margin_right = Inches(0.07)
            cell.margin_top = cell.margin_bottom = Inches(0.035)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.fill.solid()
            if i == 0:
                cell.fill.fore_color.rgb = NAVY
            else:
                cell.fill.fore_color.rgb = LIGHT if i % 2 == 0 else WHITE
            tf = cell.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            if i == 0:
                _runs(p, val, header_size, WHITE, bold=True)
            else:
                _runs(p, val, size, INK, bold=(j == 0 and first_col_bold))
            _cell_border(cell)
    return t


def _cell_border(cell, color="C9D0E0", width=6350):
    tcPr = cell._tc.get_or_add_tcPr()
    for tag in ("a:lnL", "a:lnR", "a:lnT", "a:lnB"):
        ln = etree.SubElement(tcPr, qn(tag))
        ln.set("w", str(width))
        sf = etree.SubElement(ln, qn("a:solidFill"))
        clr = etree.SubElement(sf, qn("a:srgbClr"))
        clr.set("val", color)


def status_pill(slide, text, fill=GOLD):
    w = Inches(0.11 * len(text) + 0.35)
    x = W - w - Inches(0.5)
    box(slide, x, Inches(0.42), w, Inches(0.34), fill=fill, text=text,
        size=11, color=WHITE, bold=True, radius=0.5)
    return x


def wordmark(slide, x, y, color=NAVY, size=15):
    textbox(slide, x, y, Inches(2.2), Inches(0.3), "TAKAS", size=size, color=color, bold=True)
    textbox(slide, x, y + Inches(0.27), Inches(2.2), Inches(0.25), "İSTANBUL", size=size - 6,
            color=color, bold=True)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


def content_slide(title, pill=None, pill_fill=GOLD, sources=None):
    global page_no
    page_no += 1
    s = prs.slides.add_slide(BLANK)
    frame = box(s, Inches(0.18), Inches(0.18), W - Inches(0.36), H - Inches(0.36), fill=WHITE,
                line=NAVY, radius=0.025, line_w=2.5)
    frame.name = "frame"
    wordmark(s, Inches(0.45), Inches(0.32))
    title_w = W - Inches(4.4)
    if pill:
        pill_x = status_pill(s, pill, pill_fill)
        title_w = min(title_w, pill_x - Inches(2.3))
    textbox(s, Inches(2.2), Inches(0.34), title_w, Inches(0.6), title, size=26,
            color=INK, bold=True, align=PP_ALIGN.CENTER)
    textbox(s, Inches(4.5), H - Inches(0.52), Inches(4.33), Inches(0.28),
            "Gizlilik Seviyesi: Kurum İçi", size=10, color=RED, align=PP_ALIGN.CENTER)
    textbox(s, Inches(6.4), H - Inches(0.75), Inches(0.53), Inches(0.25), str(page_no + 1),
            size=11, color=NAVY, align=PP_ALIGN.CENTER)
    if sources:
        notes(s, "Kaynak notlar (Obsidian Vault): " + sources)
    return s


def cover(title_lines, subtitle):
    s = prs.slides.add_slide(BLANK)
    bg = box(s, 0, 0, W, H, fill=NAVY, shape=MSO_SHAPE.RECTANGLE)
    bg.name = "bg"
    logo = box(s, Inches(5.67), 0, Inches(2.0), Inches(1.9), fill=WHITE, radius=0.12)
    logo.name = "logo-placeholder"
    textbox(s, Inches(5.67), Inches(0.75), Inches(2.0), Inches(0.5), "TAKAS", size=30,
            color=NAVY, bold=True, align=PP_ALIGN.CENTER)
    textbox(s, Inches(5.67), Inches(1.25), Inches(2.0), Inches(0.4), "İSTANBUL", size=18,
            color=NAVY, bold=True, align=PP_ALIGN.CENTER)
    textbox(s, Inches(1.5), Inches(2.75), W - Inches(3.0), Inches(2.0), title_lines, size=32,
            color=WHITE, bold=True, align=PP_ALIGN.CENTER, line_spacing=1.1)
    textbox(s, Inches(1.5), Inches(5.55), W - Inches(3.0), Inches(0.6), subtitle, size=30,
            color=WHITE, bold=True, align=PP_ALIGN.CENTER)
    textbox(s, Inches(4.5), H - Inches(0.45), Inches(4.33), Inches(0.28),
            "Gizlilik Seviyesi: Kurum İçi", size=10, color=RGBColor(0xF5, 0xB7, 0xB1),
            align=PP_ALIGN.CENTER)
    return s


def footnote(slide, text, y=6.55):
    textbox(slide, Inches(0.55), Inches(y), W - Inches(1.1), Inches(0.35), text, size=10.5,
            color=MUTED)


# ------------------------------------------------------------------ slides

# 1 — Kapak
s = cover(["TAKASBANK DATA WAREHOUSE ALT YAPISI", "OLUŞTURMA ÇALIŞMASI",
           "DURUM BİLGİLENDİRMESİ-5"], "KASIM 2026")
notes(s, "Seri: 1 - Eylül 2024, 2 - Aralık 2024, 3 - Mart 2025, 4 - Temmuz 2025, 5 - Kasım 2026. "
         "Kapaktaki beyaz kutu logo yeri tutucusudur; kurum şablonundaki logo ile değiştirilmeli.")

# 2 — İçerik
s = content_slide("İÇERİK")
items = [
    "Çalışmanın Tarihçesi",
    "Takasbank'ta Mevcut Durum",
    "İş Birimi ve UG Görüşmelerinden Tespitler",
    "Hedef Mimari",
    "Fiziksel Yerleşim ve Kapasite",
    "ETL Aracı Değerlendirmesi",
    "Pilot Önerisi",
    "Yol Haritası ve İlk 30 Gün",
    "Ekip ve Danışmanlık Modeli",
    "Riskler",
    "Karar Beklenen Konular ve Açık Sorular",
]
for i, it in enumerate(items):
    col, row = divmod(i, 7)
    x = Inches(1.3 + col * 5.6)
    y = Inches(1.35 + row * 0.69)
    box(s, x, y, Inches(0.55), Inches(0.55), fill=NAVY, text=str(i + 1),
        size=15 if i < 9 else 13, color=WHITE, bold=True, shape=MSO_SHAPE.OVAL)
    textbox(s, x + Inches(0.65), y + Inches(0.04), Inches(4.8), Inches(0.45), it, size=18,
            color=INK, anchor=MSO_ANCHOR.MIDDLE)

# 3 — Tarihçe
s = content_slide("ÇALIŞMANIN TARİHÇESİ", sources="Firmalarla Yapılan DWH Görüşmeleri; "
                  "Obase Takasbank Değerlendirme Raporu Ağustos 2024; DWH Sunum Eylül 2024; "
                  "DWH Sunum Aralık 2024; DWH Sunum Temmuz 2025; Komtaş Future-Ready Data "
                  "Platform Teklifi Ağustos 2026; Toplantı Notları (Eylül 2026); Başlangıç Yaklaşımı")
events = [
    ("Haz–Tem 2024", "Firma görüşmeleri",
     ["Ondata, Obase", "İZV öncülüğünde BT Mimari, Veritabanı ve UG ekipleri"], False),
    ("Ağu 2024", "Obase raporu", ["İhtiyaçların önce **ODS** ile karşılanması önerildi"], False),
    ("Eyl 2024", "Sunum-1", ["Gerekçeler, yol haritası", "TEFAS/BES gibi alanda **POC** önerisi"], False),
    ("Ara 2024", "Sunum-2", ["ODS → KALE, DWH → SUR", "Vakıfbank, MKK, Borsa İstanbul incelemesi"], False),
    ("Oca 2025 – May 2026", "Personel arayışı",
     ["Deneyimli personel alımı için arayış", "**Birçok mülakat** yapıldı"], True),
    ("Mar 2025", "Sunum-3", ["DWH üzerinde **4 proje** önerisi ilk kez anlatıldı"], False),
    ("Tem 2025", "Sunum-4", ["**ODS kurulması** kararı", "Pilot yaklaşımı", "4 örnek uygulama", "ODVM"], False),
    ("Ara 2025 – Mar 2026", "ODI PoC", ["**Ondata** ile Oracle Data Integrator PoC"], True),
    ("Nis–May 2026", "Informatica PoC", ["**Komtaş** ile Informatica PoC"], True),
    ("Ağu 2026", "Komtaş teklifi", ["~3 ay tasarım", "Mimari, kavramsal model, yol haritası, **RFP**"], True),
    ("Eyl 2026", "UG görüşmeleri",
     ["Tüm UG ekipleri, **talep ve ihtiyaç analizi**", "6 danışman firma", "**dbt PoC** tamamlandı"], True),
    ("Eki 2026", "Workshop ve taslaklar",
     ["Dataspecta workshop", "ETL, veri replikasyon, orkestrasyon çalışmaları", "**Tasarım taslakları**"], True),
]
x0, y_line = Inches(0.5), Inches(2.45)
step = Inches(12.33 / len(events))
line = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, x0, y_line, x0 + step * len(events), y_line)
line.line.color.rgb = LINE
line.line.width = Pt(4)
for i, (when, what, detail, recent) in enumerate(events):
    x = x0 + step * i
    textbox(s, x, Inches(1.4), step, Inches(0.6), when, size=12, color=NAVY, bold=True,
            align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.BOTTOM)
    box(s, x + step / 2 - Inches(0.13), y_line - Inches(0.13), Inches(0.26), Inches(0.26),
        fill=GOLD if recent else NAVY, shape=MSO_SHAPE.OVAL)
    card = box(s, x + Inches(0.03), Inches(2.85), step - Inches(0.06), Inches(2.9),
               fill=RGBColor(0xFD, 0xF3, 0xE4) if recent else LIGHT,
               text=f"**{what}**", size=10.5, anchor=MSO_ANCHOR.TOP, radius=0.06)
    card.text_frame.margin_left = card.text_frame.margin_right = Inches(0.03)
    bullets(s, x + Inches(0.01), Inches(3.4), step - Inches(0.02), Inches(2.3), detail,
            size=10, gap=3, marker="•", indent=0.1, hang=0.09)
footnote(s, "Turuncu: son sunumdan (Temmuz 2025) bu yana gerçekleşen veya süren adımlar. "
            "Eylül–Ekim 2026 ayrıntısı sonraki slayttadır.", y=5.95)

# 3b — Eylül–Ekim 2026 çalışmaları
s = content_slide("EYLÜL – EKİM 2026 ÇALIŞMALARI", pill="Son sunumdan bu yana", pill_fill=GOLD,
                  sources="Kullanıcı aktarımı (02.11.2026); Toplantı Notları (Eylül 2026); "
                  "Takasbank_ETL_Comparison.xlsx (v2.7); DWH Hedef Mimarisi v2; DWH Logical Data "
                  "Model; Başlangıç Yaklaşımı; Proje Planı")
months = [
    ("EYLÜL 2026", [
        "**Tüm UG ekipleriyle** görüşüldü; **talep ve ihtiyaç analizi** yapıldı",
        "**PowerDesigner** ve **veritabanları / ortamlar** hakkında bilgilendirme toplantıları yapıldı",
        "Danışman firmalarla görüşüldü: **Ab Initio, Oredata, Cloudera, Dataspecta, GTech, "
        "Global Maksimum**; ürünleri ve süreç boyunca nasıl destek verebilecekleri konuşuldu",
        "**dbt** için PoC çalışması tamamlandı ve sunumu yapıldı",
    ]),
    ("EKİM 2026", [
        "**Dataspecta** ile workshop yapıldı",
        "**ETL ürünlerini değerlendirme** dokümantasyonu tamamlandı: değerlendirme çerçevesi, "
        "karşılaştırma matrisi, PoC kabul kriterleri, tedarikçi soru seti, karar kaydı şablonu",
        "Veri aktarım ve replikasyon aracı olarak **Oracle GoldenGate**'in kullanılabilirliğiyle ilgili ön çalışma "
        "yapıldı",
        "**Orkestrasyon** gereksinimi için farklı seçeneklerin değerlendirmesi yapıldı",
        "**Tasarım taslakları** belirlendi: hedef mimari, mantıksal veri modeli, başlangıç "
        "yaklaşımı, proje planı",
    ]),
]
for i, (name, pts) in enumerate(months):
    x = Inches(0.6 + i * 6.15)
    box(s, x, Inches(1.25), Inches(5.95), Inches(0.55), fill=NAVY, text=name, size=17,
        color=WHITE, bold=True)
    box(s, x, Inches(1.8), Inches(5.95), Inches(4.45), fill=LIGHT, shape=MSO_SHAPE.RECTANGLE)
    bullets(s, x + Inches(0.1), Inches(1.9), Inches(5.75), Inches(4.3), pts, size=16, gap=10)

# 6 — Mevcut durum: veri ve ortamlar
s = content_slide("MEVCUT DURUM: VERİ VE ORTAMLAR", pill="Mevcut durum",
                  pill_fill=NAVY, sources="Sistemler ve Servisler; Fiziksel Topoloji - Teknik "
                  "Taraf; Ortamlar hakkında; Takasbank Genel Bilgilendirme 1-2; PowerDesigner "
                  "Bilgilendirme; DWH Sunum Eylül 2024; Banka Ug")
textbox(s, Inches(0.6), Inches(1.2), Inches(6), Inches(0.4), "Veri kaynakları", size=18,
        color=NAVY, bold=True)
bullets(s, Inches(0.6), Inches(1.55), Inches(6.0), Inches(4.8), [
    "**KALE**: verinin ~%90'ı, ~10 TB; ~7.000 ana + ~3.000 backup tablo",
    "ERD diyagramları kullanılmamakta; **PowerDesigner**'da tüm tablo ve kolonlar, hassas veri "
    "bayrağı ve veri sahibi tutuluyor",
    "Uydu kaynaklar:",
    ("-", "**ARSIV**"),
    ("-", "**ÇEKDB**"),
    ("-", "Borsa **Replica BIDB / Borsa DWH**"),
    ("-", "FTP/CSV dosyaları"),
    ("-", "Web servisleri"),
    "Kaynak veri temiz; ekranlarda çok sayıda kontrol noktası var",
], size=16)
textbox(s, Inches(6.9), Inches(1.2), Inches(6), Inches(0.4), "Ortamlar", size=18, color=NAVY,
        bold=True)
bullets(s, Inches(6.9), Inches(1.55), Inches(5.9), Inches(4.8), [
    "KALE'nin **2 Data Guard replikası** var: biri KALE, biri SUR Exadata üzerinde",
    "**PREPROD**: T-1, test ile aynı instance",
    "PREPROD her sabah 07:00'de KALE'den kopartılıyor; flashback snapshot 04:00–07:00",
    "**GoldenGate** lisansı var: 336 CPU (Borsa İstanbul: 975 CPU)",
], size=16)
footnote(s, "Aynı kavram (ör. üye) farklı şemalarda ve piyasa bazında ayrı tablolarda tutulmaktadır.",
         y=6.25)

# 7 — Mevcut durum: raporlama
s = content_slide("MEVCUT DURUM: RAPORLAMA", pill="Mevcut durum",
                  pill_fill=NAVY, sources="Takasbank Genel Bilgilendirme 1-2; Banka Ug; "
                  "Kullanıcı aktarımı (04.11.2026)")
lanes = ["Team Developer", "Web / React", "MSTR (Pusula)"]
for i, name in enumerate(lanes):
    x = Inches(0.6 + i * 4.1)
    box(s, x, Inches(1.35), Inches(3.9), Inches(0.75), fill=NAVY, text=name, size=18, color=WHITE,
        bold=True)
bullets(s, Inches(0.6), Inches(2.6), Inches(12.1), Inches(3.3), [
    "Takasbank'ta raporlar hem **anlık** hem de **geçmiş tarihli** veriyi sorgular. Anlık "
    "sorgulama daha yoğundur.",
    "Ana işlemler ve raporlama sorguları **aynı veritabanında** çalışır.",
], size=18, gap=14)

# 8 — UG görüşmeleri
s = content_slide("UG GÖRÜŞMELERİNDEN TESPİTLER", pill="Eylül 2026",
                  pill_fill=NAVY, sources="Banka Ug; Enerji UG; Takas UG; Takasbank Genel "
                  "Bilgilendirme 1-2")
table(s, Inches(0.55), Inches(1.25), W - Inches(1.1), [
    ["Ekip", "Öne çıkanlar", "DWH açısından anlamı"],
    ["Banka UG (transfer, ödeme)", "SWIFT/EFT raporları geriye dönük olabiliyor; SWIFT verisi çok "
     "büyük, gecelik özet tablolar var; tarihçelendirme → backup → arşiv akışı",
     "Pilot A adayı; arşiv sorumluluğu DWH'a geçebilir"],
    ["Piyasalar UG", "Anlık rapor ihtiyacı ve yoğun rapor talebi; performans sorunları",
     "Gün içi raporlar ODS_ şemalarından, tarihsel raporlar DWH mart'tan"],
    ["Takas UG / Takas entegrasyon", "Borsa DWH'dan (BISTDWH) extract; raporlar transaction "
     "tablolarını blokluyor; günde ~20 milyon kayıt (türev ve türev harici pozisyon)",
     "En yüksek hacim; Borsa DWH beslemesi conformed dış kaynak"],
    ["MKT ekibi", "Ağırlıkla BISTECH ile çalışıyor", "Pilot B (BISTECH SPK) paydaşı"],
    ["Enerji UG", "EPİAŞ'tan web servisle emir bilgisi; günde en fazla 5–10 bin kayıt, performans "
     "sorunu yok; uzun ve karmaşık SQL'ler; kritik veri: ihale",
     "Öncelik düşük; modelleme ile SQL sadeleşir"],
    ["Hazine muhasebe", "Günlük, haftalık, aylık karmaşık yasal raporlar",
     "Faz 5 (kritik ve yasal raporlar) kapsamı"],
], [2.6, 6.0, 3.63], size=12.5, header_size=13, row_h=0.68)
footnote(s, "İlk görüşme notlarıdır; hacimler ve ihtiyaçlar rapor envanteri çalışmasında ilgili "
            "ekiplerle doğrulanacaktır.", y=6.55)

# 9 — Güçlü yönler / kısıtlar
s = content_slide("TEMEL TESPİTLER", sources="DWH Sunum Aralık 2024 (artı/eksi yönler); "
                  "Başlangıç Yaklaşımı (Notların söylediği kurum); Firmalarla Yapılan DWH "
                  "Görüşmeleri; DWH Sunum Temmuz 2025")
box(s, Inches(0.6), Inches(1.25), Inches(5.9), Inches(0.5), fill=GREEN, text="Güçlü yönlerimiz",
    size=16, color=WHITE, bold=True)
bullets(s, Inches(0.6), Inches(1.8), Inches(5.9), Inches(4.6), [
    "Verinin büyük kısmı KALE'de; **temiz ve kaliteli** veri",
    "Donanım yeterli: boş disk %77–90; SUR ve HİSAR'da CPU kullanımı düşük",
    "Piyasa bazında şema ayrımı **aşamalı geçişe** imkân veriyor",
    "Güçlü Oracle DBA ve PL/SQL yetkinliği",
    "PowerDesigner kataloğu ve **GoldenGate lisansı** (336 CPU) mevcut; Borsa İstanbul "
    "ile GG akışı kurulabilir",
], size=16)
box(s, Inches(6.85), Inches(1.25), Inches(5.9), Inches(0.5), fill=RED,
    text="Kısıtlar ve çözülmesi gerekenler", size=16, color=WHITE, bold=True)
bullets(s, Inches(6.85), Inches(1.8), Inches(5.9), Inches(4.6), [
    "İşlem ve raporlama aynı veritabanında; KALE yükü artıyor",
    "ERD yok; çoklu üye tabloları; konu alanı bazında “doğru sayı” otoritesi belirsiz",
    "Gün sonu zaman çizelgesi tek anlatımda birleşmedi; tarihsel veriye update geliyor",
    "Borsa fon sözleşme verisi kaynakta **5 gün sonra siliniyor**; yakalanmayan tarihçe kayboluyor",
    "GoldenGate işletimi ve 7/24 destek konusunda DBA çekincesi",
    "Veri kurum dışına çıkamaz; satın alma süreci uzun",
], size=16)

# 10 — Hedef mimari
s = content_slide("HEDEF MİMARİ", pill="ODS kararı + öneri",
                  sources="Sistemler ve Servisler (4.1 ODS kararı, 02.11.2026); Fiziksel Topoloji - "
                  "Teknik Taraf (GoldenGate lisansları); Başlangıç Yaklaşımı (diyagram); DWH Hedef "
                  "Mimarisi v2; Aktif Sorular 4; landing = ODS kararı (04.11.2026)")
src_x, src_w = Inches(0.6), Inches(2.2)
srcs = [("KALE (Prod)", 1.45), ("ARSIV / ÇEKDB", 2.45), ("Borsa Replica BIDB / Borsa DWH", 3.45),
        ("FTP / CSV / Web servis", 4.75)]
textbox(s, src_x, Inches(1.08), src_w, Inches(0.3), "KAYNAKLAR", size=12, color=MUTED, bold=True,
        align=PP_ALIGN.CENTER)
for name, y in srcs:
    box(s, src_x, Inches(y), src_w, Inches(0.7), fill=LIGHT, line=NAVY, text=name, size=13,
        bold=True)
dwh_x, dwh_y, dwh_w, dwh_h = Inches(3.55), Inches(1.2), Inches(6.9), Inches(4.6)
box(s, dwh_x, dwh_y, dwh_w, dwh_h, fill=RGBColor(0xF7, 0xF8, 0xFC), line=NAVY, radius=0.04,
    line_w=2)
textbox(s, dwh_x + Inches(0.15), dwh_y + Inches(0.05), Inches(3), Inches(0.3),
        "DWH VERİTABANI (Exadata)", size=12, color=NAVY, bold=True)
ods_x, ods_y, ods_w, ods_h = dwh_x + Inches(0.2), Inches(1.6), dwh_w - Inches(0.4), Inches(0.95)
box(s, ods_x, ods_y, ods_w, ods_h, fill=RGBColor(0xE3, 0xF1, 0xF3), line=TEAL, line_w=1.75,
    text=["**ODS_<kaynak şema>** — landing katmanı; her kaynak sistem şeması için bir şema",
          "GoldenGate ile güncel tutulur · kaynak şeklinde, entegrasyon yok"], size=12.5)
layer_y = Inches(3.0)
layers = [("CORE", "Entegre, tarihçeli"), ("DM", "Kimball mart"),
          ("PUB", "Yasal snapshot, üye dosyası, API")]
lw, lgap = Inches(1.95), Inches(0.325)
for i, (code, d) in enumerate(layers):
    lx = dwh_x + Inches(0.2) + (lw + lgap) * i
    box(s, lx, layer_y, lw, Inches(1.05), fill=NAVY, text=[f"**{code}**", d], size=12,
        color=WHITE)
    if i:
        arrow(s, lx - lgap, layer_y + Inches(0.52), lx, layer_y + Inches(0.52))
core_cx = dwh_x + Inches(0.2) + lw / 2
arrow(s, core_cx, ods_y + ods_h, core_cx, layer_y, color=NAVY)
box(s, dwh_x + Inches(0.2), Inches(4.35), dwh_w - Inches(0.4), Inches(0.5), fill=LIGHT,
    line=LINE, text="**CTL** — yükleme kaydı, gün sonu sinyali, kalite ve mutabakat sonuçları",
    size=12)
textbox(s, dwh_x + Inches(0.2), Inches(5.0), dwh_w - Inches(0.4), Inches(0.6),
        "Çok kaynaklı entegre güncel durum gerekiyorsa CORE üzerinde görünüm olarak üretilir; "
        "ODS_ kaynak şeklinde kalır.", size=11, color=MUTED)
gg_x = ods_x
arrow(s, src_x + src_w, Inches(1.8), gg_x, Inches(1.8), color=TEAL, width=2,
      label="GoldenGate", label_dy=-0.3, label_w=1.1)
arrow(s, src_x + src_w, Inches(2.8), gg_x, Inches(2.3), color=TEAL, width=2)
arrow(s, src_x + src_w, Inches(3.8), gg_x, Inches(2.5), color=TEAL, width=1.5, dashed=True)
textbox(s, Inches(2.84), Inches(3.85), Inches(0.7), Inches(0.5), ["GG", "kurumlar", "arası"],
        size=9, color=TEAL)
arrow(s, src_x + src_w, Inches(5.1), ods_x + Inches(0.15), ods_y + ods_h, color=MUTED,
      width=1.25, dashed=True)
textbox(s, Inches(2.84), Inches(5.2), Inches(0.7), Inches(0.5), ["dosya /", "servis"],
        size=9, color=MUTED)
r_x, r_w = Inches(10.85), Inches(1.95)
box(s, r_x, ods_y, r_w, ods_h, fill=RGBColor(0xE3, 0xF1, 0xF3), line=TEAL,
    text=["**Gün içi operasyonel rapor**", "İzleme, Team Developer"], size=12)
arrow(s, dwh_x + dwh_w, ods_y + ods_h / 2, r_x, ods_y + ods_h / 2, color=TEAL)
box(s, r_x, Inches(2.85), r_w, Inches(0.9), fill=GOLD, text=["**MSTR**", "semantik katman"],
    size=13, color=WHITE)
arrow(s, dwh_x + dwh_w, Inches(3.3), r_x, Inches(3.3), color=GOLD)
box(s, r_x, Inches(3.95), r_w, Inches(0.9), fill=LIGHT, line=NAVY,
    text=["**SPK, üyeler**", "React, web servis"], size=12)
arrow(s, dwh_x + dwh_w, Inches(4.4), r_x, Inches(4.4), color=NAVY)
footnote(s, "**Kararlar:** ayrı ODS veritabanı yok; ODS_ şemaları DWH içinde, GoldenGate ile "
            "(02.11.2026; lisans: Takasbank 336 CPU, Borsa İstanbul 975 CPU) · ayrı landing katmanı "
            "yok, landing = ODS_ (04.11.2026) · tvsods hedefte yok · Diğer katmanlar öneridir · "
            "Açık: GG extract kaynağı (prod / standby), kaynaktaki silme ve update'lerin ODS_'te "
            "izinin tutulması", y=6.05)

# 13 — Fiziksel yerleşim
s = content_slide("FİZİKSEL YERLEŞİM VE KAPASİTE", sources="DWH Sunum Aralık 2024 (slayt 3, "
                  "9–14); DWH Sunum Temmuz 2025 (slayt 8); Fiziksel Topoloji - Teknik Taraf "
                  "(DWH yerleşim adayları)")
machines = [
    ("KALE EXADATA", "KALE, ARSIV, CEKDB, tvsods", "~%90", "~%25 (günlük tepe)",
     "ODS burada", "Hedef değil — boşaltılmak istenen makine", RED),
    ("SUR EXADATA", "DSS, PREPROD, TRUVA, LAMBDA, EFES + ~9 DB; KALE replikası", "~%77", "~%6–12",
     "DWH burada", "Aday — test/preprod yükü ve 04:00–07:00 snapshot penceresiyle çakışma riski",
     GOLD),
    ("HİSAR EXADATA", "HİSAR, TABYA, CEKDB, ARSIVDB", "~%81", "~%2–3",
     "ODVM ODS/DWH", "Aday — tarihçeyi ARSIVDB ile aynı makinede toplama avantajı", GREEN),
]
for i, (name, dbs, disk, cpu, prev, now, c) in enumerate(machines):
    x = Inches(0.6 + i * 4.1)
    box(s, x, Inches(1.2), Inches(3.9), Inches(0.55), fill=NAVY, text=name, size=16, color=WHITE,
        bold=True)
    box(s, x, Inches(1.75), Inches(3.9), Inches(0.85), fill=LIGHT, text=dbs, size=12.5,
        shape=MSO_SHAPE.RECTANGLE)
    textbox(s, x + Inches(0.1), Inches(2.75), Inches(1.9), Inches(0.3), "Boş disk", size=12,
            color=MUTED)
    textbox(s, x + Inches(0.1), Inches(3.02), Inches(1.9), Inches(0.5), disk, size=26, color=NAVY,
            bold=True)
    textbox(s, x + Inches(2.0), Inches(2.75), Inches(1.9), Inches(0.3), "CPU", size=12,
            color=MUTED)
    textbox(s, x + Inches(2.0), Inches(3.08), Inches(1.9), Inches(0.5), cpu, size=15, color=NAVY,
            bold=True)
    textbox(s, x + Inches(0.1), Inches(3.75), Inches(3.7), Inches(0.5),
            f"**Önceki öneri:** {prev}", size=13)
    box(s, x, Inches(4.25), Inches(3.9), Inches(1.0), fill=WHITE, line=c, line_w=2, text=now,
        size=13)
box(s, Inches(0.6), Inches(5.5), W - Inches(1.2), Inches(0.75), fill=LIGHT,
    text="**Karar yöntemi:** DBA ekibiyle IO/CPU izolasyon testi ve kapasite modeli (ODS_, core, "
         "mart, indeks, temp, yedek, DR, büyüme) sonrasında. 1 Exadata ≈ 200 TB, KALE ≈ 10 TB "
         "bilgisi tek başına kapasite onayı değildir.", size=13, align=PP_ALIGN.LEFT)
footnote(s, "Disk ve CPU değerleri Aralık 2024 kapasite görüntüsüdür (11–17 Aralık 2024); güncel "
            "ölçümle yenilenmelidir.", y=6.4)

# 14 — ETL değerlendirmesi
s = content_slide("ETL ARACI DEĞERLENDİRMESİ: ÖZET", pill="Öneri — iki seçenek",
                  pill_fill=TEAL, sources="Takasbank_ETL_Comparison.xlsx v2.7, 16.10.2026 "
                  "(Executive Summary, Scoring Matrix, Scenario Analysis, TCO); "
                  "takasbank_etl_evaluation.canvas.tsx")
textbox(s, Inches(0.6), Inches(1.15), Inches(5.6), Inches(0.4),
        "Ağırlıklı puan (1–5), Takasbank temel senaryosu", size=15, color=NAVY, bold=True)
cd = CategoryChartData()
cd.categories = ["Spark", "Informatica", "Cloudera", "ODI 14c", "dbt Core"]
cd.add_series("Puan", (2.93, 3.26, 3.30, 3.36, 3.71))
gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(0.5), Inches(1.5), Inches(5.8),
                        Inches(3.6), cd)
ch = gf.chart
ch.has_legend = False
ch.has_title = False
ch.plots[0].gap_width = 60
ch.plots[0].has_data_labels = True
dl = ch.plots[0].data_labels
dl.font.size = Pt(13)
dl.font.bold = True
dl.font.name = FONT
dl.number_format = "0.00"
dl.number_format_is_linked = False
dl.position = XL_LABEL_POSITION.OUTSIDE_END
ser = ch.plots[0].series[0]
for idx in range(5):
    pt = ser.points[idx]
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = NAVY if idx == 4 else (TEAL if idx == 3 else LINE)
va = ch.value_axis
va.maximum_scale, va.minimum_scale = 4.5, 0
va.has_major_gridlines = False
va.visible = False
ca = ch.category_axis
ca.tick_labels.font.size = Pt(13)
ca.tick_labels.font.name = FONT
ca.format.line.color.rgb = LINE
textbox(s, Inches(0.6), Inches(5.15), Inches(5.6), Inches(1.2), [
    "**Ağırlık profillerine göre:** dbt 6 profilin 4'ünde önde. Düzenleyici öncelikli "
    "profilde ODI önde (ODI 3.70, dbt 3.64); gerçek zaman öncelikli profilde Cloudera önde "
    "(3.54, dbt 3.25)",
], size=12, color=INK)
textbox(s, Inches(6.75), Inches(1.15), Inches(6), Inches(0.4), "Öneri", size=17, color=NAVY,
        bold=True)
bullets(s, Inches(6.75), Inches(1.5), Inches(6.0), Inches(4.9), [
    "Yönlendirme komitesine iki seçenek; ikisi de Exadata üzerinde, değişiklik yakalama "
    "**GoldenGate** ile",
    "**A — dbt Core:** teslim hızı, SQL ekibi ve yerel LLM ile uyum, lisans yok, PostgreSQL'e "
    "geçiş açık. Üretici desteği yok; sözleşmeli destek modeline Bilgi Güvenliği ve İç Denetim "
    "onayı gerekir",
    "**B — ODI 14c:** üretici desteği, erişim kontrolü, denetim izi, HA/DR; PL/SQL raporlar "
    "değişmeden çalışır. ULA dışında yeni lisans (varsayım yıllık 250 bin USD)",
    "~200 rapor sorgusunun dönüşümü (tahmin): dbt **150–300**, ODI **400–700**, "
    "Cloudera/Spark 600–1.000 adam-gün",
    "**PoC'ler tamamlandı**, değerlendirme sürüyor; araç henüz seçilmedi. Pilot, ETL aracı "
    "seçildikten sonra başlar",
    "Informatica ve tek başına Spark önerilmiyor; Cloudera yalnızca saniye altı akış "
    "zorunlu olursa",
], size=13.5, gap=5)
footnote(s, "Puanlar masa başı değerlendirmedir (15 kategori, 64 kriter). Banka testi, fiyat "
            "teklifi veya satın alma onayı değildir. Ayrıntı sonraki beş slayttadır.", y=6.45)

ETL_SRC = "Takasbank_ETL_Comparison.xlsx v2.7, 16.10.2026"
ETL_TOOLS = ["ODI 14c", "Informatica", "dbt Core", "Cloudera", "Spark"]


def style_cell(cell, fill=None, color=None, bold=None):
    if fill is not None:
        cell.fill.solid()
        cell.fill.fore_color.rgb = fill
    for p in cell.text_frame.paragraphs:
        for r in p.runs:
            if color is not None:
                r.font.color.rgb = color
            if bold is not None:
                r.font.bold = bold


def center_cols(t, cols):
    for row in t.rows:
        for j in cols:
            for p in row.cells[j].text_frame.paragraphs:
                p.alignment = PP_ALIGN.CENTER


# 14b — ETL: yöntem ve karar kısıtları
s = content_slide("ETL ARACI DEĞERLENDİRMESİ: YÖNTEM VE KISITLAR",
                  sources=f"{ETL_SRC} (Executive Summary: Decision constraints; Tool Profiles; "
                  "Assumptions & Sources)")
textbox(s, Inches(0.6), Inches(1.15), Inches(5.9), Inches(0.4), "Değerlendirilen adaylar",
        size=17, color=NAVY, bold=True)
table(s, Inches(0.6), Inches(1.55), Inches(5.9), [
    ["Araç", "Tür"],
    ["ODI 14c", "ELT entegrasyon aracı (ticari, Oracle)"],
    ["Informatica 10.5", "Motor tabanlı ETL aracı (ticari)"],
    ["dbt Core", "SQL dönüşüm çerçevesi (açık kaynak)"],
    ["Cloudera Data Platform", "Entegre veri platformu (ticari)"],
    ["Apache Spark", "Dağıtık işlem motoru (açık kaynak)"],
], [2.3, 3.6], size=12.5, header_size=13, row_h=0.36)
textbox(s, Inches(0.6), Inches(3.9), Inches(5.9), Inches(0.4), "Yöntem", size=17, color=NAVY,
        bold=True)
bullets(s, Inches(0.6), Inches(4.25), Inches(5.9), Inches(2.2), [
    "**15 kategori, 64 kriter**; her kriter 1–5 puan, kategori puanı kriterlerin ortalaması",
    "Toplam puan, kategori ağırlıklarıyla ağırlıklı ortalama; **6 ağırlık profili** ile "
    "duyarlılık analizi",
    "Maliyet, öğrenme eğrisi, bakım ve dönüşüm eforu ters puanlanır (yüksek puan = düşük "
    "maliyet / efor)",
    "Her araç tüm ihtiyacı tek başına karşılama üzerinden puanlandı; Exadata ve GoldenGate "
    "tüm seçeneklerde var",
], size=13, gap=4)
box(s, Inches(6.85), Inches(1.15), Inches(5.9), Inches(0.5), fill=NAVY,
    text="Karar kısıtları (Takasbank girdisi)", size=16, color=WHITE, bold=True)
box(s, Inches(6.85), Inches(1.65), Inches(5.9), Inches(4.75), fill=LIGHT,
    shape=MSO_SHAPE.RECTANGLE)
bullets(s, Inches(6.95), Inches(1.7), Inches(5.7), Inches(4.65), [
    "**Hedef:** mevcut **Oracle Exadata**; staging, ODS, core ve mart'lar burada",
    "**Lisans:** Oracle ULA, **GoldenGate**'i yalnızca Oracle kaynaklar için kapsıyor; Oracle "
    "dışı kaynaklar ek paket ister. **ODI ULA kapsamında değil**",
    "**Mevcut raporlar:** tamamı **PL/SQL**; seçilen araç bunları ilk günden çalıştırmalı, "
    "dönüşüm eforu bir kriter",
    "**Gelecek hedef:** ileride **PostgreSQL**'e geçiş olasılığı; Oracle'a kilitlenmemeli",
    "**Kurum içi:** tüm araçlar on-premises; bulut servisi yok",
    "**Ekip:** SQL'de güçlü; SQL öncelikli geliştirme. Öğrenme eğrisi ve bakım eforu kriter",
    "**Yapay zekâ:** kurum içi (yerel) LLM ile pipeline geliştirme, dokümantasyon, test ve "
    "inceleme hedefleniyor",
], size=13.5, gap=6)

# 14c — ETL: kategori puanları
s = content_slide("ETL ARACI DEĞERLENDİRMESİ: KATEGORİ PUANLARI",
                  sources=f"{ETL_SRC} (Scoring Matrix, Criteria & Weights)")
cat_rows = [
    ("Toplu ETL/ELT yeteneği", 8, (4.4, 4.4, 3.6, 3.4, 3.0)),
    ("CDC ve gerçek zamanlı veri alımı", 13, (1.67, 3.33, 1.33, 4.67, 3.67)),
    ("Metadata, lineage ve veri kalitesi", 4, (3.0, 3.75, 4.25, 3.5, 2.25)),
    ("Güvenlik ve düzenleyici uyum", 8, (4.33, 4.33, 3.0, 4.67, 2.17)),
    ("Operasyon ve bakım", 10, (4.0, 3.78, 3.67, 3.0, 2.56)),
    ("Exadata ve Oracle uyumu", 5, (5.0, 4.0, 4.0, 1.5, 2.0)),
    ("PL/SQL rapor dönüşüm eforu", 9, (3.33, 2.33, 4.33, 2.17, 2.0)),
    ("PostgreSQL'e taşınabilirlik", 5, (2.2, 3.6, 4.2, 3.6, 3.8)),
    ("SQL güçlü ekiple uyum", 6, (4.0, 2.5, 5.0, 3.0, 2.5)),
    ("Öğrenme eğrisi", 7, (3.25, 3.75, 4.5, 2.5, 2.75)),
    ("Yerel LLM ile geliştirme", 8, (2.25, 1.5, 4.75, 3.75, 3.25)),
    ("DevOps ve mühendislik pratikleri", 3, (3.0, 2.5, 4.75, 3.75, 4.0)),
    ("Üretici ve yol haritası", 6, (3.8, 2.8, 3.6, 3.6, 4.4)),
    ("Türkiye'de yetkinlik ve yerel destek", 3, (4.5, 4.0, 3.0, 3.0, 3.0)),
    ("5 yıllık toplam maliyet", 5, (3.33, 2.33, 4.67, 1.67, 3.0)),
]
totals = (3.36, 3.26, 3.71, 3.30, 2.93)


def one_dec(v):
    return f"{int(v * 10 + 0.5 + 1e-9) / 10:.1f}"


def heat(v):
    if v >= 4.25:
        return RGBColor(0x9F, 0xD4, 0xB0)
    if v >= 3.5:
        return RGBColor(0xD6, 0xEE, 0xDD)
    if v >= 2.75:
        return WHITE
    if v >= 2.0:
        return RGBColor(0xF8, 0xDD, 0xD9)
    return RGBColor(0xEE, 0xAF, 0xA7)


rows = [["Kategori", "Ağırlık %"] + ETL_TOOLS]
for name, wt, vals in cat_rows:
    rows.append([name, str(wt)] + [one_dec(v) for v in vals])
rows.append(["Ağırlıklı toplam (1–5)", "100"] + [f"{v:.2f}" for v in totals])
t = table(s, Inches(0.55), Inches(1.15), Inches(8.75), rows,
          [3.05, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95], size=11.5, header_size=11.5, row_h=0.295)
center_cols(t, range(1, 7))
for i, (_, _, vals) in enumerate(cat_rows, start=1):
    best = max(vals)
    for j, v in enumerate(vals):
        style_cell(t.cell(i, j + 2), fill=heat(v), bold=(v == best))
last = len(rows) - 1
for j in range(7):
    style_cell(t.cell(last, j), fill=NAVY, color=WHITE, bold=True)
style_cell(t.cell(last, 4), fill=GOLD, color=WHITE, bold=True)
textbox(s, Inches(9.55), Inches(1.15), Inches(3.25), Inches(0.4), "Öne çıkanlar", size=17,
        color=NAVY, bold=True)
bullets(s, Inches(9.55), Inches(1.5), Inches(3.25), Inches(4.9), [
    "**dbt** SQL ekip uyumu, yerel LLM, DevOps, dönüşüm eforu ve maliyette en yüksek",
    "**ODI** Exadata uyumu, toplu ETL ve operasyonda önde; güvenlikte güçlü",
    "dbt'nin zayıf yanı **CDC** (GoldenGate'e bağlı) ve **güvenlik** (üretici desteği yok)",
    "ODI'nin zayıf yanı **CDC**, **yerel LLM** ve **taşınabilirlik**",
    "**Cloudera** yalnızca CDC / gerçek zamanda belirgin önde; Exadata uyumu ve maliyette en "
    "düşük",
], size=12.5, gap=5)
footnote(s, "Ağırlıklar Takasbank temel profilidir. Kalın: satırdaki en yüksek puan. Yeşil ≥ 3.5, "
            "kırmızı < 2.75. Maliyet ve efor kategorilerinde yüksek puan düşük maliyet / efor "
            "demektir.", y=6.45)

# 14d — ETL: ağırlık senaryoları ve maliyet
s = content_slide("ETL ARACI DEĞERLENDİRMESİ: SENARYOLAR VE MALİYET",
                  sources=f"{ETL_SRC} (Scenario Analysis, TCO (5-yr))")
textbox(s, Inches(0.55), Inches(1.15), Inches(6.2), Inches(0.4),
        "Ağırlık profiline göre toplam puan (1–5)", size=16, color=NAVY, bold=True)
scen = [
    ("Takasbank temel", (3.36, 3.26, 3.71, 3.30, 2.93)),
    ("Önce gerçek zaman", (3.13, 3.33, 3.25, 3.54, 3.04)),
    ("Önce yapay zekâ ve SQL verimliliği", (3.32, 3.08, 3.93, 3.33, 2.94)),
    ("Önce düzenleyici uyum ve üretici desteği", (3.70, 3.50, 3.64, 3.36, 2.83)),
    ("Önce taşınabilirlik (PostgreSQL)", (3.28, 3.27, 3.76, 3.38, 3.07)),
    ("Modern veri yığını", (3.18, 2.97, 4.10, 3.37, 3.14)),
]
rows = [["Profil"] + ETL_TOOLS] + [[n] + [f"{v:.2f}" for v in vals] for n, vals in scen]
t = table(s, Inches(0.55), Inches(1.55), Inches(6.2), rows, [1.95, 0.85, 0.85, 0.85, 0.85, 0.85],
          size=12, header_size=10, row_h=0.42)
center_cols(t, range(1, 6))
for i, (_, vals) in enumerate(scen, start=1):
    k = vals.index(max(vals))
    style_cell(t.cell(i, k + 1), fill=NAVY, color=WHITE, bold=True)
bullets(s, Inches(0.55), Inches(4.65), Inches(6.2), Inches(1.75), [
    "dbt 6 profilin 4'ünde önde; en geniş fark modern veri yığınında (4.10 / 3.37)",
    "Düzenleyici öncelikli profilde **ODI önde** (3.70 / 3.64): ODI'nin eşit seçenek olarak "
    "sunulma nedeni",
    "ODI ULA'ya ücretsiz eklense bile temel profilde **3.40** (dbt 3.71)",
    "Informatica ve Spark hiçbir profilde önde değil",
], size=12.5, gap=4)
textbox(s, Inches(7.0), Inches(1.15), Inches(5.78), Inches(0.4),
        "5 yıllık maliyet (bin USD) ve rapor dönüşüm eforu", size=16, color=NAVY, bold=True)
tco = [
    ("ODI 14c", 1250, 300, 2250, 900, "400–700"),
    ("Informatica", 2600, 700, 2250, 1100, "500–800"),
    ("dbt Core", 300, 150, 1800, 700, "150–300"),
    ("Cloudera", 3500, 1800, 3150, 1300, "600–1.000"),
    ("Spark", 200, 1400, 3600, 1200, "600–1.000"),
]


def tr_int(v):
    return f"{v:,}".replace(",", ".")


rows = [["Araç", "Lisans / destek", "Altyapı", "İnsan", "Hizmet", "Toplam", "Dönüşüm (adam-gün)"]]
for name, lic, infra, ppl, svc, conv in tco:
    rows.append([name, tr_int(lic), tr_int(infra), tr_int(ppl), tr_int(svc),
                 tr_int(lic + infra + ppl + svc), conv])
t = table(s, Inches(7.0), Inches(1.55), Inches(5.78), rows,
          [1.18, 0.82, 0.7, 0.7, 0.7, 0.75, 0.93], size=12, header_size=10.5, row_h=0.42)
center_cols(t, range(1, 7))
for i in range(1, len(rows)):
    style_cell(t.cell(i, 5), bold=True)
for i in (1, 3):
    style_cell(t.cell(i, 0), color=NAVY)
bullets(s, Inches(7.0), Inches(4.25), Inches(5.78), Inches(2.1), [
    "dbt: lisans yok; tutar yerel destek sözleşmesidir",
    "ODI: ULA dışında yeni lisans, yıllık **250 bin USD** varsayımı (5 yılda 1,25 milyon)",
    "Dönüşüm eforu ~**200 PL/SQL rapor** için; dbt'de yerel LLM her modelin taslağını çıkarır, "
    "eşitlik testleri sonucu doğrular",
], size=12.5, gap=4)
footnote(s, "Maliyetler göreli karşılaştırma için kaba tahmindir, teklif değildir. Exadata, Oracle "
            "Database ve ULA kapsamındaki GoldenGate tüm seçeneklerde ortak olduğu için hariçtir.",
         y=6.45)

# 14d2 — ETL: Borsa İstanbul ve MKK görüşmeleri
s = content_slide("ETL ARACI: BORSA İSTANBUL VE MKK GÖRÜŞMELERİ", pill="Kurum görüşmeleri",
                  sources="Kullanıcı aktarımı (04.11.2026: Borsa İstanbul ve MKK ile ETL ürünleri "
                  "görüşmesi); DWH Sunum Eylül 2024 (ETL araçları: MKK PowerCenter, Borsa "
                  "İstanbul ODI); DWH Sunum Aralık 2024 (Slayt 5 MKK, Slayt 6 Borsa İstanbul). "
                  "Görüşlerin içeriği henüz notlarda yok.")
peers = [
    ("BORSA İSTANBUL", "ETL ürünü: **Oracle Data Integrator (ODI)**", TEAL, [
        "DWH'ta T-1 ve öncesi veri; kaynak veri doğrudan **ODS** katmanında",
        "Replika veritabanı **Data Guard** ile besleniyor; gün içi raporlar replika ve ana "
        "veritabanından",
        "Gün içinde belirli saatlerde çalışan ETL'lerle DWH'a anlık veri yazılan durumlar var",
    ]),
    ("MERKEZİ KAYIT KURULUŞU (MKK)", "ETL ürünü: **Informatica PowerCenter**", NAVY, [
        "Geçmiş tarihli veri DWH'tan raporlanıyor; **ODS** katmanı var",
        "MicroStrategy raporlarının **%99'u** DWH üzerinden",
        "Anlık aktarımda replika aracı yok; veri **SQL script'leri** ve ETL aracıyla taşınıyor",
    ]),
]
PLACEHOLDER = RGBColor(0xB0, 0x3A, 0x2E)
for i, (name, tool, fill, pts) in enumerate(peers):
    x = Inches(0.55 + i * 6.2)
    box(s, x, Inches(1.15), Inches(6.0), Inches(0.75), fill=fill, text=[f"**{name}**", tool],
        size=14, color=WHITE)
    box(s, x, Inches(1.9), Inches(6.0), Inches(4.0), fill=LIGHT, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, x + Inches(0.12), Inches(1.98), Inches(5.8), Inches(0.35),
            "Bilinen yapı (Aralık 2024 görüşmesi)", size=13, color=NAVY, bold=True)
    bullets(s, x + Inches(0.08), Inches(2.28), Inches(5.85), Inches(1.75), pts, size=12.5, gap=3)
    textbox(s, x + Inches(0.12), Inches(4.05), Inches(5.8), Inches(0.35),
            "Ürün hakkındaki görüşleri (son görüşme)", size=13, color=NAVY, bold=True)
    box(s, x + Inches(0.12), Inches(4.4), Inches(5.76), Inches(1.38), fill=WHITE,
        line=PLACEHOLDER, text=["[Güçlü yanlar — görüşme notundan eklenecek]",
                                "[Zorluklar / dikkat edilecekler — eklenecek]",
                                "[Destek, lisans ve ekip deneyimi — eklenecek]"],
        size=12, color=PLACEHOLDER, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)
box(s, Inches(0.55), Inches(6.0), Inches(12.2), Inches(0.48), fill=RGBColor(0xFD, 0xF3, 0xE4),
    line=GOLD, text="**Değerlendirmeye girdi:** Borsa İstanbul'un ODI deneyimi B seçeneği için "
    "grup içi referans; MKK'nın Informatica deneyimi, değerlendirmede önerilmeyen ürün için "
    "saha görüşü", size=12, align=PP_ALIGN.LEFT)

# 14e — ETL: iki seçenek
s = content_slide("ETL ARACI DEĞERLENDİRMESİ: İKİ SEÇENEK", pill="Değerlendirme sürüyor",
                  pill_fill=TEAL, sources=f"{ETL_SRC} (Executive Summary, Risks)")
options = [
    ("A — dbt Core (Exadata üzerinde)", "Teslim hızı, maliyet, taşınabilirlik", NAVY, [
        "**Güçlü:** SQL öncelikli, ekip bilgisi doğrudan kullanılır, öğrenme eğrisi kısa",
        "Git'te düz SQL / YAML: yerel LLM ile üretim, dokümantasyon ve inceleme; yerleşik "
        "test ve doküman",
        "Tüm işlem Exadata içinde; lisans yok, en düşük maliyet ve dönüşüm eforu; "
        "PostgreSQL'e dbt-postgres ile taşınabilir",
        "**Zayıf:** dbt Core için üretici desteği yok; erişim kontrolü ve görevler ayrılığı "
        "aracın çevresinde kurulur",
        "Kendi veri çekme / akış yeteneği yok (GoldenGate, external table); PL/SQL prosedürleri "
        "yeniden yazılana kadar model akışının dışında koşar",
    ], "**Ön koşul:** Bilgi Güvenliği ve İç Denetim'in, Türkiye'deki dbt destek firmasıyla "
       "SLA'lı sözleşmeli destek modelini BDDK dış hizmet düzenlemesi kapsamında kabul etmesi"),
    ("B — ODI 14c (Exadata üzerinde)", "Düzenleyici rahatlık, üretici desteği", TEAL, [
        "**Güçlü:** üretici desteği ve SLA; en güçlü erişim kontrolü, denetim izi ve HA/DR",
        "Exadata'ya yerel pushdown ve GoldenGate ile yerel entegrasyon",
        "PL/SQL raporlar ODI prosedürü / load plan adımı olarak değişmeden çalışır; Türk "
        "bankacılığında güçlü konum",
        "**Zayıf:** ULA dışında yeni lisans; depo tabanlı GUI geliştirme yerel LLM ve "
        "Git / CI kullanımını sınırlar",
        "Öğrenme eğrisi daha dik; EDW PostgreSQL'e taşınırsa yatırımın çoğu değer kaybeder",
    ], "**Ön koşul:** Oracle'dan lisans konusunda yazılı görüş (Exadata çekirdek sayımı) ve "
       "EDW'nin Oracle'da kalacağı beklentisi"),
]
for i, (title, sub, fill, pts, pre) in enumerate(options):
    x = Inches(0.55 + i * 6.2)
    box(s, x, Inches(1.15), Inches(6.0), Inches(0.72), fill=fill, text=[f"**{title}**", sub],
        size=14, color=WHITE)
    box(s, x, Inches(1.87), Inches(6.0), Inches(3.05), fill=LIGHT, shape=MSO_SHAPE.RECTANGLE)
    bullets(s, x + Inches(0.08), Inches(1.9), Inches(5.85), Inches(3.0), pts, size=13.5, gap=6)
    box(s, x, Inches(4.98), Inches(6.0), Inches(0.72), fill=WHITE, line=fill, text=pre,
        size=12, align=PP_ALIGN.LEFT)
box(s, Inches(0.55), Inches(5.82), Inches(12.2), Inches(0.62), fill=RGBColor(0xFD, 0xF3, 0xE4),
    line=GOLD, text="**Seçimden önce netleşecekler:** A için BDDK dış hizmet uygunluğu · B için "
    "ODI lisans pozisyonu · PL/SQL rapor envanteri ve ölçülmüş dönüşüm eforu · PostgreSQL'e "
    "geçiş olasılığı · Oracle dışı kaynaklar için GoldenGate ek paketi fiyatı",
    size=12, align=PP_ALIGN.LEFT)

# 15 — Pilot önerisi
s = content_slide("PİLOT ÖNERİSİ", pill="Öneri — puanlama bekliyor",
                  sources="DWH Sunum Temmuz 2025 (slayt 10–24); Proje Planı (Pilot seçimi); "
                  "Başlangıç Yaklaşımı (Faz 1, Faz 2); Takasbank Genel Bilgilendirme 2 (üye-dosya)")
cards = [
    ("PİLOT A — SWIFT YASAL RAPORLAR", "Platform temelini kanıtlar", [
        "Tek kaynak şema, **T-1 yeterli**; net düzenleyici tüketici",
        "~2 milyar satır / 170 GB; mesaj başına tek satır özetle **~24 milyon satır**",
        "Ortak üye/piyasa modeli gerektirmez; modelleme tartışmasına girmeden tesisatı kanıtlar",
        "Kanıtlar: ODS_ beslemesi, SCN-tutarlı çıkarım, replay, zamanlayıcı zinciri, PUB snapshot, "
        "erişim ve audit (serbest alanda kimlik no)",
    ]),
    ("PİLOT B — BISTECH SPK 13 RAPOR", "Entegrasyonu kanıtlar", [
        "İki kaynak: KALE NOMX + Replica BIDB (5 + 7 + 1 rapor); gün sonu sinyaline bağlı",
        "İlk **kurumsal core** paketi: taraf, üyelik, hesap, araç, piyasa × hizmet, takvim, "
        "versiyonlu takas kuralı",
        "DB_ARSIV view + dblink erişimini sürümlü PUB katmanıyla değiştirir",
        "İlk MSTR yıldız şeması",
    ]),
]
for i, (title, sub, pts) in enumerate(cards):
    x = Inches(0.6 + i * 6.15)
    box(s, x, Inches(1.2), Inches(5.95), Inches(0.75), fill=NAVY, text=[f"**{title}**", sub],
        size=14, color=WHITE)
    box(s, x, Inches(1.95), Inches(5.95), Inches(2.9), fill=LIGHT, shape=MSO_SHAPE.RECTANGLE)
    bullets(s, x + Inches(0.1), Inches(2.0), Inches(5.75), Inches(2.85), pts, size=13.5, gap=4)
box(s, Inches(0.6), Inches(5.0), Inches(5.95), Inches(1.1), fill=RGBColor(0xFD, 0xF3, 0xE4),
    line=GOLD, text=["**Hemen başlanacak:** BIST fon sözleşme verisinin ham olarak ODS_'e "
                     "alınması — 9 milyon kayıt/gün, kaynakta 5 gün sonra siliniyor"],
    size=13, align=PP_ALIGN.LEFT)
box(s, Inches(6.75), Inches(5.0), Inches(5.95), Inches(1.1), fill=WHITE, line=LINE,
    text=["**Sonraki dilimler (Faz 4):** Fon işlem defterleri (Verda teslimatı) ve Fon "
          "Bilgilendirme Platformu (gün içi düzeltme, 10 yıllık CSV/web servis)"],
    size=13, align=PP_ALIGN.LEFT)
footnote(s, "Pilot, ETL aracı seçildikten sonra başlar. Kesin değildir: üye-dosya projesi dahil "
            "adaylar iş değeri, hazır olma, mutabakat referansı, SLA ve 6–12 haftada teslim "
            "edilebilirlikle 1–5 arası puanlanacak.", y=6.3)

# 16 — Yol haritası
s = content_slide("YOL HARİTASI", pill="Öneri — onay bekliyor",
                  sources="Başlangıç Yaklaşımı (Fazlar); Proje Planı (Faz 0–5, Definition of Done)")
phases = [
    ("FAZ 0", "Keşif ve karar kapıları", "İlk 30 gün: mandat, ölçüm, rapor envanteri, GoldenGate "
     "/ ODS_ planı, gün sonu sinyali, ETL aracı değerlendirmesinin sonuçlanması",
     "**ETL aracı seçimi**, rapor envanteri, puanlı pilot listesi, yerleşim testi"),
    ("FAZ 1", "Pilot A: platform temeli", "CTL/ODS_, SCN-tutarlı çıkarım, replay, PUB, güvenlik",
     "Ölçülmüş KALE yük azalması, paralel koşum onayı, runbook"),
    ("FAZ 2", "Pilot B: entegrasyon", "İlk CORE paketi, UG gün sonu prosedürlerinin DWH'a "
     "taşınması, ilk MSTR yıldızı", "CORE paketi ve MSTR yıldızının paralel koşum kabulü"),
    ("FAZ 3", "Operasyonel rapor göçü", "Raporların ODS_ / DWH / kaynakta kalır olarak "
     "yerleştirilmesi; Team Developer kullanıma göre emeklilik", "Rapor bazında kabul"),
    ("FAZ 4", "Konu alanı yayılımı", "Fon platformları, risk/teminat/MKT, ödeme, saklama, "
     "enerji, çek/kredi, ücretler", "Her dilimde core'un tekrar kullanımı"),
    ("FAZ 5", "Kritik ve yasal raporlar", "As-reported / as-corrected sürümler, paralel koşum",
     "Düzenleyici/iş sahibi yazılı kabulü"),
]
pw = Inches(2.03)
for i, (code, name, work, gate) in enumerate(phases):
    x = Inches(0.55) + (pw + Inches(0.03)) * i
    box(s, x, Inches(1.25), pw, Inches(0.9), fill=GOLD if i == 0 else NAVY,
        shape=MSO_SHAPE.CHEVRON if i else MSO_SHAPE.PENTAGON, text=[f"**{code}**"], size=16,
        color=WHITE)
    textbox(s, x + Inches(0.05), Inches(2.3), pw - Inches(0.1), Inches(0.65), name, size=14.5,
            color=NAVY, bold=True)
    box(s, x + Inches(0.05), Inches(2.95), pw - Inches(0.15), Inches(1.75), fill=LIGHT, text=work,
        size=12, anchor=MSO_ANCHOR.TOP, align=PP_ALIGN.LEFT, shape=MSO_SHAPE.RECTANGLE)
    textbox(s, x + Inches(0.05), Inches(4.8), pw - Inches(0.1), Inches(0.3), "Çıkış kapısı",
            size=11, color=RED, bold=True)
    textbox(s, x + Inches(0.05), Inches(5.08), pw - Inches(0.15), Inches(1.0), gate, size=12)
footnote(s, "Her faz dikey ilerler ve çalışan bir iş sonucu bırakır. Fazların takvimi Faz 0 "
            "çıktıları (envanter, ekip, erişim, satın alma) ile netleşecektir.", y=6.3)

# 17 — İlk 30 gün
s = content_slide("FAZ 0: İLK 30 GÜN", pill="Öneri — onay bekliyor",
                  sources="Proje Planı (Faz 0); Başlangıç Yaklaşımı (Faz 0); Aktif Sorular 12, 14, 15")
cols = [
    ("Mandat ve ölçüm", [
        "İsimli sponsor ve yönlendirme komitesi kadansı",
        "Konu alanı bazında “hangi sayı doğru” karar hakkı",
        "Birincil KPI: raporlamaya atfedilen **KALE DB-time** azalması ve gün sonu süresi",
        "4 haftalık AWR/ASH yük çalışması",
        "Loglardan rapor envanteri (Team Developer, web, MSTR)",
    ]),
    ("DBA ile doğrulama", [
        "Replika **Active Data Guard** lisanslı ve read-only açık mı?",
        "**GoldenGate** extract kaynağı: prod KALE mi, standby mı?",
        "UG gün sonu prosedürleri standby'da çalışabilir mi?",
        "SUR / HİSAR izolasyon testi planı",
    ]),
    ("İki hızlı kazanım", [
        "Mevcut **gün sonu log kaydı** DWH tetikleyicisi olarak bağlanır; iş tarihi, koşu "
        "kimliği, SCN içeriği doğrulanır",
        "**BIST fon sözleşme verisi** hemen ODS_'e (5 günlük saklama süresi nedeniyle)",
    ]),
    ("Ekip", [
        "1 veri modelleyici",
        "2 Oracle-güçlü veri mühendisi",
        "Dilim başına UG analisti, DBA irtibat kişisi",
        "MSTR geliştiricilerine boyutsal modelleme eğitimi",
    ]),
]
for i, (name, pts) in enumerate(cols):
    x = Inches(0.55 + i * 3.08)
    box(s, x, Inches(1.25), Inches(2.95), Inches(0.55), fill=GOLD if i == 2 else NAVY, text=name,
        size=15, color=WHITE, bold=True)
    box(s, x, Inches(1.8), Inches(2.95), Inches(4.3), fill=LIGHT, shape=MSO_SHAPE.RECTANGLE)
    bullets(s, x + Inches(0.05), Inches(1.85), Inches(2.85), Inches(4.2), pts, size=13, gap=5)
box(s, Inches(0.55), Inches(6.2), W - Inches(1.1), Inches(0.42), fill=WHITE, line=RED,
    text="**Çıkış kapısı:** rapor sahibi, pilot çıktısı, kaynak grain'i, otorite, SLA, hassasiyet ve "
         "mutabakat referansı belli olmadan fiziksel mart tasarımına başlanmaz.", size=12)

# 18 — Ekip ve danışmanlık
s = content_slide("EKİP VE DANIŞMANLIK MODELİ", sources="Proje Planı (Ekip); Başlangıç "
                  "Yaklaşımı; Komtaş Future-Ready Data Platform Teklifi Ağustos 2026; kullanıcı aktarımı "
                  "(02.11.2026, firma görüşmeleri); DWH Sunum "
                  "Aralık 2024 (Vakıfbank, çalışılması gereken yönler); DWH Ownership Operating Model")
textbox(s, Inches(0.6), Inches(1.15), Inches(6), Inches(0.4), "Ekip ve sahiplik", size=18,
        color=NAVY, bold=True)
bullets(s, Inches(0.6), Inches(1.5), Inches(5.9), Inches(4.9), [
    "Aralık 2024'te tespit edildiği gibi **DWH, ETL ve modelleme deneyimli personel** ihtiyacı "
    "hâlâ karşılanmadı",
    "Öneri: 1 veri modelleyici + 2 Oracle-güçlü veri mühendisi; dilim başına dönüşümlü UG analisti; "
    "DBA irtibat kişisi",
    "**UG analistleri modelleri birlikte sahiplenir** — Vakıfbank dersi: bilgi birikimi tek "
    "ekipte toplanmamalı",
    "Kod Git'te, operasyona teslim edilen runbook'larla; işletim sahibi baştan belli",
    "Sahiplik, karar yetkileri ve uyuşmazlık çözümü için işletim modeli taslağı hazır "
    "(kurum onayı bekliyor)",
], size=14.5)
textbox(s, Inches(6.85), Inches(1.15), Inches(6), Inches(0.4), "Danışman firmalar",
        size=18, color=NAVY, bold=True)
box(s, Inches(6.85), Inches(1.55), Inches(5.9), Inches(2.3), fill=LIGHT, radius=0.04)
bullets(s, Inches(6.9), Inches(1.58), Inches(5.8), Inches(2.25), [
    "**Eylül:** Ab Initio, Oredata, Cloudera, Dataspecta, GTech, Global Maksimum ile görüşüldü",
    "**Ekim:** Dataspecta ile workshop yapıldı",
    "**Komtaş teklifi (17.08.2026):** ~3 ay; mevcut durum, hedef mimari, kavramsal model, yol "
    "haritası ve **RFP**. Çıktısı dokümanlar; çalışan bir veri ürünü değil",
], size=13, gap=4)
box(s, Inches(6.85), Inches(4.0), Inches(5.9), Inches(2.2), fill=RGBColor(0xFD, 0xF3, 0xE4),
    line=GOLD, radius=0.04, text=[
        "**Öneri**",
        "Danışmanlık, pilotta ekiple birlikte inşa eden **sınırlı kapsamlı bir ortak** olarak "
        "konumlansın. Yalnızca kâğıt tasarım ve RFP üreten bir çalışma pilotu geciktirir; tasarım "
        "kararlarını pilot kanıtı versin.",
    ], size=13.5, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)

# 19 — Riskler
s = content_slide("RİSKLER", sources="Başlangıç Yaklaşımı (Risk kaydı); Firmalarla Yapılan DWH "
                  "Görüşmeleri (GoldenGate 7/24); Takasbank_ETL_Comparison.xlsx (Risks)")
table(s, Inches(0.55), Inches(1.2), W - Inches(1.1), [
    ["Risk", "Etki", "Önlem"],
    ["GoldenGate işletim yükü (7/24 ekip yok)", "ODS_ beslemesi durursa operasyonel raporlar etkilenir",
     "Lag izleme ve alarm, yeniden senkron prosedürü, DBA sahipliği; extract kaynağı redo etkisi "
     "ölçülerek seçilir"],
    ["Kişisel veri yoğunluğu (BES), serbest alanda kimlik no", "Gizlilik ve erişim riski",
     "ODS_ öncesi sınıflandırma, VPD/redaction, audit, non-prod maskeleme (TDM)"],
    ["T+1 takas geçişi", "Takas kuralları program ortasında değişir",
     "Pilot B'den itibaren versiyonlu takas kuralı"],
    ["Tarihsel veriye yerinde update", "Artımlı yüklemeler bozulur",
     "Önce profil; gerekli yerde bitemporal, aksi hâlde SCN snapshot"],
    ["Kısa kaynak saklama (fon sözleşmeleri 5 gün)", "Tarihçe kalıcı olarak kaybolur",
     "Faz 0'da hemen ODS_'e alma; kaynaktaki silme ODS_'e yansıtılmamalı"],
    ["Yetkinlik açığı, bilginin tek ekipte toplanması", "Sürdürülebilirlik",
     "UG ortak sahipliği, Git tabanlı kod, runbook, eğitim"],
    ["ETL aracı kararı ve satın alma süresi", "Pilot başlayamaz",
     "Değerlendirmenin takvimle kapatılması; pilot kapsamı ve kaynak erişimi paralel hazırlanır"],
    ["Satıcı biçimli tasarım (önce ODS, 100 konu alanı, yalnızca RFP)", "Gecikme, iş sonucu yok",
     "Kararları pilot kanıtı versin"],
], [4.3, 3.4, 4.53], size=13.5, header_size=14, row_h=0.6)

# 20 — Karar beklenen konular
s = content_slide("KARAR BEKLENEN KONULAR", pill="Yönlendirme komitesi",
                  sources="Başlangıç Yaklaşımı (İlk yönlendirme komitesine götürülecek kararlar)")
decs = [
    "Tek platform **Oracle/Exadata**; ayrı büyük veri platformu yok",
    "ODS kararının uygulanması: **GoldenGate** işletme sahipliği, **Borsa İstanbul** ile GG "
    "akışı, **tvsods** kapatma takvimi",
    "Gün içi operasyonel raporlamada **ODS_** şemaları ile **KALE standby** rol ayrımı",
    "DWH yerleşimi (SUR / HİSAR) **izolasyon testiyle** belirlenir",
    "**Pilot A = SWIFT**, **Pilot B = BISTECH SPK**; fon sözleşme verisi yakalaması şimdi başlar",
    "ETL aracı seçimi: **dbt Core** veya **ODI 14c**; PoC'ler tamamlandı, pilot karardan sonra "
    "başlar",
    "1 modelleyici + 2 veri mühendisi alınır; dilim başına **UG analist zamanı** ayrılır",
    "Mevcut **gün sonu log kaydı** ilk ay içinde DWH tetikleyicisi olarak doğrulanır",
]
for i, d in enumerate(decs):
    col, row = divmod(i, 4)
    x = Inches(0.6 + col * 6.15)
    y = Inches(1.3 + row * 1.25)
    box(s, x, y, Inches(0.65), Inches(0.65), fill=NAVY, text=str(i + 1), size=18, color=WHITE,
        bold=True, shape=MSO_SHAPE.OVAL)
    box(s, x + Inches(0.8), y - Inches(0.1), Inches(5.15), Inches(0.9), fill=LIGHT, text=d,
        size=15, align=PP_ALIGN.LEFT)

# 21 — Açık sorular
s = content_slide("AÇIK SORULAR", sources="Aktif Sorular (madde 1, 3, 4, 6, 7, 8, 14, 15, 16)")
box(s, Inches(0.6), Inches(1.2), Inches(5.9), Inches(0.5), fill=NAVY, text="DBA ve altyapı ile",
    size=16, color=WHITE, bold=True)
bullets(s, Inches(0.6), Inches(1.75), Inches(5.9), Inches(4.7), [
    "SUR'daki KALE replikası **Active Data Guard** lisanslı mı, read-only açık mı, apply "
    "gecikmesi ne kadar?",
    "**GoldenGate** extract prod KALE'den mi standby'dan mı; supplemental logging redo yükü ne?",
    "UG gün sonu prosedürleri standby üzerinde read-only çalışabilir mi; hangileri KALE'ye "
    "yazmak zorunda?",
    "Tarihçe DWH'a geçince KALE saklama penceresi ne olacak; ~3.000 backup tablosu ne zaman "
    "emekli edilecek?",
    "Borsa İstanbul ile GoldenGate akışı: hangi tablolar (Replica BIDB, fon sözleşmeleri)?",
    "DWH zamanlayıcısı ne olacak? (Automic lisans nedeniyle seçenek değil; diğer araçlar değerlendiriliyor)",
], size=16)
box(s, Inches(6.85), Inches(1.2), Inches(5.9), Inches(0.5), fill=NAVY,
    text="İş birimleri ve UG ile", size=16, color=WHITE, bold=True)
bullets(s, Inches(6.85), Inches(1.75), Inches(5.9), Inches(4.7), [
    "Kritik yasal raporlar (SPK, MASAK) DWH'dan mı verilecek; SLA'ları ve kesim saatleri ne?",
    "Hangi rapor ODS_'den, hangisi DWH mart'tan verilecek? (rapor envanteri)",
    "Mutabakatta otorite: farklı raporlar farklı sayı verirse hangisi doğru, kim karar verir?",
    "Hassas veri politikası: prod'da erişim kontrollü açık veri, non-prod'da maskeleme onaylanıyor mu?",
    "Tarihsel veriye hangi durumlarda update geliyor?",
], size=16)

# 22 — Kapanış
s = prs.slides.add_slide(BLANK)
box(s, 0, 0, W, H, fill=NAVY, shape=MSO_SHAPE.RECTANGLE)
box(s, Inches(5.67), Inches(1.6), Inches(2.0), Inches(1.9), fill=WHITE, radius=0.12)
textbox(s, Inches(5.67), Inches(2.3), Inches(2.0), Inches(0.5), "TAKAS", size=30, color=NAVY,
        bold=True, align=PP_ALIGN.CENTER)
textbox(s, Inches(5.67), Inches(2.8), Inches(2.0), Inches(0.4), "İSTANBUL", size=18, color=NAVY,
        bold=True, align=PP_ALIGN.CENTER)
textbox(s, Inches(1.5), Inches(4.3), W - Inches(3.0), Inches(1.0), "TEŞEKKÜRLER", size=40,
        color=WHITE, bold=True, align=PP_ALIGN.CENTER)
textbox(s, Inches(4.5), H - Inches(0.45), Inches(4.33), Inches(0.28),
        "Gizlilik Seviyesi: Kurum İçi", size=10, color=RGBColor(0xF5, 0xB7, 0xB1),
        align=PP_ALIGN.CENTER)

prs.save(OUT)
print(f"saved {OUT} ({len(prs.slides)} slides)")
