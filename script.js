document.addEventListener('DOMContentLoaded', function() {
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
        fontFamily: $('fontFamily'),
        preview: $('preview'),
        outputCode: $('outputCode'),
        outputJson: $('outputJson')
    };

    ALL_FONTS.forEach(font => {
        const option = new Option(font, font);
        elements.fontFamily.add(option);
    });
    elements.fontFamily.value = 'SpecialElite';

    const isValidHex = hex => /^#[0-9A-F]{6}$/i.test(hex);
    
    const hexToRgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');

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
        
        return Array.from({length: steps + 1}, (_, i) => {
            const t = i / steps;
            if (type === 'rainbow') {
                const rgb = hsvToRgb(t * 360, 1, 1);
                return rgbToHex(rgb.r, rgb.g, rgb.b);
            }
            const mixed = lerpColor(c1, c2, t);
            return rgbToHex(mixed.r, mixed.g, mixed.b);
        });
    };

    const applyFormatting = (text, {bold, italic, underline, strikethrough}) => {
        if (strikethrough) text = `<s>${text}</s>`;
        if (underline) text = `<u>${text}</u>`;
        if (italic) text = `<i>${text}</i>`;
        if (bold) text = `<b>${text}</b>`;
        return text;
    };

    const MAX_USER_ID_LENGTH = 20;
    
    elements.userId.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, MAX_USER_ID_LENGTH);
        generate();
    });
    
    elements.userId.addEventListener('blur', function() {
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

    syncRange(elements.gradientSteps, elements.gradientStepsValue);
    syncRange(elements.transparency, elements.transparencyValue);

    function toggleGradientColorControls() {
        const isRainbow = elements.gradientType.value === 'rainbow';
        const color1Group = elements.gradientColor1.closest('.control-group');
        const color2Group = elements.gradientColor2.closest('.control-group');
        
        if (color1Group) color1Group.style.display = isRainbow ? 'none' : 'block';
        if (color2Group) color2Group.style.display = isRainbow ? 'none' : 'block';
    }

    elements.colorMode.addEventListener('change', function() {
        const isSolid = this.value === 'solid';
        elements.solidControls.classList.toggle('hidden', !isSolid);
        elements.gradientControls.style.display = isSolid ? 'none' : 'block';
        if (!isSolid) setTimeout(() => elements.gradientControls.classList.add('active'), 10);
        generate();
    });

    ['bold', 'italic', 'underline', 'strikethrough', 'lineBreaks', 'fixColors'].forEach(id => {
        elements[id].addEventListener('change', generate);
    });

    elements.textInput.addEventListener('input', generate);
    elements.fontFamily.addEventListener('change', generate);
    elements.gradientType.addEventListener('change', function() {
        toggleGradientColorControls();
        generate();
    });

    function generate() {
        const rawText = elements.textInput.value || 'Your Text';
        const userId = elements.userId.value || '0';
        const font = elements.fontFamily.value;
        const stroke = elements.strokeColor.value;
        const mode = elements.colorMode.value;
        const trans = parseFloat(elements.transparency.value);
        const transAttr = trans > 0 ? ` transparency='${trans}'` : '';
        
        const formatting = {
            bold: elements.bold.checked,
            italic: elements.italic.checked,
            underline: elements.underline.checked,
            strikethrough: elements.strikethrough.checked
        };
        
        const fixColors = elements.fixColors.checked;
        const enableLineBreaks = elements.lineBreaks.checked;
        const processedText = enableLineBreaks 
            ? rawText.split('\n').join('<br/>') 
            : rawText.replace(/\n/g, ' ');

        let richText = '';

        if (mode === 'solid') {
            const color = elements.textColor.value;
            const formattedText = applyFormatting(processedText, formatting);
            
            richText = `<font color='${color}' face='${font}'>${formattedText}</font>`;
            
            elements.preview.style.backgroundImage = 'none';
            elements.preview.style.webkitTextFillColor = 'initial';
            elements.preview.style.color = color;
            elements.preview.innerHTML = enableLineBreaks 
                ? rawText.replace(/\n/g, '<br/>') 
                : rawText.replace(/\n/g, ' ');
            
        } else {
            const gradientTypeValue = elements.gradientType.value;
            const colors = generateGradientColors(
                elements.gradientColor1.value,
                elements.gradientColor2.value,
                parseInt(elements.gradientSteps.value),
                gradientTypeValue
            );
            
            let gradientContent = '';
            let currentColor = null;
            let currentText = '';
            
            const flushBuffer = () => {
                if (currentText) {
                    if (fixColors) {
                        if (currentText === ' ') {
                            gradientContent += ' ';
                        } else {
                            const formattedText = applyFormatting(currentText, formatting);
                            gradientContent += `<font color='${currentColor}'>${formattedText}</font>`;
                        }
                    } else {
                        gradientContent += `<font color='${currentColor}'>${currentText}</font>`;
                    }
                    currentText = '';
                }
            };
            
            const chars = processedText.split('');
            
            for (let i = 0; i < chars.length; i++) {
                if (chars[i] === '<' && processedText.substring(i, i + 5) === '<br/>') {
                    flushBuffer();
                    gradientContent += '<br/>';
                    currentColor = null;
                    i += 4;
                    continue;
                }
                
                const colorIndex = Math.min(Math.floor((i / chars.length) * colors.length), colors.length - 1);
                const color = colors[colorIndex];
                
                if (chars[i] === ' ') {
                    flushBuffer();
                    gradientContent += ' ';
                    currentColor = color;
                    continue;
                }
                
                if (currentColor !== color) {
                    flushBuffer();
                    currentColor = color;
                }
                
                currentText += chars[i];
            }
            
            flushBuffer();
            
            if (fixColors) {
                richText = `<font face='${font}'>${gradientContent}</font>`;
            } else {
                const formattedContent = applyFormatting(gradientContent, formatting);
                richText = `<font face='${font}'>${formattedContent}</font>`;
            }
            
            const colorStops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ');
            const gradientBg = `linear-gradient(to right, ${colorStops})`;
            
            elements.preview.style.backgroundImage = gradientBg;
            elements.preview.style.webkitBackgroundClip = 'text';
            elements.preview.style.webkitTextFillColor = 'transparent';
            elements.preview.style.backgroundClip = 'text';
            elements.preview.innerHTML = enableLineBreaks 
                ? rawText.replace(/\n/g, '<br/>') 
                : rawText.replace(/\n/g, ' ');
        }

        elements.preview.style.opacity = 1 - trans;
        elements.preview.style.fontFamily = font;
        elements.preview.style.fontWeight = formatting.bold ? 'bold' : 'normal';
        elements.preview.style.fontStyle = formatting.italic ? 'italic' : 'normal';
        elements.preview.style.textDecoration = formatting.underline ? 'underline' 
            : formatting.strikethrough ? 'line-through' 
            : 'none';

        elements.outputCode.value = richText;
        const jsonOutput = `"${userId}": "${richText}"\n\n,`;
        elements.outputJson.value = jsonOutput;
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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

    generate();
});
