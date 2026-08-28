from PIL import Image

im = Image.open(r'C:\Users\00\Downloads\Hand-Drawn Logo with Trekking Hiker (1).png').convert('RGBA')
print('size', im.size)
alpha = im.split()[3]
bbox = alpha.getbbox()
print('bbox', bbox)
w, h = im.size
extrema_per_row = [alpha.crop((0, y, w, y + 1)).getextrema()[1] for y in range(h)]
row_has = [e > 10 for e in extrema_per_row]
rows = [y for y, v in enumerate(row_has) if v]
print('first row', rows[0], 'last row', rows[-1])
gaps = []
in_gap = False
gap_start = None
for y in range(rows[0], rows[-1] + 1):
    if not row_has[y]:
        if not in_gap:
            in_gap = True
            gap_start = y
    else:
        if in_gap:
            in_gap = False
            gaps.append((gap_start, y - 1))
print('gaps', gaps)
