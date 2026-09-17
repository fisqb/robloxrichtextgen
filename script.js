document.addEventListener('DOMContentLoaded', function () {
    const ALL_FONTS = [
        'Legacy', 'Arial', 'ArialBold', 'SourceSans', 'SourceSansBold',
        'SourceSansLight', 'SourceSansItalic', 'Bodoni', 'Garamond',
        'Cartoon', 'Code', 'Highway', 'SciFi', 'Arcade', 'Fantasy',
        'Antique', 'SourceSansSemibold', 'Gotham', 'GothamMedium',
        'GothamBold', 'GothamBlack', 'AmaticSC', 'Bangers', 'Creepster',
        'DenkOne', 'Fondamento', 'FredokaOne', 'GrenzeGotisch',
        'IndieFlower', 'JosefinSans', 'Jura', 'Kalam', 'LuckiestGuy',
        'Merriweather', 'Michroma', 'Nunito', 'Oswald', 'PatrickHand',
        'PermanentMarker', 'Roboto', 'RobotoCondensed', 'RobotoMono',
        'Sarpanch', 'SpecialElite', 'TitilliumWeb', 'Ubuntu',
        'BuilderSans', 'BuilderSansMedium', 'BuilderSansBold',
        'BuilderSansExtraBold', 'Arimo', 'ArimoBold'
    ].sort();

    const $ = id => document.getElementById(id);
    const elements = {
        textInput: $('textInput'),
        userId: $('userId'),
        colorMode: $('colorMode'),
        modeControls: $('modeControls'),
        colorSource: $('colorSource'),
        outputFormat: $('outputFormat'),
        solidControls: $('solidControls'),
        gradientControls: $('gradientControls'),
        textColor: $('textColor'),
        textColorHex: $('textColorHex'),
        gradientColor1: $('gradientColor1'),
        gradientColor1Hex: $('gradientColor1Hex'),
        gradientColor2: $('gradientColor2'),
        gradientColor2Hex: $('gradientColor2Hex'),
        gradientType: $('gradientType'),
        gradientSteps: $('gradientSteps'),
        gradientStepsValue: $('gradientStepsValue'),
        transparency: $('transparency'),
        transparencyValue: $('transparencyValue'),
        bold: $('bold'),
        italic: $('italic'),
        underline: $('underline'),
        strikethrough: $('strikethrough'),
        lineBreaks: $('lineBreaks'),
        fixColors: $('fixColors'),
        strokeColor: $('strokeColor'),
        strokeColorHex: $('strokeColorHex'),
        strokeThickness: $('strokeThickness'),
        strokeThicknessValue: $('strokeThicknessValue'),
        fontFamily: $('fontFamily'),
        preview: $('preview'),
        outputCode: $('outputCode'),
        outputDefaultio: $('outputDefaultio'),
        outputDefaultioSection: $('outputDefaultioSection'),
        outputJson: $('outputJson'),
        charEditor: $('charEditor'),
        charEditorTitle: $('charEditorTitle'),
        charEditorClose: $('charEditorClose'),
        charColor: $('charColor'),
        charColorHex: $('charColorHex'),
        charTransparency: $('charTransparency'),
        charApply: $('charApply'),
        charReset: $('charReset'),
        charResetAll: $('charResetAll'),
        pointsEditor: $('pointsEditor'),
        pointsEditorTitle: $('pointsEditorTitle'),
        pointColor: $('pointColor'),
        pointColorHex: $('pointColorHex'),
        pointTransparency: $('pointTransparency'),
        pointApply: $('pointApply'),
        pointDelete: $('pointDelete'),
        pointsResetAll: $('pointsResetAll'),
        helpBtn: $('helpBtn'),
        helpOverlay: $('helpOverlay'),
        helpClose: $('helpClose'),
        defaultioControls: $('defaultioControls'),
        defaultioGroupingGroup: $('defaultioGroupingGroup'),
        defaultioStepTimeGroup: $('defaultioStepTimeGroup'),
        defaultioStepFreqGroup: $('defaultioStepFreqGroup'),
        defaultioStyleTimeGroup: $('defaultioStyleTimeGroup'),
        animateStyle: $('animateStyle'),
        animateGrouping: $('animateGrouping'),
        animateStepTime: $('animateStepTime'),
        animateStepTimeValue: $('animateStepTimeValue'),
        animateStepFrequency: $('animateStepFrequency'),
        animateStyleTime: $('animateStyleTime'),
        animateStyleTimeValue: $('animateStyleTimeValue')
    };

    ALL_FONTS.forEach(font => {
        const option = new Option(font, font);
        elements.fontFamily.add(option);
    });
    elements.fontFamily.value = 'SpecialElite';

    let charColors = {};
    let charTransparency = {};
    let selectedChars = new Set();

    let gradientPoints = {};
    let gradientPointTransparency = {};
    let selectedPoint = null;

    const isValidHex = hex => /^#[0-9A-F]{6}$/i.test(hex);
    const isValidTransparency = v => v !== '' && !isNaN(v) && Number(v) >= 0 && Number(v) <= 1;
    const roundTransparency = (t) => Math.round(Number(t) * 10) / 10;

    const TRANSPARENCY_MERGE_THRESHOLD = 0.1;
    const transAreSimilar = (a, b) => {
        const an = (a === null || a === undefined);
        const bn = (b === null || b === undefined);
        if (an && bn) return true;
        if (an || bn) return false;
        return Math.abs(a - b) <= TRANSPARENCY_MERGE_THRESHOLD;
    };

    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHex = (r, g, b) => '#' + [r, g, b]
        .map(x => Math.round(x).toString(16).padStart(2, '0')).join('');

    const lerp = (a, b, t) => a + (b - a) * t;

    const lerpColor = (c1, c2, t) => ({
        r: lerp(c1.r, c2.r, t),
        g: lerp(c1.g, c2.g, t),
        b: lerp(c1.b, c2.b, t)
    });

    const hsvToRgb = (h, s, v) => {
        h /= 360;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        const [r, g, b] = [
            [v, t, p], [q, v, p], [p, v, t],
            [p, q, v], [t, p, v], [v, p, q]
        ][i % 6];
        return { r: r * 255, g: g * 255, b: b * 255 };
    };

    const generateGradientColors = (color1Hex, color2Hex, steps, type) => {
        const c1 = hexToRgb(color1Hex);
        const c2 = hexToRgb(color2Hex);
        if (!c1 || !c2) return [];

        return Array.from({ length: steps }, (_, i) => {
            const t = steps === 1 ? 0 : i / (steps - 1);
            if (type === 'rainbow') {
                const rgb = hsvToRgb(t * 360, 1, 1);
                return rgbToHex(rgb.r, rgb.g, rgb.b);
            }
            const mixed = lerpColor(c1, c2, t);
            return rgbToHex(mixed.r, mixed.g, mixed.b);
        });
    };

    const applyFormatting = (text, { bold, italic, underline, strikethrough }) => {
        if (strikethrough) text = `<s>${text}</s>`;
        if (underline) text = `<u>${text}</u>`;
        if (italic) text = `<i>${text}</i>`;
        if (bold) text = `<b>${text}</b>`;
        return text;
    };

    const hexToDefaultioColor = (hex) => {
        const c = hexToRgb(hex);
        if (!c) return '255,255,255';
        return `${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)}`;
    };

    function getSortedPointIndexes() {
        return Object.keys(gradientPoints).map(Number).sort((a, b) => a - b);
    }

    function getPointColorForIndex(index) {
        const points = getSortedPointIndexes();
        if (points.length === 0) return null;
        if (points.length === 1) return gradientPoints[points[0]];

        if (index <= points[0]) return gradientPoints[points[0]];
        if (index >= points[points.length - 1]) return gradientPoints[points[points.length - 1]];

        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            if (index >= a && index <= b) {
                const t = (index - a) / (b - a);
                const c1 = hexToRgb(gradientPoints[a]);
                const c2 = hexToRgb(gradientPoints[b]);
                if (!c1 || !c2) return gradientPoints[a];
                const mixed = lerpColor(c1, c2, t);
                return rgbToHex(mixed.r, mixed.g, mixed.b);
            }
        }
        return gradientPoints[points[0]];
    }

    function getPointTransparencyForIndex(index) {
        const points = getSortedPointIndexes();
        if (points.length === 0) return null;

        const valueAt = (i) => gradientPointTransparency[i] !== undefined
            ? gradientPointTransparency[i]
            : null;

        if (points.length === 1) return valueAt(points[0]);

        if (index <= points[0]) return valueAt(points[0]);
        if (index >= points[points.length - 1]) return valueAt(points[points.length - 1]);

        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            if (index >= a && index <= b) {
                const ta = valueAt(a);
                const tb = valueAt(b);
                if (ta === null && tb === null) return null;
                if (ta === null) return tb;
                if (tb === null) return ta;
                const t = (index - a) / (b - a);
                return lerp(ta, tb, t);
            }
        }
        return valueAt(points[0]);
    }

    function buildCharCells(rawText, enableLineBreaks) {
        const cells = [];
        let index = 0;
        for (let i = 0; i < rawText.length; i++) {
            const ch = rawText[i];
            if (ch === '\n') {
                if (enableLineBreaks) {
                    cells.push({ char: '\n', index, isBreak: true, original: '\n' });
                } else {
                    cells.push({ char: ' ', index, isBreak: false, original: '\n' });
                }
            } else {
                cells.push({ char: ch, index, isBreak: false, original: ch });
            }
            index++;
        }
        return cells;
    }

    function makeGradientIndexer(rawText, gradientColors) {
        const total = rawText.length;
        const steps = gradientColors.length;
        if (steps === 0 || total === 0) return () => null;
        return (i) => {
            if (total === 1) return gradientColors[0];
            const stepIndex = Math.min(
                Math.floor((i / total) * steps),
                steps - 1
            );
            return gradientColors[stepIndex];
        };
    }

    function colorForIndexFactory(rawText, options) {
        const { mode, solidColor, gradientColors, usePoints } = options;

        const gradientIndexer = (mode === 'gradient' && gradientColors.length)
            ? makeGradientIndexer(rawText, gradientColors)
            : null;

        return (i) => {
            const custom = charColors[i];
            if (custom) return custom;

            if (usePoints) {
                const pc = getPointColorForIndex(i);
                if (pc) return pc;
            }

            if (mode === 'solid') return solidColor;

            if (gradientIndexer) return gradientIndexer(i);

            return null;
        };
    }

    function transparencyForIndex(i, globalTrans, usePoints) {
        const custom = charTransparency[i];
        if (custom !== undefined) return custom;

        if (usePoints) {
            const pt = getPointTransparencyForIndex(i);
            if (pt !== null) return pt;
        }

        return globalTrans;
    }

    function renderPreview(rawText, enableLineBreaks, opts) {
        const frag = document.createDocumentFragment();
        const cells = buildCharCells(rawText, enableLineBreaks);
        const colorFn = opts.colorFn;
        const globalTrans = opts.trans;
        const usePoints = opts.usePoints;

        const spanByIndex = {};
        cells.forEach(cell => {
            if (cell.isBreak) {
                frag.appendChild(document.createElement('br'));
                return;
            }
            const span = document.createElement('span');
            span.className = 'char';
            span.dataset.index = cell.index;

            const textSpan = document.createElement('span');
            textSpan.className = 'char-text';
            textSpan.textContent = cell.char === ' ' ? '\u00A0' : cell.char;
            if (cell.char === ' ') textSpan.style.whiteSpace = 'pre';

            const color = colorFn(cell.index);
            if (color) textSpan.style.color = color;

            const t = transparencyForIndex(cell.index, globalTrans, usePoints);
            if (t > 0) textSpan.style.opacity = String(1 - t);

            span.appendChild(textSpan);

            if (charColors[cell.index]) span.classList.add('has-color');

            if (selectedChars.has(cell.index)) span.classList.add('selected');
            if (selectedPoint === cell.index) span.classList.add('selected-point');

            spanByIndex[cell.index] = span;
            frag.appendChild(span);
        });

        const p = elements.preview;
        p.innerHTML = '';
        p.appendChild(frag);
        p.style.fontFamily = opts.font;
        p.style.fontWeight = opts.bold ? 'bold' : 'normal';
        p.style.fontStyle = opts.italic ? 'italic' : 'normal';
        p.style.textDecoration = opts.underline ? 'underline'
            : opts.strikethrough ? 'line-through' : 'none';

        p.classList.toggle('points-mode', usePoints);

        const wrap = p.parentElement;
        if (wrap) {
            wrap.querySelectorAll('.point-marker').forEach(m => m.remove());
            if (usePoints) {
                const wrapRect = wrap.getBoundingClientRect();
                Object.keys(gradientPoints).map(Number).sort((a, b) => a - b).forEach(idx => {
                    const span = spanByIndex[idx];
                    if (!span) return;
                    const spanRect = span.getBoundingClientRect();
                    const marker = document.createElement('div');
                    marker.className = 'point-marker';
                    if (selectedPoint === idx) marker.classList.add('selected');
                    marker.style.background = gradientPoints[idx];
                    marker.style.left = (spanRect.left - wrapRect.left + spanRect.width / 2) + 'px';
                    marker.style.top = (spanRect.top - wrapRect.top - 8) + 'px';
                    wrap.appendChild(marker);
                });
            }
        }
    }

    let isMouseDown = false;
    let dragMode = null;

    function setSelection(indexes) {
        selectedChars = new Set(indexes);
        elements.preview.querySelectorAll('.char').forEach(el => {
            el.classList.toggle('selected', selectedChars.has(Number(el.dataset.index)));
        });
        updateCharEditor();
    }

    function setSelectedPoint(index) {
        selectedPoint = index;
        updatePointsEditor();
        elements.preview.querySelectorAll('.char').forEach(el => {
            el.classList.toggle('selected-point', Number(el.dataset.index) === selectedPoint);
        });
        document.querySelectorAll('.point-marker').forEach(m => m.classList.remove('selected'));
    }

    function updateCharEditor() {
        if (selectedChars.size === 0) {
            elements.charEditor.classList.add('hidden');
            return;
        }
        elements.charEditor.classList.remove('hidden');

        const arr = [...selectedChars].sort((a, b) => a - b);
        const raw = elements.textInput.value;
        const chars = arr.map(i => raw[i] === '\n' ? '⏎' : raw[i]).join('');
        const preview = chars.length > 20 ? chars.slice(0, 20) + '…' : chars;
        elements.charEditorTitle.textContent =
            arr.length === 1
                ? `Character: "${raw[arr[0]] === '\n' ? '⏎' : raw[arr[0]] || ''}"`
                : `Selected: ${arr.length} (${preview})`;

        const colors = new Set(arr.map(i => charColors[i] || null));
        if (colors.size === 1) {
            const c = [...colors][0];
            if (c) {
                elements.charColor.value = c;
                elements.charColorHex.value = c;
            }
        }

        const transps = new Set(arr.map(i =>
            charTransparency[i] !== undefined
                ? String(roundTransparency(charTransparency[i]))
                : ''
        ));
        if (transps.size === 1) {
            elements.charTransparency.value = [...transps][0] || '';
        } else {
            elements.charTransparency.value = '';
        }
    }

    function updatePointsEditor() {
        const isPointsMode = elements.colorSource.value === 'points';
        if (!isPointsMode) {
            elements.pointsEditor.classList.add('hidden');
            return;
        }
        elements.pointsEditor.classList.remove('hidden');

        if (selectedPoint === null || gradientPoints[selectedPoint] === undefined) {
            const count = Object.keys(gradientPoints).length;
            elements.pointsEditorTitle.textContent = count > 0
                ? `Gradient Points (${count})`
                : 'Gradient Points';
            elements.pointTransparency.value = '';
            return;
        }

        const raw = elements.textInput.value;
        const ch = raw[selectedPoint] === '\n' ? '⏎' : (raw[selectedPoint] || '');
        elements.pointsEditorTitle.textContent = `Point at "${ch}" (index ${selectedPoint})`;
        const c = gradientPoints[selectedPoint];
        elements.pointColor.value = c;
        elements.pointColorHex.value = c;

        const t = gradientPointTransparency[selectedPoint];
        elements.pointTransparency.value = (t !== undefined) ? String(roundTransparency(t)) : '';
    }

    function handlePointClick(index) {
        const raw = elements.textInput.value;
        if (raw[index] === '\n') return;

        if (gradientPoints[index] !== undefined) {
            setSelectedPoint(index);
        } else {
            const color = isValidHex(elements.pointColorHex.value)
                ? elements.pointColorHex.value
                : elements.pointColor.value;
            gradientPoints[index] = color;
            setSelectedPoint(index);
        }
        generate();
    }

    elements.preview.addEventListener('mousedown', e => {
        const el = e.target.closest('.char');
        if (!el) return;
        const idx = Number(el.dataset.index);

        if (elements.colorSource.value === 'points') {
            handlePointClick(idx);
            e.preventDefault();
            return;
        }

        isMouseDown = true;
        dragMode = selectedChars.has(idx) ? 'remove' : 'add';
        if (dragMode === 'add') setSelection([...selectedChars, idx]);
        else {
            const s = new Set(selectedChars);
            s.delete(idx);
            setSelection([...s]);
        }
        e.preventDefault();
    });

    elements.preview.addEventListener('mouseover', e => {
        if (!isMouseDown) return;
        if (elements.colorSource.value === 'points') return;
        const el = e.target.closest('.char');
        if (!el) return;
        const idx = Number(el.dataset.index);
        if (dragMode === 'add') {
            if (!selectedChars.has(idx)) setSelection([...selectedChars, idx]);
        } else {
            if (selectedChars.has(idx)) {
                const s = new Set(selectedChars);
                s.delete(idx);
                setSelection([...s]);
            }
        }
    });

    document.addEventListener('mouseup', () => { isMouseDown = false; dragMode = null; });

    elements.preview.addEventListener('touchstart', e => {
        const el = e.target.closest('.char');
        if (!el) return;
        const idx = Number(el.dataset.index);

        if (elements.colorSource.value === 'points') {
            handlePointClick(idx);
            e.preventDefault();
            return;
        }

        if (selectedChars.has(idx)) {
            const s = new Set(selectedChars);
            s.delete(idx);
            setSelection([...s]);
        } else {
            setSelection([...selectedChars, idx]);
        }
        e.preventDefault();
    }, { passive: false });

    function syncCharColorInputs(picker, hex) {
        picker.addEventListener('input', () => { hex.value = picker.value; });
        hex.addEventListener('input', () => {
            if (isValidHex(hex.value)) picker.value = hex.value;
        });
    }
    syncCharColorInputs(elements.charColor, elements.charColorHex);
    syncCharColorInputs(elements.pointColor, elements.pointColorHex);

    elements.charApply.addEventListener('click', () => {
        if (selectedChars.size === 0) return;

        const color = isValidHex(elements.charColorHex.value)
            ? elements.charColorHex.value
            : elements.charColor.value;

        const transRaw = elements.charTransparency.value.trim();
        const hasTrans = transRaw !== '';

        if (!hasTrans) {
            selectedChars.forEach(i => { charColors[i] = color; });
        } else if (isValidTransparency(transRaw)) {
            const t = Number(transRaw);
            selectedChars.forEach(i => {
                charColors[i] = color;
                charTransparency[i] = t;
            });
        } else {
            return;
        }

        generate();
    });

    elements.charReset.addEventListener('click', () => {
        selectedChars.forEach(i => {
            delete charColors[i];
            delete charTransparency[i];
        });
        generate();
    });

    elements.charResetAll.addEventListener('click', () => {
        charColors = {};
        charTransparency = {};
        generate();
    });

    elements.charEditorClose.addEventListener('click', () => {
        setSelection([]);
    });

    elements.pointApply.addEventListener('click', () => {
        if (selectedPoint === null || gradientPoints[selectedPoint] === undefined) return;
        const color = isValidHex(elements.pointColorHex.value)
            ? elements.pointColorHex.value
            : elements.pointColor.value;
        gradientPoints[selectedPoint] = color;

        const transRaw = elements.pointTransparency.value.trim();
        if (transRaw === '') {
            delete gradientPointTransparency[selectedPoint];
        } else if (isValidTransparency(transRaw)) {
            gradientPointTransparency[selectedPoint] = Number(transRaw);
        } else {
            return;
        }

        generate();
    });

    elements.pointDelete.addEventListener('click', () => {
        if (selectedPoint === null) return;
        delete gradientPoints[selectedPoint];
        delete gradientPointTransparency[selectedPoint];
        selectedPoint = null;
        updatePointsEditor();
        generate();
    });

    elements.pointsResetAll.addEventListener('click', () => {
        gradientPoints = {};
        gradientPointTransparency = {};
        selectedPoint = null;
        updatePointsEditor();
        generate();
    });

    function pruneCharColors() {
        const len = elements.textInput.value.length;
        Object.keys(charColors).forEach(k => {
            if (Number(k) >= len) delete charColors[k];
        });
        Object.keys(charTransparency).forEach(k => {
            if (Number(k) >= len) delete charTransparency[k];
        });
        Object.keys(gradientPoints).forEach(k => {
            if (Number(k) >= len) {
                delete gradientPoints[k];
                delete gradientPointTransparency[k];
            }
        });
        [...selectedChars].forEach(i => { if (i >= len) selectedChars.delete(i); });
        if (selectedPoint !== null && selectedPoint >= len) selectedPoint = null;
    }

    function buildTransparencyGroups(rawText, enableLineBreaks, colorFn, transFn) {
        const groups = [];
        let current = null;

        const pushChar = (ch, color, trans) => {
            if (current === null || !transAreSimilar(current.trans, trans)) {
                current = { trans, items: [] };
                groups.push(current);
            }
            const items = current.items;
            const last = items[items.length - 1];
            if (last && last.color === color) {
                last.text += ch;
            } else {
                items.push({ text: ch, color });
            }
        };

        for (let i = 0; i < rawText.length; i++) {
            const ch = rawText[i];
            if (ch === '\n') {
                if (enableLineBreaks) {
                    groups.push({ isBreak: true });
                    current = null;
                } else {
                    const c = colorFn(i) || null;
                    const t = transFn(i);
                    pushChar(' ', c, t);
                }
                continue;
            }
            const color = colorFn(i);
            const t = transFn(i);
            pushChar(ch, color, t);
        }
        return groups;
    }

    function buildDefaultioText(rawText, enableLineBreaks, options) {
        const {
            colorFn,
            font, strokeColor, strokeThickness,
            trans, animateStyle, animateGrouping,
            animateStepTime, animateStepFrequency, animateStyleTime
        } = options;

        let out = '';

        if (font) out += `<Font=${font}>`;
        if (animateGrouping && animateGrouping !== 'Letter') {
            out += `<AnimateStepGrouping=${animateGrouping}>`;
        }
        if (animateStepTime > 0) out += `<AnimateStepTime=${animateStepTime}>`;
        if (animateStepFrequency && Number(animateStepFrequency) > 0 && Number(animateStepFrequency) !== 4) {
            out += `<AnimateStepFrequency=${animateStepFrequency}>`;
        }
        if (animateStyleTime > 0 && animateStyleTime !== 0.5) {
            out += `<AnimateStyleTime=${animateStyleTime}>`;
        }

        if (strokeColor && strokeThickness > 0) {
            out += `<StrokeColor=${hexToDefaultioColor(strokeColor)}>`;
            out += `<TextStrokeTransparency=0>`;
        }

        if (trans > 0) out += `<TextTransparency=${roundTransparency(trans)}>`;

        let lastColor = null;
        let animationOpened = false;

        const openAnimation = () => {
            if (animateStyle && !animationOpened) {
                out += `<AnimateStyle=${animateStyle}>`;
                animationOpened = true;
            }
        };
        const closeAnimation = () => {
            if (animationOpened) {
                out += `<AnimateStyle=/>`;
                animationOpened = false;
            }
        };

        let i = 0;
        for (const ch of rawText) {
            if (ch === '\n') {
                if (enableLineBreaks) {
                    closeAnimation();
                    out += '\n';
                } else {
                    out += ' ';
                }
                i++;
                continue;
            }

            const hex = colorFn(i);
            const color = hex ? hexToDefaultioColor(hex) : null;

            if (color !== lastColor) {
                closeAnimation();
                if (lastColor !== null) out += '<Color=/>';
                if (color) out += `<Color=${color}>`;
                lastColor = color;
            }

            openAnimation();

            if (ch === '<' || ch === '>') {
                console.warn('Defaultio module cannot render "<" or ">" inside text. Skipping.', ch);
                i++;
                continue;
            }
            out += ch;
            i++;
        }

        closeAnimation();
        if (lastColor !== null) out += '<Color=/>';

        return out;
    }

    function generate() {
        const rawText = elements.textInput.value || 'Your Text';
        const userId = elements.userId.value || '0';
        const font = elements.fontFamily.value;
        const stroke = elements.strokeColor.value;
        const thickness = parseFloat(elements.strokeThickness.value);
        const mode = elements.colorMode.value;
        const source = elements.colorSource.value;
        const format = elements.outputFormat.value;
        const trans = parseFloat(elements.transparency.value);

        const formatting = {
            bold: elements.bold.checked,
            italic: elements.italic.checked,
            underline: elements.underline.checked,
            strikethrough: elements.strikethrough.checked
        };

        const fixColors = elements.fixColors.checked;
        const enableLineBreaks = elements.lineBreaks.checked;
        const usePoints = source === 'points' && getSortedPointIndexes().length > 0;

        pruneCharColors();

        let gradientColors = [];
        if (mode === 'gradient') {
            gradientColors = generateGradientColors(
                elements.gradientColor1.value,
                elements.gradientColor2.value,
                parseInt(elements.gradientSteps.value),
                elements.gradientType.value
            );
        }

        const solidColor = elements.textColor.value;

        const colorFn = colorForIndexFactory(rawText, {
            mode,
            solidColor,
            gradientColors,
            usePoints
        });

        const transFn = (i) => transparencyForIndex(i, trans, usePoints);

        const groups = buildTransparencyGroups(rawText, enableLineBreaks, colorFn, transFn);

        let inner = '';
        groups.forEach(g => {
            if (g.isBreak) {
                inner += '<br/>';
                return;
            }

            let groupInner = '';
            g.items.forEach(item => {
                if (item.color) {
                    if (fixColors) {
                        const parts = item.text.split(/( +)/);
                        parts.forEach(p => {
                            if (p === '') return;
                            if (/^ +$/.test(p)) groupInner += p;
                            else groupInner += `<font color='${item.color}'>${p}</font>`;
                        });
                    } else {
                        groupInner += `<font color='${item.color}'>${item.text}</font>`;
                    }
                } else {
                    groupInner += item.text;
                }
            });

            if (transAreSimilar(g.trans, trans)) {
                inner += groupInner;
            } else {
                const transAttr = (g.trans !== null && g.trans !== undefined)
                    ? ` transparency='${roundTransparency(g.trans)}'`
                    : '';
                inner += `<font${transAttr}>${groupInner}</font>`;
            }
        });

        const formattedInner = applyFormatting(inner, formatting);
        const globalTransAttr = trans > 0 ? ` transparency='${roundTransparency(trans)}'` : '';
        const openFont = `<font face='${font}'${globalTransAttr}>`;
        const hasStroke = thickness > 0;
        const openStroke = hasStroke ? `<stroke color='${stroke}' thickness='${thickness}'>` : '';
        const closeStroke = hasStroke ? '</stroke>' : '';
        const richText = `${openFont}${openStroke}${formattedInner}${closeStroke}</font>`;

        elements.outputCode.value = richText;

        if (format === 'defaultio') {
            const defaultioText = buildDefaultioText(rawText, enableLineBreaks, {
                colorFn,
                font,
                strokeColor: stroke,
                strokeThickness: thickness,
                trans,
                animateStyle: elements.animateStyle.value,
                animateGrouping: elements.animateGrouping.value,
                animateStepTime: parseFloat(elements.animateStepTime.value),
                animateStepFrequency: elements.animateStepFrequency.value,
                animateStyleTime: parseFloat(elements.animateStyleTime.value)
            });

            elements.outputDefaultio.value = defaultioText;

            const luaSnippet =
                `local richText = require(script.Parent:FindFirstChild("RichText") or script.Parent.Parent)\n` +
                `local text = "${defaultioText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\n` +
                `local textObject = richText:New(frame, text, {Font = "${font}"})\n` +
                `textObject:Animate(true)`;

            elements.outputJson.value = luaSnippet;
        } else {
            elements.outputDefaultio.value = '';
            elements.outputJson.value = `"${userId}": "${richText}"\n\n,`;
        }

        renderPreview(rawText, enableLineBreaks, {
            colorFn,
            usePoints,
            font,
            bold: formatting.bold,
            italic: formatting.italic,
            underline: formatting.underline,
            strikethrough: formatting.strikethrough,
            trans
        });

        updatePointsEditor();
    }

    const MAX_USER_ID_LENGTH = 20;

    elements.userId.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, MAX_USER_ID_LENGTH);
        generate();
    });

    elements.userId.addEventListener('blur', function () {
        if (this.value === '') {
            this.value = '0';
            generate();
        }
    });

    const syncColorPickers = (picker, hexInput) => {
        picker.addEventListener('input', () => {
            hexInput.value = picker.value;
            generate();
        });
        hexInput.addEventListener('input', () => {
            if (isValidHex(hexInput.value)) {
                picker.value = hexInput.value;
                generate();
            }
        });
    };

    syncColorPickers(elements.textColor, elements.textColorHex);
    syncColorPickers(elements.gradientColor1, elements.gradientColor1Hex);
    syncColorPickers(elements.gradientColor2, elements.gradientColor2Hex);
    syncColorPickers(elements.strokeColor, elements.strokeColorHex);

    const syncRange = (range, valueDisplay) => {
        range.addEventListener('input', () => {
            valueDisplay.textContent = range.value;
            generate();
        });
    };

    syncRange(elements.strokeThickness, elements.strokeThicknessValue);
    syncRange(elements.gradientSteps, elements.gradientStepsValue);
    syncRange(elements.transparency, elements.transparencyValue);

    function toggleGradientColorControls() {
        const isRainbow = elements.gradientType.value === 'rainbow';
        const color1Group = elements.gradientColor1.closest('.control-group');
        const color2Group = elements.gradientColor2.closest('.control-group');

        if (color1Group) color1Group.style.display = isRainbow ? 'none' : 'block';
        if (color2Group) color2Group.style.display = isRainbow ? 'none' : 'block';
    }

    function toggleDefaultioControls() {
        const isDefaultio = elements.outputFormat.value === 'defaultio';
        const groups = [
            elements.defaultioControls,
            elements.defaultioGroupingGroup,
            elements.defaultioStepTimeGroup,
            elements.defaultioStepFreqGroup,
            elements.defaultioStyleTimeGroup
        ];
        groups.forEach(el => { if (el) el.style.display = isDefaultio ? 'block' : 'none'; });

        if (elements.outputDefaultioSection) {
            elements.outputDefaultioSection.style.display = isDefaultio ? 'block' : 'none';
        }
    }

    function toggleColorSourceControls() {
        const isPoints = elements.colorSource.value === 'points';

        if (elements.modeControls) {
            elements.modeControls.style.display = isPoints ? 'none' : 'block';
        }

        if (isPoints) {
            elements.solidControls.classList.add('hidden');
            elements.gradientControls.style.display = 'none';
        } else {
            const isSolid = elements.colorMode.value === 'solid';
            elements.solidControls.classList.toggle('hidden', !isSolid);
            elements.gradientControls.style.display = isSolid ? 'none' : 'block';
        }
    }

    elements.colorMode.addEventListener('change', function () {
        if (elements.colorSource.value === 'points') {
            generate();
            return;
        }
        const isSolid = this.value === 'solid';
        elements.solidControls.classList.toggle('hidden', !isSolid);
        elements.gradientControls.style.display = isSolid ? 'none' : 'block';
        if (!isSolid) setTimeout(() => elements.gradientControls.classList.add('active'), 10);
        generate();
    });

    elements.colorSource.addEventListener('change', function () {
        setSelection([]);
        setSelectedPoint(null);

        if (this.value === 'points') {
            charColors = {};
            charTransparency = {};
            if (Object.keys(gradientPoints).length === 0) {
                const firstChar = elements.textInput.value[0];
                if (firstChar && firstChar !== '\n') {
                    gradientPoints[0] = elements.gradientColor1.value;
                }
            }
        } else {
            gradientPoints = {};
            gradientPointTransparency = {};
        }

        toggleColorSourceControls();
        generate();
    });

    elements.outputFormat.addEventListener('change', () => {
        toggleDefaultioControls();
        generate();
    });

    ['bold', 'italic', 'underline', 'strikethrough', 'lineBreaks', 'fixColors'].forEach(id => {
        elements[id].addEventListener('change', generate);
    });

    ['animateStyle', 'animateGrouping', 'animateStepFrequency'].forEach(id => {
        elements[id].addEventListener('input', generate);
        elements[id].addEventListener('change', generate);
    });

    elements.animateStepTime.addEventListener('input', () => {
        elements.animateStepTimeValue.textContent = elements.animateStepTime.value;
        generate();
    });

    elements.animateStyleTime.addEventListener('input', () => {
        elements.animateStyleTimeValue.textContent = elements.animateStyleTime.value;
        generate();
    });

    elements.textInput.addEventListener('input', generate);
    elements.fontFamily.addEventListener('change', generate);
    elements.gradientType.addEventListener('change', function () {
        toggleGradientColorControls();
        generate();
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const textarea = document.getElementById(this.dataset.target);
            if (!textarea) return;

            textarea.select();
            document.execCommand('copy');

            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.classList.add('copied');

            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('copied');
            }, 2000);
        });
    });

    elements.colorMode.value = 'gradient';
    elements.solidControls.classList.add('hidden');
    elements.gradientControls.style.display = 'block';
    setTimeout(() => elements.gradientControls.classList.add('active'), 10);
    elements.fixColors.checked = false;
    toggleGradientColorControls();
    toggleDefaultioControls();
    toggleColorSourceControls();

    function openHelp() {
        elements.helpOverlay.classList.remove('hidden');
    }
    function closeHelp() {
        elements.helpOverlay.classList.add('hidden');
    }

    elements.helpBtn.addEventListener('click', openHelp);
    elements.helpClose.addEventListener('click', closeHelp);

    elements.helpOverlay.addEventListener('click', (e) => {
        if (e.target === elements.helpOverlay) closeHelp();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.helpOverlay.classList.contains('hidden')) {
            closeHelp();
        }
    });

    window.addEventListener('resize', () => {
        generate();
    });

    generate();
});
