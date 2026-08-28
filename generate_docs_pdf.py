import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.units import inch

def create_design_system_pdf(output_path):
    # Setup document with compact margins to fit beautifully on 1 page
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=32,
        bottomMargin=32
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette Colors
    c_primary = colors.HexColor('#F06225')
    c_dark_bg = colors.HexColor('#1B1E22')
    c_card_bg = colors.HexColor('#22252A')
    c_border = colors.HexColor('#2E3239')
    c_text_dark = colors.HexColor('#111827')
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_dark_bg,
        spaceAfter=2
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=c_primary,
        spaceAfter=10
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_dark_bg,
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#374151'),
        spaceAfter=6
    )
    
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#1F2937')
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#111827')
    )
    
    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []
    
    # Header Section
    story.append(Paragraph("VERTICAL ODYSSEY — HIMALAYAN EXPEDITIONS", title_style))
    story.append(Paragraph("OFFICIAL DESIGN SYSTEM & BRAND STYLE SPECIFICATION GUIDE", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=0, spaceAfter=8))
    
    story.append(Paragraph("<b>Overview:</b> Core design tokens, typography rules, and color palettes implemented across the Vertical Odyssey portal.", body_style))
    
    # 1. Typography Section
    story.append(Paragraph("1. Typography Specifications", h1_style))
    
    typo_data = [
        [Paragraph("Font Family", table_header), Paragraph("Applied Role", table_header), Paragraph("CSS Selector", table_header), Paragraph("Vibe & Character", table_header)],
        [
            Paragraph("<b>Oswald</b><br/><font color='#6B7280' size='6.5'>Google Fonts (300-700)</font>", table_cell),
            Paragraph("Primary Headings, Brand Logos, Big Numbers, Hero Text", table_cell),
            Paragraph("<font name='Courier'>font-heading<br/>font-display</font>", table_cell),
            Paragraph("Bold, condensed alpine mountaineering aesthetic", table_cell)
        ],
        [
            Paragraph("<b>IBM Plex Mono</b><br/><font color='#6B7280' size='6.5'>Google Fonts (300-600)</font>", table_cell),
            Paragraph("Body Text, Navigation Links, Badges, Altitude Metrics, Coordinates", table_cell),
            Paragraph("<font name='Courier'>font-mono<br/>body (default)</font>", table_cell),
            Paragraph("Technical, precision GPS datalog & telemetry feel", table_cell)
        ],
        [
            Paragraph("<b>Font Awesome 6</b><br/><font color='#6B7280' size='6.5'>Vector Icon CDN</font>", table_cell),
            Paragraph("UI Icons, Waypoint Arrows, Compass, Safety Badges", table_cell),
            Paragraph("<font name='Courier'>fa-solid, fa-regular</font>", table_cell),
            Paragraph("Clean vector mountaineering iconography", table_cell)
        ]
    ]
    
    t_typo = Table(typo_data, colWidths=[1.3*inch, 2.3*inch, 1.4*inch, 2.5*inch])
    t_typo.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_dark_bg),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')])
    ]))
    story.append(t_typo)
    story.append(Spacer(1, 6))
    
    # 2. Color Palette (Dark Mode - Primary)
    story.append(Paragraph("2. Color System (Default Dark Mode — Alpine Slate)", h1_style))
    
    color_dark_data = [
        [Paragraph("Token Role", table_header), Paragraph("Hex Code", table_header), Paragraph("Color Name / Swatch", table_header), Paragraph("Usage & Target UI Elements", table_header)],
        [
            Paragraph("<b>Accent (Primary)</b>", table_cell_bold),
            Paragraph("<font name='Courier' color='#F06225'><b>#F06225</b></font>", table_cell),
            Paragraph("<font color='#F06225'>■</font> Summit Orange", table_cell),
            Paragraph("CTA Buttons, active menu links, highlight badges, custom scrollbar", table_cell)
        ],
        [
            Paragraph("<b>Accent Hover</b>", table_cell_bold),
            Paragraph("<font name='Courier' color='#D04E1B'><b>#D04E1B</b></font>", table_cell),
            Paragraph("<font color='#D04E1B'>■</font> Deep Burnt Amber", table_cell),
            Paragraph("Hover & active focus states for buttons & interactive items", table_cell)
        ],
        [
            Paragraph("<b>Background (Main)</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#1B1E22</b></font>", table_cell),
            Paragraph("<font color='#1B1E22'>■</font> Dark Slate / Carbon", table_cell),
            Paragraph("Main application & page background canvas", table_cell)
        ],
        [
            Paragraph("<b>Surface / Card</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#22252A</b></font>", table_cell),
            Paragraph("<font color='#22252A'>■</font> Slate Graphite", table_cell),
            Paragraph("Expedition cards, container backgrounds, popups & modals", table_cell)
        ],
        [
            Paragraph("<b>Header / Dark</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#16181B</b></font>", table_cell),
            Paragraph("<font color='#16181B'>■</font> Midnight Obsidian", table_cell),
            Paragraph("Top navigation backdrop with blur filter, footer base", table_cell)
        ],
        [
            Paragraph("<b>Border / Divider</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#2E3239</b></font>", table_cell),
            Paragraph("<font color='#2E3239'>■</font> Steel Outline", table_cell),
            Paragraph("Card border strokes, separator dividers, table borders", table_cell)
        ],
        [
            Paragraph("<b>Foreground Text</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#F3F4F6</b></font>", table_cell),
            Paragraph("<font color='#9CA3AF'>■</font> Ice White / Off-White", table_cell),
            Paragraph("High-contrast primary body text, titles, hero copy", table_cell)
        ],
        [
            Paragraph("<b>Muted Text</b>", table_cell_bold),
            Paragraph("<font name='Courier'><b>#9CA3AF</b></font>", table_cell),
            Paragraph("<font color='#9CA3AF'>■</font> Cool Grey", table_cell),
            Paragraph("Metadata, descriptions, coordinates, secondary subtitles", table_cell)
        ]
    ]
    
    t_colors = Table(color_dark_data, colWidths=[1.4*inch, 1.1*inch, 1.7*inch, 3.3*inch])
    t_colors.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_dark_bg),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')])
    ]))
    story.append(t_colors)
    story.append(Spacer(1, 6))
    
    # 3. Light Mode Theme
    story.append(Paragraph("3. Color System (Light Mode Variant)", h1_style))
    
    color_light_data = [
        [Paragraph("Token", table_header), Paragraph("Hex Code", table_header), Paragraph("Role & Application", table_header)],
        [Paragraph("<b>Background</b>", table_cell_bold), Paragraph("<font name='Courier'><b>#F9FAFB</b></font>", table_cell), Paragraph("Crisp snow white background canvas", table_cell)],
        [Paragraph("<b>Foreground</b>", table_cell_bold), Paragraph("<font name='Courier'><b>#111827</b></font>", table_cell), Paragraph("Deep charcoal / near-black high-contrast text", table_cell)],
        [Paragraph("<b>Card / Surface</b>", table_cell_bold), Paragraph("<font name='Courier'><b>#FFFFFF</b></font>", table_cell), Paragraph("Pure white card containers with subtle drop shadow", table_cell)],
        [Paragraph("<b>Border</b>", table_cell_bold), Paragraph("<font name='Courier'><b>#E5E7EB</b></font>", table_cell), Paragraph("Clean soft grey outline", table_cell)],
        [Paragraph("<b>Accent</b>", table_cell_bold), Paragraph("<font name='Courier' color='#E04F1A'><b>#E04F1A</b></font>", table_cell), Paragraph("High-contrast alpine orange for light backgrounds", table_cell)],
        [Paragraph("<b>Muted Text</b>", table_cell_bold), Paragraph("<font name='Courier'><b>#4B5563</b></font>", table_cell), Paragraph("Balanced slate grey for metadata and secondary labels", table_cell)]
    ]
    
    t_light = Table(color_light_data, colWidths=[1.4*inch, 1.1*inch, 5.0*inch])
    t_light.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_dark_bg),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')])
    ]))
    story.append(t_light)
    
    # Footer notice
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#D1D5DB'), spaceBefore=8, spaceAfter=4))
    footer_text = Paragraph("<font color='#6B7280' size='7'>Generated for Vertical Odyssey / Himalayan Magic Adventure • Local Dev Server: http://localhost:8000 • Design Specification Sheet</font>", styles['Normal'])
    story.append(footer_text)
    
    doc.build(story)
    print(f"Single-page PDF generated successfully at {output_path}")

if __name__ == "__main__":
    public_pdf = r"c:\Users\00\Desktop\HimalayN_\public\Vertical_Odyssey_Design_System.pdf"
    root_pdf = r"c:\Users\00\Desktop\HimalayN_\Vertical_Odyssey_Design_System.pdf"
    create_design_system_pdf(public_pdf)
    create_design_system_pdf(root_pdf)
