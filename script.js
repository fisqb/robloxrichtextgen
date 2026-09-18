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
        rgbColors: $('rgbColors'),
        strokeColor: $('strokeColor'),
        strokeColorHex: $('strokeColorHex'),
        strokeThickness: $('strokeThickness'),
        strokeThicknessValue: $('strokeThicknessValue'),
        fontFamily: $('fontFamily'),
        preview: $('preview'),
        previewLarge: $('previewLarge'),
        previewOverlay: $('previewOverlay'),
        previewExpandBtn: $('previewExpandBtn'),
        previewClose: $('previewClose'),
        previewZoom: $('previewZoom'),
        previewZoomValue: $('previewZoomValue'),
        previewModalBody: $('previewModalBody'),
        editorHostMain: $('editorHostMain'),
        editorHostModal: $('editorHostModal'),
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
        animateStyleTimeValue: $('animateStyleTimeValue'),
        presetSelect: $('presetSelect'),
        presetSave: $('presetSave'),
        presetLoad: $('presetLoad'),
        presetRename: $('presetRename'),
        presetDelete: $('presetDelete'),
        presetImport: $('presetImport'),
        presetExport: $('presetExport'),
        presetExportAll: $('presetExportAll'),
        presetFileInput: $('presetFileInput'),
        languageSelect: $('languageSelect'),
        themeSelect: $('themeSelect'),
        uiModeSelect: $('uiModeSelect')
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

    const formatColor = (hex) => {
        if (!elements.rgbColors || !elements.rgbColors.checked) return hex;
        const c = hexToRgb(hex);
        if (!c) return hex;
        return `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;
    };

    // ===== Settings: language, theme, UI mode =====
    const SETTINGS_KEY = 'richTextGenSettings';

    const translations = {
        en: {
            language: 'Language', theme: 'Theme', uiMode: 'Mode',
            presets: 'Presets', selectPreset: '— Select a preset —',
            save: 'Save', load: 'Load', rename: 'Rename', delete: 'Delete',
            import: 'Import JSON', export: 'Export', exportAll: 'Export All',
            text: 'Text', userId: 'User ID',
            solid: 'Solid', gradient: 'Gradient', rainbow: 'Rainbow',
            colorSource: 'Color Source', modeOption: 'Mode (Solid / Gradient / Rainbow)', gradientPoints: 'Gradient Points',
            outputFormat: 'Output Format', robloxRichText: 'Roblox RichText (native)', defaultioRichText: 'Defaultio RichText Module',
            color: 'Color', color1: 'Color 1', color2: 'Color 2', steps: 'Steps',
            transparency: 'Transparency', formatting: 'Formatting',
            lineBreaks: 'Line Breaks', fixColors: 'Fix Colors', rgbColors: 'RGB Colors',
            stroke: 'Stroke', strokeWidth: 'Stroke Width', font: 'Font',
            animation: 'Animation', none: 'None',
            animateGrouping: 'Animate Grouping',
            groupLetter: 'Letter', groupWord: 'Word', groupAll: 'All',
            animateStepTime: 'Animate Step Time (s)',
            animateStepFrequency: 'Animate Step Frequency',
            animateStyleTime: 'Animate Style Time (s)',
            preview: 'Preview', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Defaultio Module Text', jsonLua: 'JSON / Lua',
            copy: 'Copy', copied: 'Copied!',
            apply: 'Apply', resetColor: 'Reset color', resetAllChars: 'Reset all characters',
            deletePoint: 'Delete point', resetAllPoints: 'Reset all points',
            character: 'Character', transparencyPlaceholder: 'Transparency (optional, 0-1)',
            previewHint: 'Click/tap characters to select them. Hold and drag to select multiple. Drag empty space to pan.',
            presetName: 'Preset name:', renamePreset: 'Rename preset to:',
            deletePreset: 'Delete preset "{name}"?',
            presetExists: 'A preset with this name already exists. Overwrite?',
            importOk: 'Imported {count} preset(s).',
            importNoPresets: 'No valid presets found in this JSON file.',
            importFailed: 'Failed to parse JSON file.',
            exportSelectFirst: 'Select a preset first.',
            exportNoPresets: 'No presets to export.',
            dark: 'Dark', light: 'Light', simple: 'Simple', advanced: 'Advanced',
            helpTitle: 'Tips & Help', helpGettingStarted: 'Getting started',
            helpStart1: 'Type your text in the Text field on the left.',
            helpStart2: 'The Preview on the right updates live.',
            helpStart3: 'Copy the output using the Copy buttons.',
            helpSettings: 'Settings',
            helpSettings1: 'Use the Language, Theme and Mode selectors next to the title.',
            helpSettings2: 'Dark and Simple are the defaults. Your choices are saved between visits.',
            helpSettings3: 'Switch to Advanced for all features (per-character colors, Gradient Points, Defaultio, JSON output).',
            helpPresets: 'Presets',
            helpPresets1: 'Save, load, rename and delete presets with the buttons above.',
            helpPresets2: 'Presets are stored locally in your browser.',
            helpPresets3: 'Import JSON — load one or many presets from a .json file. Export — download the selected preset. Export All — download every preset in one file.',
            helpAutoSave: 'Auto-save',
            helpAutoSave1: 'Your current text, colors, gradient points and settings are saved automatically.',
            helpColorModes: 'Color modes',
            helpColorModes1: 'Solid — one color for the entire text.',
            helpColorModes2: 'Gradient — colors blend horizontally between Color 1 and Color 2.',
            helpColorModes3: 'Rainbow — full hue spectrum across the text.',
            helpAdvanced: 'Advanced features',
            helpAdvanced1: 'Per-character colors, Gradient Points, Defaultio module output and JSON/Lua output are available in Advanced mode.',
            helpAdvanced2: 'Click the ⛶ button to expand the preview; you can edit characters right there and pan around by dragging empty space.',
            helpKeyboard: 'Keyboard',
            helpKeyboard1: 'Esc — close the expanded preview or this window.',
            helpKeyboard2: 'Click outside a modal to close it.'
        },
        es: {
            language: 'Idioma', theme: 'Tema', uiMode: 'Modo',
            presets: 'Ajustes guardados', selectPreset: '— Selecciona un ajuste —',
            save: 'Guardar', load: 'Cargar', rename: 'Renombrar', delete: 'Eliminar',
            import: 'Importar JSON', export: 'Exportar', exportAll: 'Exportar todo',
            text: 'Texto', userId: 'ID de usuario',
            solid: 'Sólido', gradient: 'Degradado', rainbow: 'Arcoíris',
            colorSource: 'Fuente de color', modeOption: 'Modo (Sólido / Degradado / Arcoíris)', gradientPoints: 'Puntos de degradado',
            outputFormat: 'Formato de salida', robloxRichText: 'Roblox RichText (nativo)', defaultioRichText: 'Módulo Defaultio RichText',
            color: 'Color', color1: 'Color 1', color2: 'Color 2', steps: 'Pasos',
            transparency: 'Transparencia', formatting: 'Formato',
            lineBreaks: 'Saltos de línea', fixColors: 'Corregir colores', rgbColors: 'Colores RGB',
            stroke: 'Contorno', strokeWidth: 'Grosor del contorno', font: 'Fuente',
            animation: 'Animación', none: 'Ninguna',
            animateGrouping: 'Agrupación de animación',
            groupLetter: 'Letra', groupWord: 'Palabra', groupAll: 'Todo',
            animateStepTime: 'Tiempo entre pasos (s)',
            animateStepFrequency: 'Frecuencia de pasos',
            animateStyleTime: 'Duración del estilo (s)',
            preview: 'Vista previa', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Texto del módulo Defaultio', jsonLua: 'JSON / Lua',
            copy: 'Copiar', copied: '¡Copiado!',
            apply: 'Aplicar', resetColor: 'Restablecer color', resetAllChars: 'Restablecer todos',
            deletePoint: 'Eliminar punto', resetAllPoints: 'Restablecer todos los puntos',
            character: 'Carácter', transparencyPlaceholder: 'Transparencia (opcional, 0-1)',
            previewHint: 'Haz clic o toca los caracteres para seleccionarlos. Mantén y arrastra para seleccionar varios. Arrastra el fondo para mover.',
            presetName: 'Nombre del ajuste:', renamePreset: 'Renombrar ajuste a:',
            deletePreset: '¿Eliminar el ajuste "{name}"?',
            presetExists: 'Ya existe un ajuste con este nombre. ¿Sobrescribir?',
            importOk: 'Se importaron {count} ajustes.',
            importNoPresets: 'No se encontraron ajustes válidos en este archivo JSON.',
            importFailed: 'No se pudo analizar el archivo JSON.',
            exportSelectFirst: 'Selecciona un ajuste primero.',
            exportNoPresets: 'No hay ajustes para exportar.',
            dark: 'Oscuro', light: 'Claro', simple: 'Simple', advanced: 'Avanzado',
            helpTitle: 'Ayuda y consejos', helpGettingStarted: 'Primeros pasos',
            helpStart1: 'Escribe tu texto en el campo Texto de la izquierda.',
            helpStart2: 'La vista previa se actualiza en vivo.',
            helpStart3: 'Copia la salida usando los botones Copiar.',
            helpSettings: 'Ajustes',
            helpSettings1: 'Usa los selectores de Idioma, Tema y Modo junto al título.',
            helpSettings2: 'Oscuro y Simple son los valores predeterminados. Tus elecciones se guardan.',
            helpSettings3: 'Cambia a Avanzado para todas las funciones.',
            helpPresets: 'Ajustes guardados',
            helpPresets1: 'Guarda, carga, renombra y elimina ajustes con los botones.',
            helpPresets2: 'Los ajustes se guardan localmente en tu navegador.',
            helpPresets3: 'Importar JSON — carga uno o varios ajustes desde un archivo .json. Exportar — descarga el ajuste seleccionado. Exportar todo — descarga todos los ajustes en un archivo.',
            helpAutoSave: 'Guardado automático',
            helpAutoSave1: 'Tu texto, colores y ajustes se guardan automáticamente.',
            helpColorModes: 'Modos de color',
            helpColorModes1: 'Sólido: un solo color para todo el texto.',
            helpColorModes2: 'Degradado: los colores se mezclan horizontalmente.',
            helpColorModes3: 'Arcoíris: espectro completo de tonos.',
            helpAdvanced: 'Funciones avanzadas',
            helpAdvanced1: 'Colores por carácter, Puntos de degradado, salida Defaultio y JSON/Lua en el modo Avanzado.',
            helpAdvanced2: 'Pulsa el botón ⛶ para ampliar la vista previa.',
            helpKeyboard: 'Teclado',
            helpKeyboard1: 'Esc — cerrar la vista ampliada o esta ventana.',
            helpKeyboard2: 'Haz clic fuera de un modal para cerrarlo.'
        },
        fr: {
            language: 'Langue', theme: 'Thème', uiMode: 'Mode',
            presets: 'Préréglages', selectPreset: '— Sélectionnez un préréglage —',
            save: 'Enregistrer', load: 'Charger', rename: 'Renommer', delete: 'Supprimer',
            import: 'Importer JSON', export: 'Exporter', exportAll: 'Tout exporter',
            text: 'Texte', userId: 'ID utilisateur',
            solid: 'Uni', gradient: 'Dégradé', rainbow: 'Arc-en-ciel',
            colorSource: 'Source de couleur', modeOption: 'Mode (Uni / Dégradé / Arc-en-ciel)', gradientPoints: 'Points de dégradé',
            outputFormat: 'Format de sortie', robloxRichText: 'Roblox RichText (natif)', defaultioRichText: 'Module Defaultio RichText',
            color: 'Couleur', color1: 'Couleur 1', color2: 'Couleur 2', steps: 'Étapes',
            transparency: 'Transparence', formatting: 'Mise en forme',
            lineBreaks: 'Sauts de ligne', fixColors: 'Corriger les couleurs', rgbColors: 'Couleurs RGB',
            stroke: 'Contour', strokeWidth: 'Épaisseur du contour', font: 'Police',
            animation: 'Animation', none: 'Aucune',
            animateGrouping: "Groupement d'animation",
            groupLetter: 'Lettre', groupWord: 'Mot', groupAll: 'Tout',
            animateStepTime: 'Temps entre les étapes (s)',
            animateStepFrequency: 'Fréquence des étapes',
            animateStyleTime: 'Durée du style (s)',
            preview: 'Aperçu', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Texte du module Defaultio', jsonLua: 'JSON / Lua',
            copy: 'Copier', copied: 'Copié !',
            apply: 'Appliquer', resetColor: 'Réinitialiser la couleur', resetAllChars: 'Réinitialiser tous',
            deletePoint: 'Supprimer le point', resetAllPoints: 'Réinitialiser tous les points',
            character: 'Caractère', transparencyPlaceholder: 'Transparence (facultatif, 0-1)',
            previewHint: 'Cliquez ou touchez les caractères pour les sélectionner. Maintenez et faites glisser pour en sélectionner plusieurs. Faites glisser le fond pour déplacer.',
            presetName: 'Nom du préréglage :', renamePreset: 'Renommer le préréglage en :',
            deletePreset: 'Supprimer le préréglage « {name} » ?',
            presetExists: 'Un préréglage avec ce nom existe déjà. Écraser ?',
            importOk: '{count} préréglage(s) importé(s).',
            importNoPresets: 'Aucun préréglage valide trouvé dans ce fichier JSON.',
            importFailed: 'Échec de l\'analyse du fichier JSON.',
            exportSelectFirst: 'Sélectionnez d\'abord un préréglage.',
            exportNoPresets: 'Aucun préréglage à exporter.',
            dark: 'Sombre', light: 'Clair', simple: 'Simple', advanced: 'Avancé',
            helpTitle: 'Aide et astuces', helpGettingStarted: 'Pour commencer',
            helpStart1: 'Saisissez votre texte à gauche.',
            helpStart2: "L'aperçu se met à jour en direct.",
            helpStart3: 'Copiez le résultat avec les boutons Copier.',
            helpSettings: 'Paramètres',
            helpSettings1: 'Utilisez les sélecteurs Langue, Thème et Mode à côté du titre.',
            helpSettings2: 'Sombre et Simple par défaut. Vos choix sont conservés.',
            helpSettings3: 'Passez en Avancé pour toutes les fonctions.',
            helpPresets: 'Préréglages',
            helpPresets1: 'Enregistrez, chargez, renommez et supprimez les préréglages.',
            helpPresets2: 'Les préréglages sont stockés localement.',
            helpPresets3: 'Importer JSON — chargez un ou plusieurs préréglages depuis un fichier .json. Exporter — téléchargez le préréglage sélectionné. Tout exporter — téléchargez tous les préréglages.',
            helpAutoSave: 'Sauvegarde automatique',
            helpAutoSave1: 'Votre texte, couleurs et réglages sont enregistrés automatiquement.',
            helpColorModes: 'Modes de couleur',
            helpColorModes1: 'Uni — une seule couleur.',
            helpColorModes2: 'Dégradé — mélange horizontal entre Couleur 1 et Couleur 2.',
            helpColorModes3: 'Arc-en-ciel — spectre complet.',
            helpAdvanced: 'Fonctions avancées',
            helpAdvanced1: 'Couleurs par caractère, Points de dégradé, sortie Defaultio et JSON/Lua en mode Avancé.',
            helpAdvanced2: "Cliquez sur ⛶ pour agrandir l'aperçu.",
            helpKeyboard: 'Clavier',
            helpKeyboard1: "Échap — fermer l'aperçu ou cette fenêtre.",
            helpKeyboard2: "Cliquez en dehors d'un modal pour le fermer."
        },
        de: {
            language: 'Sprache', theme: 'Design', uiMode: 'Modus',
            presets: 'Voreinstellungen', selectPreset: '— Voreinstellung wählen —',
            save: 'Speichern', load: 'Laden', rename: 'Umbenennen', delete: 'Löschen',
            import: 'JSON importieren', export: 'Exportieren', exportAll: 'Alle exportieren',
            text: 'Text', userId: 'Benutzer-ID',
            solid: 'Einfarbig', gradient: 'Verlauf', rainbow: 'Regenbogen',
            colorSource: 'Farbquelle', modeOption: 'Modus (Einfarbig / Verlauf / Regenbogen)', gradientPoints: 'Verlaufspunkte',
            outputFormat: 'Ausgabeformat', robloxRichText: 'Roblox RichText (nativ)', defaultioRichText: 'Defaultio RichText-Modul',
            color: 'Farbe', color1: 'Farbe 1', color2: 'Farbe 2', steps: 'Schritte',
            transparency: 'Transparenz', formatting: 'Formatierung',
            lineBreaks: 'Zeilenumbrüche', fixColors: 'Farben korrigieren', rgbColors: 'RGB-Farben',
            stroke: 'Kontur', strokeWidth: 'Konturstärke', font: 'Schriftart',
            animation: 'Animation', none: 'Keine',
            animateGrouping: 'Animationsgruppierung',
            groupLetter: 'Buchstabe', groupWord: 'Wort', groupAll: 'Alle',
            animateStepTime: 'Schrittzeit (s)',
            animateStepFrequency: 'Schrittfrequenz',
            animateStyleTime: 'Stildauer (s)',
            preview: 'Vorschau', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Defaultio-Modul-Text', jsonLua: 'JSON / Lua',
            copy: 'Kopieren', copied: 'Kopiert!',
            apply: 'Anwenden', resetColor: 'Farbe zurücksetzen', resetAllChars: 'Alle zurücksetzen',
            deletePoint: 'Punkt löschen', resetAllPoints: 'Alle Punkte zurücksetzen',
            character: 'Zeichen', transparencyPlaceholder: 'Transparenz (optional, 0-1)',
            previewHint: 'Klicke oder tippe auf Zeichen zum Auswählen. Halte und ziehe für mehrere. Ziehe den Hintergrund zum Verschieben.',
            presetName: 'Name der Voreinstellung:', renamePreset: 'Voreinstellung umbenennen in:',
            deletePreset: 'Voreinstellung „{name}" löschen?',
            presetExists: 'Eine Voreinstellung mit diesem Namen existiert. Überschreiben?',
            importOk: '{count} Voreinstellung(en) importiert.',
            importNoPresets: 'Keine gültigen Voreinstellungen in dieser JSON-Datei gefunden.',
            importFailed: 'JSON-Datei konnte nicht gelesen werden.',
            exportSelectFirst: 'Bitte zuerst eine Voreinstellung auswählen.',
            exportNoPresets: 'Keine Voreinstellungen zum Exportieren.',
            dark: 'Dunkel', light: 'Hell', simple: 'Einfach', advanced: 'Erweitert',
            helpTitle: 'Tipps & Hilfe', helpGettingStarted: 'Erste Schritte',
            helpStart1: 'Gib deinen Text links ein.',
            helpStart2: 'Die Vorschau aktualisiert sich live.',
            helpStart3: 'Kopiere die Ausgabe mit den Kopieren-Buttons.',
            helpSettings: 'Einstellungen',
            helpSettings1: 'Nutze Sprache, Design und Modus neben dem Titel.',
            helpSettings2: 'Dunkel und Einfach sind Standard. Deine Auswahl bleibt erhalten.',
            helpSettings3: 'Wechsle zu Erweitert für alle Funktionen.',
            helpPresets: 'Voreinstellungen',
            helpPresets1: 'Speichern, laden, umbenennen und löschen mit den Buttons.',
            helpPresets2: 'Voreinstellungen werden lokal gespeichert.',
            helpPresets3: 'JSON importieren — lade eine oder mehrere Voreinstellungen aus einer .json-Datei. Exportieren — lade die ausgewählte Voreinstellung herunter. Alle exportieren — lade alle Voreinstellungen in einer Datei herunter.',
            helpAutoSave: 'Automatisches Speichern',
            helpAutoSave1: 'Text, Farben und Einstellungen werden automatisch gespeichert.',
            helpColorModes: 'Farbmodi',
            helpColorModes1: 'Einfarbig — eine Farbe für den gesamten Text.',
            helpColorModes2: 'Verlauf — Farben mischen sich horizontal.',
            helpColorModes3: 'Regenbogen — volles Farbspektrum.',
            helpAdvanced: 'Erweiterte Funktionen',
            helpAdvanced1: 'Zeichenfarben, Verlaufspunkte, Defaultio- und JSON/Lua-Ausgabe im Erweitert-Modus.',
            helpAdvanced2: 'Klicke ⛶, um die Vorschau zu vergrößern.',
            helpKeyboard: 'Tastatur',
            helpKeyboard1: 'Esc — vergrößerte Vorschau oder dieses Fenster schließen.',
            helpKeyboard2: 'Klicke außerhalb eines Modals, um es zu schließen.'
        },
        it: {
            language: 'Lingua', theme: 'Tema', uiMode: 'Modalità',
            presets: 'Preset', selectPreset: '— Seleziona un preset —',
            save: 'Salva', load: 'Carica', rename: 'Rinomina', delete: 'Elimina',
            import: 'Importa JSON', export: 'Esporta', exportAll: 'Esporta tutto',
            text: 'Testo', userId: 'ID utente',
            solid: 'Tinta unita', gradient: 'Sfumatura', rainbow: 'Arcobaleno',
            colorSource: 'Sorgente colore', modeOption: 'Modalità (Tinta unita / Sfumatura / Arcobaleno)', gradientPoints: 'Punti sfumatura',
            outputFormat: 'Formato output', robloxRichText: 'Roblox RichText (nativo)', defaultioRichText: 'Modulo Defaultio RichText',
            color: 'Colore', color1: 'Colore 1', color2: 'Colore 2', steps: 'Passi',
            transparency: 'Trasparenza', formatting: 'Formattazione',
            lineBreaks: 'Interruzioni di riga', fixColors: 'Correggi colori', rgbColors: 'Colori RGB',
            stroke: 'Contorno', strokeWidth: 'Spessore contorno', font: 'Carattere',
            animation: 'Animazione', none: 'Nessuna',
            animateGrouping: 'Raggruppamento animazione',
            groupLetter: 'Lettera', groupWord: 'Parola', groupAll: 'Tutto',
            animateStepTime: 'Tempo tra passi (s)',
            animateStepFrequency: 'Frequenza passi',
            animateStyleTime: 'Durata stile (s)',
            preview: 'Anteprima', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Testo modulo Defaultio', jsonLua: 'JSON / Lua',
            copy: 'Copia', copied: 'Copiato!',
            apply: 'Applica', resetColor: 'Reimposta colore', resetAllChars: 'Reimposta tutti',
            deletePoint: 'Elimina punto', resetAllPoints: 'Reimposta tutti i punti',
            character: 'Carattere', transparencyPlaceholder: 'Trasparenza (opzionale, 0-1)',
            previewHint: 'Clicca o tocca i caratteri per selezionarli. Tieni premuto e trascina per selezionarne più di uno. Trascina lo sfondo per spostare.',
            presetName: 'Nome preset:', renamePreset: 'Rinomina preset in:',
            deletePreset: 'Eliminare il preset "{name}"?',
            presetExists: 'Esiste già un preset con questo nome. Sovrascrivere?',
            importOk: '{count} preset importati.',
            importNoPresets: 'Nessun preset valido trovato in questo file JSON.',
            importFailed: 'Impossibile analizzare il file JSON.',
            exportSelectFirst: 'Seleziona prima un preset.',
            exportNoPresets: 'Nessun preset da esportare.',
            dark: 'Scuro', light: 'Chiaro', simple: 'Semplice', advanced: 'Avanzato',
            helpTitle: 'Suggerimenti e aiuto', helpGettingStarted: 'Per iniziare',
            helpStart1: 'Scrivi il testo a sinistra.',
            helpStart2: "L'anteprima si aggiorna in tempo reale.",
            helpStart3: "Copia l'output con i pulsanti Copia.",
            helpSettings: 'Impostazioni',
            helpSettings1: 'Usa Lingua, Tema e Modalità accanto al titolo.',
            helpSettings2: 'Scuro e Semplice sono predefiniti. Le tue scelte vengono salvate.',
            helpSettings3: 'Passa ad Avanzato per tutte le funzioni.',
            helpPresets: 'Preset',
            helpPresets1: 'Salva, carica, rinomina ed elimina i preset.',
            helpPresets2: 'I preset sono memorizzati localmente.',
            helpPresets3: 'Importa JSON — carica uno o più preset da un file .json. Esporta — scarica il preset selezionato. Esporta tutto — scarica tutti i preset in un file.',
            helpAutoSave: 'Salvataggio automatico',
            helpAutoSave1: 'Testo, colori e impostazioni vengono salvati automaticamente.',
            helpColorModes: 'Modalità colore',
            helpColorModes1: 'Tinta unita — un solo colore.',
            helpColorModes2: 'Sfumatura — colori sfumati orizzontalmente.',
            helpColorModes3: 'Arcobaleno — spettro completo.',
            helpAdvanced: 'Funzioni avanzate',
            helpAdvanced1: 'Colori per carattere, Punti sfumatura, output Defaultio e JSON/Lua in modalità Avanzato.',
            helpAdvanced2: "Premi ⛶ per ingrandire l'anteprima.",
            helpKeyboard: 'Tastiera',
            helpKeyboard1: "Esc — chiude l'anteprima o questa finestra.",
            helpKeyboard2: 'Clicca fuori da un modale per chiuderlo.'
        },
        pt: {
            language: 'Idioma', theme: 'Tema', uiMode: 'Modo',
            presets: 'Presets', selectPreset: '— Selecione um preset —',
            save: 'Salvar', load: 'Carregar', rename: 'Renomear', delete: 'Excluir',
            import: 'Importar JSON', export: 'Exportar', exportAll: 'Exportar tudo',
            text: 'Texto', userId: 'ID do usuário',
            solid: 'Sólido', gradient: 'Gradiente', rainbow: 'Arco-íris',
            colorSource: 'Fonte de cor', modeOption: 'Modo (Sólido / Gradiente / Arco-íris)', gradientPoints: 'Pontos de gradiente',
            outputFormat: 'Formato de saída', robloxRichText: 'Roblox RichText (nativo)', defaultioRichText: 'Módulo Defaultio RichText',
            color: 'Cor', color1: 'Cor 1', color2: 'Cor 2', steps: 'Passos',
            transparency: 'Transparência', formatting: 'Formatação',
            lineBreaks: 'Quebras de linha', fixColors: 'Corrigir cores', rgbColors: 'Cores RGB',
            stroke: 'Contorno', strokeWidth: 'Largura do contorno', font: 'Fonte',
            animation: 'Animação', none: 'Nenhuma',
            animateGrouping: 'Agrupamento de animação',
            groupLetter: 'Letra', groupWord: 'Palavra', groupAll: 'Tudo',
            animateStepTime: 'Tempo entre passos (s)',
            animateStepFrequency: 'Frequência dos passos',
            animateStyleTime: 'Duração do estilo (s)',
            preview: 'Pré-visualização', zoom: 'Zoom',
            richText: 'Rich Text', defaultioModule: 'Texto do módulo Defaultio', jsonLua: 'JSON / Lua',
            copy: 'Copiar', copied: 'Copiado!',
            apply: 'Aplicar', resetColor: 'Redefinir cor', resetAllChars: 'Redefinir tudo',
            deletePoint: 'Excluir ponto', resetAllPoints: 'Redefinir todos os pontos',
            character: 'Caractere', transparencyPlaceholder: 'Transparência (opcional, 0-1)',
            previewHint: 'Clique ou toque nos caracteres para selecioná-los. Segure e arraste para selecionar vários. Arraste o fundo para mover.',
            presetName: 'Nome do preset:', renamePreset: 'Renomear preset para:',
            deletePreset: 'Excluir o preset "{name}"?',
            presetExists: 'Já existe um preset com esse nome. Substituir?',
            importOk: '{count} preset(s) importado(s).',
            importNoPresets: 'Nenhum preset válido encontrado neste arquivo JSON.',
            importFailed: 'Falha ao analisar o arquivo JSON.',
            exportSelectFirst: 'Selecione um preset primeiro.',
            exportNoPresets: 'Nenhum preset para exportar.',
            dark: 'Escuro', light: 'Claro', simple: 'Simples', advanced: 'Avançado',
            helpTitle: 'Dicas e ajuda', helpGettingStarted: 'Primeiros passos',
            helpStart1: 'Digite seu texto à esquerda.',
            helpStart2: 'A pré-visualização é atualizada ao vivo.',
            helpStart3: 'Copie a saída usando os botões Copiar.',
            helpSettings: 'Configurações',
            helpSettings1: 'Use os seletores de Idioma, Tema e Modo ao lado do título.',
            helpSettings2: 'Escuro e Simples são padrão. Suas escolhas são salvas.',
            helpSettings3: 'Mude para Avançado para todos os recursos.',
            helpPresets: 'Presets',
            helpPresets1: 'Salve, carregue, renomeie e exclua presets.',
            helpPresets2: 'Os presets são armazenados localmente.',
            helpPresets3: 'Importar JSON — carregue um ou vários presets de um arquivo .json. Exportar — baixe o preset selecionado. Exportar tudo — baixe todos os presets em um arquivo.',
            helpAutoSave: 'Salvamento automático',
            helpAutoSave1: 'Seu texto, cores e configurações são salvos automaticamente.',
            helpColorModes: 'Modos de cor',
            helpColorModes1: 'Sólido — uma cor para todo o texto.',
            helpColorModes2: 'Gradiente — cores misturadas horizontalmente.',
            helpColorModes3: 'Arco-íris — espectro completo.',
            helpAdvanced: 'Recursos avançados',
            helpAdvanced1: 'Cores por caractere, Pontos de gradiente, saída Defaultio e JSON/Lua no modo Avançado.',
            helpAdvanced2: 'Clique em ⛶ para expandir a pré-visualização.',
            helpKeyboard: 'Teclado',
            helpKeyboard1: 'Esc — fecha a pré-visualização expandida ou esta janela.',
            helpKeyboard2: 'Clique fora de um modal para fechá-lo.'
        },
        ru: {
            language: 'Язык', theme: 'Тема', uiMode: 'Режим',
            presets: 'Пресеты', selectPreset: '— Выберите пресет —',
            save: 'Сохранить', load: 'Загрузить', rename: 'Переименовать', delete: 'Удалить',
            import: 'Импорт JSON', export: 'Экспорт', exportAll: 'Экспорт всех',
            text: 'Текст', userId: 'User ID',
            solid: 'Сплошной', gradient: 'Градиент', rainbow: 'Радуга',
            colorSource: 'Источник цвета', modeOption: 'Режим (Solid / Gradient / Rainbow)', gradientPoints: 'Точки градиента',
            outputFormat: 'Формат вывода', robloxRichText: 'Roblox RichText (нативный)', defaultioRichText: 'Модуль Defaultio RichText',
            color: 'Цвет', color1: 'Цвет 1', color2: 'Цвет 2', steps: 'Шаги',
            transparency: 'Прозрачность', formatting: 'Форматирование',
            lineBreaks: 'Переносы строк', fixColors: 'Fix Colors', rgbColors: 'Цвета RGB',
            stroke: 'Обводка', strokeWidth: 'Толщина обводки', font: 'Шрифт',
            animation: 'Анимация', none: 'Нет',
            animateGrouping: 'Группировка анимации',
            groupLetter: 'По буквам', groupWord: 'По словам', groupAll: 'Всё сразу',
            animateStepTime: 'Задержка шага (с)',
            animateStepFrequency: 'Частота шага',
            animateStyleTime: 'Длительность стиля (с)',
            preview: 'Превью', zoom: 'Масштаб',
            richText: 'Rich Text', defaultioModule: 'Текст для модуля Defaultio', jsonLua: 'JSON / Lua',
            copy: 'Копировать', copied: 'Скопировано!',
            apply: 'Применить', resetColor: 'Сбросить цвет', resetAllChars: 'Сбросить все буквы',
            deletePoint: 'Удалить точку', resetAllPoints: 'Сбросить все точки',
            character: 'Символ', transparencyPlaceholder: 'Прозрачность (необязательно, 0-1)',
            previewHint: 'Кликните или тапните буквы для выделения. Зажмите и ведите для выделения нескольких. Тяните пустое место, чтобы сдвинуть.',
            presetName: 'Имя пресета:', renamePreset: 'Переименовать пресет в:',
            deletePreset: 'Удалить пресет "{name}"?',
            presetExists: 'Пресет с таким именем уже существует. Перезаписать?',
            importOk: 'Импортировано пресетов: {count}.',
            importNoPresets: 'В этом JSON-файле не найдено подходящих пресетов.',
            importFailed: 'Не удалось прочитать JSON-файл.',
            exportSelectFirst: 'Сначала выберите пресет.',
            exportNoPresets: 'Нет пресетов для экспорта.',
            dark: 'Тёмная', light: 'Светлая', simple: 'Простой', advanced: 'Продвинутый',
            helpTitle: 'Справка и советы', helpGettingStarted: 'С чего начать',
            helpStart1: 'Введите текст в поле слева.',
            helpStart2: 'Превью справа обновляется в реальном времени.',
            helpStart3: 'Скопируйте результат кнопками Copy.',
            helpSettings: 'Настройки',
            helpSettings1: 'Используйте селекты Язык, Тема и Режим рядом с заголовком.',
            helpSettings2: 'По умолчанию — тёмная тема и простой режим. Выбор сохраняется между визитами.',
            helpSettings3: 'Переключитесь на Продвинутый, чтобы получить все возможности.',
            helpPresets: 'Пресеты',
            helpPresets1: 'Сохраняйте, загружайте, переименовывайте и удаляйте пресеты.',
            helpPresets2: 'Пресеты хранятся локально в браузере.',
            helpPresets3: 'Импорт JSON — загрузите один или несколько пресетов из .json файла. Экспорт — скачайте выбранный пресет. Экспорт всех — скачайте все пресеты одним файлом.',
            helpAutoSave: 'Автосохранение',
            helpAutoSave1: 'Ваш текст, цвета и настройки сохраняются автоматически.',
            helpColorModes: 'Режимы цвета',
            helpColorModes1: 'Solid — один цвет для всего текста.',
            helpColorModes2: 'Gradient — цвета плавно переходят горизонтально.',
            helpColorModes3: 'Rainbow — полный спектр оттенков.',
            helpAdvanced: 'Продвинутые функции',
            helpAdvanced1: 'Цвета по буквам, точки градиента, вывод для модуля Defaultio и JSON/Lua — в режиме Продвинутый.',
            helpAdvanced2: 'Нажмите ⛶, чтобы развернуть превью, редактировать прямо там и двигать полотно перетаскиванием пустого места.',
            helpKeyboard: 'Клавиатура',
            helpKeyboard1: 'Esc — закрыть развёрнутое превью или это окно.',
            helpKeyboard2: 'Клик вне окна тоже закрывает его.'
        },
        ja: {
            language: '言語', theme: 'テーマ', uiMode: 'モード',
            presets: 'プリセット', selectPreset: '— プリセットを選択 —',
            save: '保存', load: '読み込み', rename: '名前を変更', delete: '削除',
            import: 'JSON をインポート', export: 'エクスポート', exportAll: 'すべてエクスポート',
            text: 'テキスト', userId: 'ユーザーID',
            solid: '単色', gradient: 'グラデーション', rainbow: '虹色',
            colorSource: '色のソース', modeOption: 'モード (単色 / グラデーション / 虹色)', gradientPoints: 'グラデーションポイント',
            outputFormat: '出力形式', robloxRichText: 'Roblox RichText (ネイティブ)', defaultioRichText: 'Defaultio RichText モジュール',
            color: '色', color1: '色 1', color2: '色 2', steps: 'ステップ',
            transparency: '透明度', formatting: '書式',
            lineBreaks: '改行', fixColors: '色を修正', rgbColors: 'RGB カラー',
            stroke: '縁取り', strokeWidth: '縁取りの太さ', font: 'フォント',
            animation: 'アニメーション', none: 'なし',
            animateGrouping: 'アニメーションのまとめ',
            groupLetter: '文字', groupWord: '単語', groupAll: 'すべて',
            animateStepTime: 'ステップ間の時間 (秒)',
            animateStepFrequency: 'ステップ頻度',
            animateStyleTime: 'スタイルの長さ (秒)',
            preview: 'プレビュー', zoom: 'ズーム',
            richText: 'Rich Text', defaultioModule: 'Defaultio モジュールテキスト', jsonLua: 'JSON / Lua',
            copy: 'コピー', copied: 'コピーしました!',
            apply: '適用', resetColor: '色をリセット', resetAllChars: 'すべてリセット',
            deletePoint: 'ポイントを削除', resetAllPoints: 'すべてのポイントをリセット',
            character: '文字', transparencyPlaceholder: '透明度 (任意, 0-1)',
            previewHint: '文字をクリックまたはタップして選択します。長押ししてドラッグで複数選択。空白をドラッグして移動。',
            presetName: 'プリセット名:', renamePreset: 'プリセットの新しい名前:',
            deletePreset: 'プリセット「{name}」を削除しますか?',
            presetExists: '同名のプリセットが存在します。上書きしますか?',
            importOk: '{count} 件のプリセットをインポートしました。',
            importNoPresets: 'この JSON ファイルに有効なプリセットが見つかりませんでした。',
            importFailed: 'JSON ファイルの読み込みに失敗しました。',
            exportSelectFirst: '先にプリセットを選択してください。',
            exportNoPresets: 'エクスポートするプリセットがありません。',
            dark: 'ダーク', light: 'ライト', simple: 'シンプル', advanced: '詳細',
            helpTitle: 'ヒントとヘルプ', helpGettingStarted: 'はじめに',
            helpStart1: '左側のテキスト欄に入力します。',
            helpStart2: '右側のプレビューがリアルタイムで更新されます。',
            helpStart3: 'コピーボタンで出力をコピーできます。',
            helpSettings: '設定',
            helpSettings1: 'タイトルの横の言語・テーマ・モードのセレクターを使います。',
            helpSettings2: 'デフォルトはダークテーマとシンプルモードです。選択は保存されます。',
            helpSettings3: '詳細モードに切り替えるとすべての機能が使えます。',
            helpPresets: 'プリセット',
            helpPresets1: '保存・読み込み・名前変更・削除ができます。',
            helpPresets2: 'プリセットはブラウザに保存されます。',
            helpPresets3: 'JSON をインポート — .json ファイルから 1 つまたは複数のプリセットを読み込みます。エクスポート — 選択中のプリセットをダウンロードします。すべてエクスポート — すべてのプリセットを 1 ファイルでダウンロードします。',
            helpAutoSave: '自動保存',
            helpAutoSave1: 'テキスト・色・設定は自動的に保存されます。',
            helpColorModes: 'カラーモード',
            helpColorModes1: '単色 — 全体を 1 色で。',
            helpColorModes2: 'グラデーション — 色 1 と色 2 の間で横に変化。',
            helpColorModes3: '虹色 — 全色相スペクトラム。',
            helpAdvanced: '詳細機能',
            helpAdvanced1: '文字ごとの色・グラデーションポイント・Defaultio・JSON/Lua は詳細モードで。',
            helpAdvanced2: '⛶ を押すとプレビューを拡大し、その場で編集・ドラッグ移動できます。',
            helpKeyboard: 'キーボード',
            helpKeyboard1: 'Esc — 拡大プレビューまたはこのウィンドウを閉じます。',
            helpKeyboard2: 'モーダルの外をクリックしても閉じます。'
        },
        ko: {
            language: '언어', theme: '테마', uiMode: '모드',
            presets: '프리셋', selectPreset: '— 프리셋 선택 —',
            save: '저장', load: '불러오기', rename: '이름 변경', delete: '삭제',
            import: 'JSON 가져오기', export: '내보내기', exportAll: '모두 내보내기',
            text: '텍스트', userId: '사용자 ID',
            solid: '단색', gradient: '그라데이션', rainbow: '무지개',
            colorSource: '색상 소스', modeOption: '모드 (단색 / 그라데이션 / 무지개)', gradientPoints: '그라데이션 포인트',
            outputFormat: '출력 형식', robloxRichText: 'Roblox RichText (기본)', defaultioRichText: 'Defaultio RichText 모듈',
            color: '색상', color1: '색상 1', color2: '색상 2', steps: '단계',
            transparency: '투명도', formatting: '서식',
            lineBreaks: '줄 바꿈', fixColors: '색상 수정', rgbColors: 'RGB 색상',
            stroke: '외곽선', strokeWidth: '외곽선 두께', font: '글꼴',
            animation: '애니메이션', none: '없음',
            animateGrouping: '애니메이션 그룹',
            groupLetter: '글자', groupWord: '단어', groupAll: '전체',
            animateStepTime: '단계 간격 (초)',
            animateStepFrequency: '단계 빈도',
            animateStyleTime: '스타일 시간 (초)',
            preview: '미리보기', zoom: '확대',
            richText: 'Rich Text', defaultioModule: 'Defaultio 모듈 텍스트', jsonLua: 'JSON / Lua',
            copy: '복사', copied: '복사됨!',
            apply: '적용', resetColor: '색상 초기화', resetAllChars: '모두 초기화',
            deletePoint: '포인트 삭제', resetAllPoints: '모든 포인트 초기화',
            character: '문자', transparencyPlaceholder: '투명도 (선택, 0-1)',
            previewHint: '문자를 클릭하거나 탭하여 선택하세요. 길게 눌러 드래그하면 여러 개를 선택할 수 있습니다. 빈 공간을 드래그하면 이동합니다.',
            presetName: '프리셋 이름:', renamePreset: '프리셋 새 이름:',
            deletePreset: '프리셋 "{name}"을(를) 삭제할까요?',
            presetExists: '같은 이름의 프리셋이 있습니다. 덮어쓸까요?',
            importOk: '{count}개의 프리셋을 가져왔습니다.',
            importNoPresets: '이 JSON 파일에서 유효한 프리셋을 찾지 못했습니다.',
            importFailed: 'JSON 파일을 읽지 못했습니다.',
            exportSelectFirst: '먼저 프리셋을 선택하세요.',
            exportNoPresets: '내보낼 프리셋이 없습니다.',
            dark: '어두움', light: '밝음', simple: '간단', advanced: '고급',
            helpTitle: '도움말 및 팁', helpGettingStarted: '시작하기',
            helpStart1: '왼쪽 텍스트 필드에 입력하세요.',
            helpStart2: '오른쪽 미리보기가 실시간으로 업데이트됩니다.',
            helpStart3: '복사 버튼으로 출력을 복사하세요.',
            helpSettings: '설정',
            helpSettings1: '제목 옆의 언어, 테마, 모드 선택기를 사용하세요.',
            helpSettings2: '어두운 테마와 간단 모드가 기본입니다. 선택은 저장됩니다.',
            helpSettings3: '고급 모드로 전환하면 모든 기능을 사용할 수 있습니다.',
            helpPresets: '프리셋',
            helpPresets1: '저장, 불러오기, 이름 변경, 삭제가 가능합니다.',
            helpPresets2: '프리셋은 브라우저에 저장됩니다.',
            helpPresets3: 'JSON 가져오기 — .json 파일에서 하나 또는 여러 개의 프리셋을 불러옵니다. 내보내기 — 선택한 프리셋을 다운로드합니다. 모두 내보내기 — 모든 프리셋을 한 파일로 다운로드합니다.',
            helpAutoSave: '자동 저장',
            helpAutoSave1: '텍스트, 색상, 설정이 자동으로 저장됩니다.',
            helpColorModes: '색상 모드',
            helpColorModes1: '단색 — 전체 텍스트에 하나의 색상.',
            helpColorModes2: '그라데이션 — 색상 1과 2 사이에서 가로로 변화.',
            helpColorModes3: '무지개 — 전체 색조 스펙트럼.',
            helpAdvanced: '고급 기능',
            helpAdvanced1: '문자별 색상, 그라데이션 포인트, Defaultio 및 JSON/Lua는 고급 모드에서.',
            helpAdvanced2: '⛶를 눌러 미리보기를 확장하고 그 자리에서 편집 및 드래그로 이동할 수 있습니다.',
            helpKeyboard: '키보드',
            helpKeyboard1: 'Esc — 확장된 미리보기 또는 이 창을 닫습니다.',
            helpKeyboard2: '모달 바깥을 클릭해도 닫힙니다.'
        },
        zh: {
            language: '语言', theme: '主题', uiMode: '模式',
            presets: '预设', selectPreset: '— 选择一个预设 —',
            save: '保存', load: '加载', rename: '重命名', delete: '删除',
            import: '导入 JSON', export: '导出', exportAll: '全部导出',
            text: '文本', userId: '用户 ID',
            solid: '纯色', gradient: '渐变', rainbow: '彩虹',
            colorSource: '颜色来源', modeOption: '模式 (纯色 / 渐变 / 彩虹)', gradientPoints: '渐变点',
            outputFormat: '输出格式', robloxRichText: 'Roblox RichText (原生)', defaultioRichText: 'Defaultio RichText 模块',
            color: '颜色', color1: '颜色 1', color2: '颜色 2', steps: '步数',
            transparency: '透明度', formatting: '格式',
            lineBreaks: '换行', fixColors: '修正颜色', rgbColors: 'RGB 颜色',
            stroke: '描边', strokeWidth: '描边宽度', font: '字体',
            animation: '动画', none: '无',
            animateGrouping: '动画分组',
            groupLetter: '逐字', groupWord: '逐词', groupAll: '全部',
            animateStepTime: '步进时间 (秒)',
            animateStepFrequency: '步进频率',
            animateStyleTime: '样式时长 (秒)',
            preview: '预览', zoom: '缩放',
            richText: 'Rich Text', defaultioModule: 'Defaultio 模块文本', jsonLua: 'JSON / Lua',
            copy: '复制', copied: '已复制!',
            apply: '应用', resetColor: '重置颜色', resetAllChars: '重置所有',
            deletePoint: '删除点', resetAllPoints: '重置所有点',
            character: '字符', transparencyPlaceholder: '透明度 (可选, 0-1)',
            previewHint: '点击字符以选择。按住并拖动可选择多个。拖动空白处可平移。',
            presetName: '预设名称:', renamePreset: '将预设重命名为:',
            deletePreset: '删除预设 "{name}"?',
            presetExists: '已存在同名预设。是否覆盖?',
            importOk: '已导入 {count} 个预设。',
            importNoPresets: '此 JSON 文件中未找到有效的预设。',
            importFailed: '无法解析 JSON 文件。',
            exportSelectFirst: '请先选择一个预设。',
            exportNoPresets: '没有可导出的预设。',
            dark: '暗色', light: '亮色', simple: '简易', advanced: '高级',
            helpTitle: '帮助与提示', helpGettingStarted: '开始使用',
            helpStart1: '在左侧文本框中输入文本。',
            helpStart2: '右侧预览会实时更新。',
            helpStart3: '使用复制按钮复制输出。',
            helpSettings: '设置',
            helpSettings1: '使用标题旁边的语言、主题和模式选择器。',
            helpSettings2: '默认为暗色主题和简易模式。你的选择会被保存。',
            helpSettings3: '切换到高级模式可使用所有功能。',
            helpPresets: '预设',
            helpPresets1: '使用按钮保存、加载、重命名和删除预设。',
            helpPresets2: '预设保存在浏览器本地。',
            helpPresets3: '导入 JSON — 从 .json 文件加载一个或多个预设。导出 — 下载当前选中的预设。全部导出 — 将所有预设下载为一个文件。',
            helpAutoSave: '自动保存',
            helpAutoSave1: '文本、颜色和设置会自动保存。',
            helpColorModes: '颜色模式',
            helpColorModes1: '纯色 — 整个文本使用一种颜色。',
            helpColorModes2: '渐变 — 颜色 1 与颜色 2 之间水平混合。',
            helpColorModes3: '彩虹 — 完整色相光谱。',
            helpAdvanced: '高级功能',
            helpAdvanced1: '逐字颜色、渐变点、Defaultio 与 JSON/Lua 输出均在高级模式。',
            helpAdvanced2: '点击 ⛶ 可放大预览，就地编辑并拖动空白处平移。',
            helpKeyboard: '键盘',
            helpKeyboard1: 'Esc — 关闭放大预览或此窗口。',
            helpKeyboard2: '点击模态框外部也可关闭。'
        },
        ar: {
            language: 'اللغة', theme: 'السمة', uiMode: 'الوضع',
            presets: 'الإعدادات المسبقة', selectPreset: '— اختر إعداداً مسبقاً —',
            save: 'حفظ', load: 'تحميل', rename: 'إعادة تسمية', delete: 'حذف',
            import: 'استيراد JSON', export: 'تصدير', exportAll: 'تصدير الكل',
            text: 'النص', userId: 'معرف المستخدم',
            solid: 'لون واحد', gradient: 'تدرج', rainbow: 'قوس قزح',
            colorSource: 'مصدر اللون', modeOption: 'الوضع (لون واحد / تدرج / قوس قزح)', gradientPoints: 'نقاط التدرج',
            outputFormat: 'صيغة الإخراج', robloxRichText: 'Roblox RichText (أصلي)', defaultioRichText: 'وحدة Defaultio RichText',
            color: 'اللون', color1: 'اللون 1', color2: 'اللون 2', steps: 'الخطوات',
            transparency: 'الشفافية', formatting: 'التنسيق',
            lineBreaks: 'فواصل الأسطر', fixColors: 'إصلاح الألوان', rgbColors: 'ألوان RGB',
            stroke: 'الحدود', strokeWidth: 'سماكة الحدود', font: 'الخط',
            animation: 'الحركة', none: 'بلا',
            animateGrouping: 'تجميع الحركة',
            groupLetter: 'حرف', groupWord: 'كلمة', groupAll: 'الكل',
            animateStepTime: 'زمن الخطوة (ث)',
            animateStepFrequency: 'تكرار الخطوة',
            animateStyleTime: 'مدة النمط (ث)',
            preview: 'معاينة', zoom: 'تكبير',
            richText: 'Rich Text', defaultioModule: 'نص وحدة Defaultio', jsonLua: 'JSON / Lua',
            copy: 'نسخ', copied: 'تم النسخ!',
            apply: 'تطبيق', resetColor: 'إعادة تعيين اللون', resetAllChars: 'إعادة تعيين الكل',
            deletePoint: 'حذف النقطة', resetAllPoints: 'إعادة تعيين كل النقاط',
            character: 'حرف', transparencyPlaceholder: 'الشفافية (اختياري، 0-1)',
            previewHint: 'انقر أو المس الحروف لتحديدها. اضغط مع السحب لتحديد عدة حروف. اسحب المساحة الفارغة للتحريك.',
            presetName: 'اسم الإعداد المسبق:', renamePreset: 'إعادة تسمية الإعداد إلى:',
            deletePreset: 'حذف الإعداد "{name}"?',
            presetExists: 'يوجد إعداد بهذا الاسم بالفعل. هل تريد الكتابة فوقه؟',
            importOk: 'تم استيراد {count} إعداد(ات).',
            importNoPresets: 'لم يتم العثور على إعدادات صالحة في ملف JSON هذا.',
            importFailed: 'فشل في تحليل ملف JSON.',
            exportSelectFirst: 'اختر إعداداً أولاً.',
            exportNoPresets: 'لا توجد إعدادات للتصدير.',
            dark: 'داكن', light: 'فاتح', simple: 'بسيط', advanced: 'متقدم',
            helpTitle: 'نصائح ومساعدة', helpGettingStarted: 'البدء',
            helpStart1: 'اكتب نصك في الحقل على اليسار.',
            helpStart2: 'تتحدث المعاينة على اليمين مباشرة.',
            helpStart3: 'انسخ الإخراج باستخدام أزرار النسخ.',
            helpSettings: 'الإعدادات',
            helpSettings1: 'استخدم محددات اللغة والسمة والوضع بجانب العنوان.',
            helpSettings2: 'الافتراضي هو السمة الداكنة والوضع البسيط. يتم حفظ اختياراتك.',
            helpSettings3: 'انتقل إلى الوضع المتقدم لكل الميزات.',
            helpPresets: 'الإعدادات المسبقة',
            helpPresets1: 'احفظ وحدد وأعد التسمية واحذف الإعدادات المسبقة.',
            helpPresets2: 'يتم تخزين الإعدادات محلياً في المتصفح.',
            helpPresets3: 'استيراد JSON — حمّل إعداداً واحداً أو عدة إعدادات من ملف .json. تصدير — نزّل الإعداد المحدد. تصدير الكل — نزّل جميع الإعدادات في ملف واحد.',
            helpAutoSave: 'الحفظ التلقائي',
            helpAutoSave1: 'يتم حفظ النص والألوان والإعدادات تلقائياً.',
            helpColorModes: 'أنماط الألوان',
            helpColorModes1: 'لون واحد — لون واحد لكامل النص.',
            helpColorModes2: 'تدرج — يمزج اللون 1 واللون 2 أفقياً.',
            helpColorModes3: 'قوس قزح — الطيف اللوني الكامل.',
            helpAdvanced: 'الميزات المتقدمة',
            helpAdvanced1: 'ألوان لكل حرف، نقاط التدرج، إخراج Defaultio و JSON/Lua في الوضع المتقدم.',
            helpAdvanced2: 'اضغط ⛶ لتوسيع المعاينة، والتحرير مباشرة مع سحب المساحة الفارغة للتحريك.',
            helpKeyboard: 'لوحة المفاتيح',
            helpKeyboard1: 'Esc — إغلاق المعاينة الموسعة أو هذه النافذة.',
            helpKeyboard2: 'النقر خارج النافذة يغلقها أيضاً.'
        },
        hi: {
            language: 'भाषा', theme: 'थीम', uiMode: 'मोड',
            presets: 'प्रीसेट', selectPreset: '— एक प्रीसेट चुनें —',
            save: 'सहेजें', load: 'लोड करें', rename: 'नाम बदलें', delete: 'हटाएं',
            import: 'JSON आयात करें', export: 'निर्यात करें', exportAll: 'सभी निर्यात करें',
            text: 'टेक्स्ट', userId: 'यूज़र आईडी',
            solid: 'ठोस', gradient: 'ग्रेडिएंट', rainbow: 'इंद्रधनुष',
            colorSource: 'रंग स्रोत', modeOption: 'मोड (ठोस / ग्रेडिएंट / इंद्रधनुष)', gradientPoints: 'ग्रेडिएंट पॉइंट',
            outputFormat: 'आउटपुट प्रारूप', robloxRichText: 'Roblox RichText (नेटिव)', defaultioRichText: 'Defaultio RichText मॉड्यूल',
            color: 'रंग', color1: 'रंग 1', color2: 'रंग 2', steps: 'चरण',
            transparency: 'पारदर्शिता', formatting: 'फॉर्मेटिंग',
            lineBreaks: 'लाइन ब्रेक', fixColors: 'रंग ठीक करें', rgbColors: 'RGB रंग',
            stroke: 'स्ट्रोक', strokeWidth: 'स्ट्रोक चौड़ाई', font: 'फ़ॉन्ट',
            animation: 'एनिमेशन', none: 'कोई नहीं',
            animateGrouping: 'एनिमेशन समूह',
            groupLetter: 'अक्षर', groupWord: 'शब्द', groupAll: 'सभी',
            animateStepTime: 'चरण समय (सेकंड)',
            animateStepFrequency: 'चरण आवृत्ति',
            animateStyleTime: 'शैली अवधि (सेकंड)',
            preview: 'पूर्वावलोकन', zoom: 'ज़ूम',
            richText: 'Rich Text', defaultioModule: 'Defaultio मॉड्यूल टेक्स्ट', jsonLua: 'JSON / Lua',
            copy: 'कॉपी', copied: 'कॉपी हो गया!',
            apply: 'लागू करें', resetColor: 'रंग रीसेट', resetAllChars: 'सभी रीसेट करें',
            deletePoint: 'पॉइंट हटाएं', resetAllPoints: 'सभी पॉइंट रीसेट करें',
            character: 'अक्षर', transparencyPlaceholder: 'पारदर्शिता (वैकल्पिक, 0-1)',
            previewHint: 'चुनने के लिए अक्षरों पर क्लिक या टैप करें। कई चुनने के लिए दबाकर खींचें। खाली जगह खींचकर हिलाएं।',
            presetName: 'प्रीसेट नाम:', renamePreset: 'प्रीसेट का नया नाम:',
            deletePreset: 'प्रीसेट "{name}" हटाएं?',
            presetExists: 'इस नाम का प्रीसेट पहले से है। अधिलेखित करें?',
            importOk: '{count} प्रीसेट आयात किए गए।',
            importNoPresets: 'इस JSON फ़ाइल में कोई मान्य प्रीसेट नहीं मिला।',
            importFailed: 'JSON फ़ाइल पढ़ने में विफल।',
            exportSelectFirst: 'पहले एक प्रीसेट चुनें।',
            exportNoPresets: 'निर्यात करने के लिए कोई प्रीसेट नहीं।',
            dark: 'डार्क', light: 'लाइट', simple: 'सरल', advanced: 'उन्नत',
            helpTitle: 'सुझाव और सहायता', helpGettingStarted: 'शुरू करें',
            helpStart1: 'बाईं ओर टेक्स्ट फ़ील्ड में अपना टेक्स्ट लिखें।',
            helpStart2: 'दाईं ओर पूर्वावलोकन लाइव अपडेट होता है।',
            helpStart3: 'कॉपी बटन से आउटपुट कॉपी करें।',
            helpSettings: 'सेटिंग्स',
            helpSettings1: 'शीर्षक के पास भाषा, थीम और मोड चयनकर्ता का उपयोग करें।',
            helpSettings2: 'डार्क और सरल डिफ़ॉल्ट हैं। आपकी पसंद सहेजी जाती है।',
            helpSettings3: 'सभी सुविधाओं के लिए उन्नत पर स्विच करें।',
            helpPresets: 'प्रीसेट',
            helpPresets1: 'बटनों से प्रीसेट सहेजें, लोड करें, नाम बदलें और हटाएं।',
            helpPresets2: 'प्रीसेट ब्राउज़र में स्थानीय रूप से संग्रहीत होते हैं।',
            helpPresets3: 'JSON आयात करें — .json फ़ाइल से एक या कई प्रीसेट लोड करें। निर्यात करें — चयनित प्रीसेट डाउनलोड करें। सभी निर्यात करें — सभी प्रीसेट एक फ़ाइल में डाउनलोड करें।',
            helpAutoSave: 'स्वतः सहेजें',
            helpAutoSave1: 'टेक्स्ट, रंग और सेटिंग्स स्वतः सहेजे जाते हैं।',
            helpColorModes: 'रंग मोड',
            helpColorModes1: 'ठोस — पूरे टेक्स्ट के लिए एक रंग।',
            helpColorModes2: 'ग्रेडिएंट — रंग 1 और रंग 2 के बीच क्षैतिज मिश्रण।',
            helpColorModes3: 'इंद्रधनुष — पूरा रंग स्पेक्ट्रम।',
            helpAdvanced: 'उन्नत सुविधाएँ',
            helpAdvanced1: 'अक्षर-वार रंग, ग्रेडिएंट पॉइंट, Defaultio और JSON/Lua उन्नत मोड में।',
            helpAdvanced2: 'पूर्वावलोकन बड़ा करने के लिए ⛶ दबाएं, वहीं संपादित करें और खाली जगह खींचकर घुमाएँ।',
            helpKeyboard: 'कीबोर्ड',
            helpKeyboard1: 'Esc — विस्तारित पूर्वावलोकन या यह विंडो बंद करें।',
            helpKeyboard2: 'मोडल के बाहर क्लिक करने से भी बंद हो जाता है।'
        }
    };

    let currentLang = 'en';
    let currentTheme = 'dark';
    let currentUiMode = 'simple';

    function t(key) {
        const dict = translations[currentLang] || translations.en;
        if (dict[key] !== undefined) return dict[key];
        return translations.en[key] !== undefined ? translations.en[key] : key;
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
        });
    }

    function applyTheme(theme) {
        currentTheme = (theme === 'light') ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (elements.themeSelect) elements.themeSelect.value = currentTheme;
    }

    function applyUiMode(mode) {
        currentUiMode = (mode === 'advanced') ? 'advanced' : 'simple';
        if (elements.uiModeSelect) elements.uiModeSelect.value = currentUiMode;
        document.querySelectorAll('.advanced-only').forEach(el => {
            el.classList.toggle('hidden-for-mode', currentUiMode !== 'advanced');
        });
        toggleDefaultioControls();
    }

    function applyLanguage(lang) {
        currentLang = (translations[lang] ? lang : 'en');
        document.documentElement.setAttribute('lang', currentLang);
        document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        if (elements.languageSelect) elements.languageSelect.value = currentLang;
        applyTranslations();
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify({
                lang: currentLang,
                theme: currentTheme,
                uiMode: currentUiMode
            }));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function isPreviewOpen() {
        return elements.previewOverlay && !elements.previewOverlay.classList.contains('hidden');
    }

    function placeEditorsIn(host) {
        if (!host) return;
        if (elements.charEditor && elements.charEditor.parentElement !== host) {
            host.appendChild(elements.charEditor);
        }
        if (elements.pointsEditor && elements.pointsEditor.parentElement !== host) {
            host.appendChild(elements.pointsEditor);
        }
    }

    function refreshEditorHost() {
        const host = isPreviewOpen() ? elements.editorHostModal : elements.editorHostMain;
        placeEditorsIn(host);
    }

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
                const t2 = (index - a) / (b - a);
                const c1 = hexToRgb(gradientPoints[a]);
                const c2 = hexToRgb(gradientPoints[b]);
                if (!c1 || !c2) return gradientPoints[a];
                const mixed = lerpColor(c1, c2, t2);
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
                const t2 = (index - a) / (b - a);
                return lerp(ta, tb, t2);
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

    function makeRainbowIndexer(rawText) {
        const total = rawText.length;
        if (total === 0) return () => null;
        return (i) => {
            const tt = total === 1 ? 0 : i / (total - 1);
            const rgb = hsvToRgb(tt * 360, 1, 1);
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        };
    }

    function colorForIndexFactory(rawText, options) {
        const { mode, solidColor, gradientColors, usePoints } = options;

        const gradientIndexer = (mode === 'gradient' && gradientColors.length)
            ? makeGradientIndexer(rawText, gradientColors)
            : null;

        const rainbowIndexer = (mode === 'rainbow')
            ? makeRainbowIndexer(rawText)
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

            if (rainbowIndexer) return rainbowIndexer(i);

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

    // ===== Point markers =====
    // Маркеры рендерятся в отдельном слое — на .preview-wrap (для маленького)
    // и .preview-modal-body (для большого). Так они не зависят от transform
    // самого текста и всегда позиционируются через getBoundingClientRect.
    function getMarkerLayerFor(targetEl) {
        if (targetEl === elements.previewLarge) return elements.previewModalBody;
        if (elements.preview && elements.preview.parentElement) {
            return elements.preview.parentElement;
        }
        return null;
    }

    function refreshPointMarkers() {
        const usePoints = elements.colorSource.value === 'points' && getSortedPointIndexes().length > 0;

        const targets = [
            { textEl: elements.preview, layer: getMarkerLayerFor(elements.preview) },
            { textEl: elements.previewLarge, layer: getMarkerLayerFor(elements.previewLarge) }
        ];

        targets.forEach(({ textEl, layer }) => {
            if (!textEl || !layer) return;

            layer.querySelectorAll('.point-marker[data-owner="' + (textEl.id || 'preview') + '"]').forEach(m => m.remove());

            if (!usePoints) return;

            const layerRect = layer.getBoundingClientRect();

            Object.keys(gradientPoints).map(Number).sort((a, b) => a - b).forEach(idx => {
                const span = textEl.querySelector(`.char[data-index="${idx}"]`);
                if (!span) return;
                const spanRect = span.getBoundingClientRect();
                const marker = document.createElement('div');
                marker.className = 'point-marker';
                marker.dataset.owner = textEl.id || 'preview';
                if (selectedPoint === idx) marker.classList.add('selected');
                marker.style.background = gradientPoints[idx];
                marker.style.left = (spanRect.left - layerRect.left + spanRect.width / 2) + 'px';
                marker.style.top = (spanRect.top - layerRect.top - 8) + 'px';
                layer.appendChild(marker);
            });
        });
    }

    function renderInto(targetEl, rawText, enableLineBreaks, opts) {
        const frag = document.createDocumentFragment();
        const cells = buildCharCells(rawText, enableLineBreaks);
        const colorFn = opts.colorFn;
        const globalTrans = opts.trans;
        const usePoints = opts.usePoints;

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

            const t2 = transparencyForIndex(cell.index, globalTrans, usePoints);
            if (t2 > 0) textSpan.style.opacity = String(1 - t2);

            span.appendChild(textSpan);

            if (charColors[cell.index]) span.classList.add('has-color');

            if (selectedChars.has(cell.index)) span.classList.add('selected');
            if (selectedPoint === cell.index) span.classList.add('selected-point');

            frag.appendChild(span);
        });

        targetEl.innerHTML = '';
        targetEl.appendChild(frag);
        targetEl.style.fontFamily = opts.font;
        targetEl.style.fontWeight = opts.bold ? 'bold' : 'normal';
        targetEl.style.fontStyle = opts.italic ? 'italic' : 'normal';
        targetEl.style.textDecoration = opts.underline ? 'underline'
            : opts.strikethrough ? 'line-through' : 'none';

        targetEl.classList.toggle('points-mode', usePoints);
    }

    function renderPreview(rawText, enableLineBreaks, opts) {
        if (elements.preview) renderInto(elements.preview, rawText, enableLineBreaks, opts);
        if (elements.previewLarge) renderInto(elements.previewLarge, rawText, enableLineBreaks, opts);
    }

    let isMouseDown = false;
    let dragMode = null;

    function setSelection(indexes) {
        selectedChars = new Set(indexes);
        [elements.preview, elements.previewLarge].forEach(p => {
            if (!p) return;
            p.querySelectorAll('.char').forEach(el => {
                el.classList.toggle('selected', selectedChars.has(Number(el.dataset.index)));
            });
        });
        updateCharEditor();
    }

    function setSelectedPoint(index) {
        selectedPoint = index;
        updatePointsEditor();
        [elements.preview, elements.previewLarge].forEach(p => {
            if (!p) return;
            p.querySelectorAll('.char').forEach(el => {
                el.classList.toggle('selected-point', Number(el.dataset.index) === selectedPoint);
            });
        });
        document.querySelectorAll('.point-marker').forEach(m => m.classList.remove('selected'));
        refreshPointMarkers();
    }

    function updateCharEditor() {
        if (selectedChars.size === 0) {
            elements.charEditor.classList.add('hidden');
            return;
        }
        refreshEditorHost();
        elements.charEditor.classList.remove('hidden');

        const arr = [...selectedChars].sort((a, b) => a - b);
        const raw = elements.textInput.value;
        const chars = arr.map(i => raw[i] === '\n' ? '⏎' : raw[i]).join('');
        const preview = chars.length > 20 ? chars.slice(0, 20) + '…' : chars;
        elements.charEditorTitle.textContent =
            arr.length === 1
                ? `${t('character')}: "${raw[arr[0]] === '\n' ? '⏎' : raw[arr[0]] || ''}"`
                : `${arr.length} (${preview})`;

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
        refreshEditorHost();
        elements.pointsEditor.classList.remove('hidden');

        if (selectedPoint === null || gradientPoints[selectedPoint] === undefined) {
            const count = Object.keys(gradientPoints).length;
            elements.pointsEditorTitle.textContent = count > 0
                ? `${t('gradientPoints')} (${count})`
                : t('gradientPoints');
            elements.pointTransparency.value = '';
            return;
        }

        const raw = elements.textInput.value;
        const ch = raw[selectedPoint] === '\n' ? '⏎' : (raw[selectedPoint] || '');
        elements.pointsEditorTitle.textContent = `${t('gradientPoints')} "${ch}" (#${selectedPoint})`;
        const c = gradientPoints[selectedPoint];
        elements.pointColor.value = c;
        elements.pointColorHex.value = c;

        const t2 = gradientPointTransparency[selectedPoint];
        elements.pointTransparency.value = (t2 !== undefined) ? String(roundTransparency(t2)) : '';
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

    let touchStartIndex = null;
    let touchDragMode = null;
    let touchCurrentIndex = null;

    function attachPreviewHandlers(el) {
        if (!el) return;

        el.addEventListener('mousedown', e => {
            const target = e.target.closest('.char');
            if (!target) return;
            const idx = Number(target.dataset.index);

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

        el.addEventListener('mouseover', e => {
            if (!isMouseDown) return;
            if (elements.colorSource.value === 'points') return;
            const target = e.target.closest('.char');
            if (!target) return;
            const idx = Number(target.dataset.index);
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

        el.addEventListener('touchstart', e => {
            const target = e.target.closest('.char');
            if (!target) return;
            const idx = Number(target.dataset.index);

            if (elements.colorSource.value === 'points') {
                handlePointClick(idx);
                e.preventDefault();
                return;
            }

            touchStartIndex = idx;
            touchCurrentIndex = idx;

            if (selectedChars.has(idx) && selectedChars.size === 1) {
                touchDragMode = null;
                const s = new Set(selectedChars);
                s.delete(idx);
                setSelection([...s]);
            } else {
                touchDragMode = selectedChars.has(idx) ? 'remove' : 'add';
                if (touchDragMode === 'add') {
                    setSelection([...selectedChars, idx]);
                } else {
                    const s = new Set(selectedChars);
                    s.delete(idx);
                    setSelection([...s]);
                }
            }

            e.preventDefault();
        }, { passive: false });

        el.addEventListener('touchmove', e => {
            if (touchStartIndex === null) return;
            if (elements.colorSource.value === 'points') return;

            const touch = e.touches[0];
            if (!touch) return;

            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            if (!target) return;
            const charEl = target.closest('.char');
            if (!charEl || !el.contains(charEl)) return;

            const idx = Number(charEl.dataset.index);
            if (idx === touchCurrentIndex) return;
            touchCurrentIndex = idx;

            if (touchDragMode === 'add') {
                if (!selectedChars.has(idx)) setSelection([...selectedChars, idx]);
            } else if (touchDragMode === 'remove') {
                if (selectedChars.has(idx)) {
                    const s = new Set(selectedChars);
                    s.delete(idx);
                    setSelection([...s]);
                }
            }

            e.preventDefault();
        }, { passive: false });

        el.addEventListener('touchend', () => {
            touchStartIndex = null;
            touchDragMode = null;
            touchCurrentIndex = null;
        });

        el.addEventListener('touchcancel', () => {
            touchStartIndex = null;
            touchDragMode = null;
            touchCurrentIndex = null;
        });
    }

    attachPreviewHandlers(elements.preview);
    attachPreviewHandlers(elements.previewLarge);

    document.addEventListener('mouseup', () => { isMouseDown = false; dragMode = null; });

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
            const t2 = Number(transRaw);
            selectedChars.forEach(i => {
                charColors[i] = color;
                charTransparency[i] = t2;
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
                    const t2 = transFn(i);
                    pushChar(' ', c, t2);
                }
                continue;
            }
            const color = colorFn(i);
            const t2 = transFn(i);
            pushChar(ch, color, t2);
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
                'horizontal'
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
                            else groupInner += `<font color='${formatColor(item.color)}'>${p}</font>`;
                        });
                    } else {
                        groupInner += `<font color='${formatColor(item.color)}'>${item.text}</font>`;
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

        const formattedInner = inner
            .split('<br/>')
            .map(part => part === '' ? '' : applyFormatting(part, formatting))
            .join('<br/>');

        const globalTransAttr = trans > 0 ? ` transparency='${roundTransparency(trans)}'` : '';
        const openFont = `<font face='${font}'${globalTransAttr}>`;
        const hasStroke = thickness > 0;
        const openStroke = hasStroke ? `<stroke color='${formatColor(stroke)}' thickness='${thickness}'>` : '';
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

        refreshPointMarkers();

        updatePointsEditor();
        saveState();
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

    function syncGradientTypeFromMode() {
        const modeValue = elements.colorMode.value;
        if (modeValue === 'rainbow') {
            elements.gradientType.value = 'rainbow';
        } else if (modeValue === 'gradient') {
            elements.gradientType.value = 'horizontal';
        }
    }

    function toggleGradientColorControls() {
        const isRainbow = elements.colorMode.value === 'rainbow';
        const color1Group = elements.gradientColor1.closest('.control-group');
        const color2Group = elements.gradientColor2.closest('.control-group');

        if (color1Group) color1Group.style.display = isRainbow ? 'none' : 'block';
        if (color2Group) color2Group.style.display = isRainbow ? 'none' : 'block';
    }

    function toggleDefaultioControls() {
        const isDefaultio = elements.outputFormat.value === 'defaultio';
        const isAdvanced = currentUiMode === 'advanced';
        const groups = [
            elements.defaultioControls,
            elements.defaultioGroupingGroup,
            elements.defaultioStepTimeGroup,
            elements.defaultioStepFreqGroup,
            elements.defaultioStyleTimeGroup
        ];
        groups.forEach(el => {
            if (!el) return;
            el.style.display = (isDefaultio && isAdvanced) ? 'block' : 'none';
        });

        if (elements.outputDefaultioSection) {
            elements.outputDefaultioSection.style.display = (isDefaultio && isAdvanced) ? 'block' : 'none';
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
            syncGradientTypeFromMode();
            generate();
            return;
        }
        const isSolid = this.value === 'solid';
        elements.solidControls.classList.toggle('hidden', !isSolid);
        elements.gradientControls.style.display = isSolid ? 'none' : 'block';
        if (!isSolid) setTimeout(() => elements.gradientControls.classList.add('active'), 10);
        syncGradientTypeFromMode();
        toggleGradientColorControls();
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

    ['bold', 'italic', 'underline', 'strikethrough', 'lineBreaks', 'fixColors', 'rgbColors'].forEach(id => {
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

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const textarea = document.getElementById(this.dataset.target);
            if (!textarea) return;

            textarea.select();
            document.execCommand('copy');

            const originalText = this.textContent;
            this.textContent = t('copied');
            this.classList.add('copied');

            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('copied');
            }, 2000);
        });
    });

    elements.colorMode.value = 'gradient';
    syncGradientTypeFromMode();
    elements.solidControls.classList.add('hidden');
    elements.gradientControls.style.display = 'block';
    setTimeout(() => elements.gradientControls.classList.add('active'), 10);
    elements.fixColors.checked = false;

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

    function openPreview() {
        if (!elements.previewOverlay) return;
        elements.previewOverlay.classList.remove('hidden');
        resetPan();
        refreshEditorHost();
        generate();
    }
    function closePreview() {
        if (!elements.previewOverlay) return;
        elements.previewOverlay.classList.add('hidden');
        resetPan();
        refreshEditorHost();
        generate();
    }

    if (elements.previewExpandBtn) {
        elements.previewExpandBtn.addEventListener('click', openPreview);
    }
    if (elements.previewClose) {
        elements.previewClose.addEventListener('click', closePreview);
    }
    if (elements.previewOverlay) {
        elements.previewOverlay.addEventListener('click', (e) => {
            if (e.target === elements.previewOverlay) closePreview();
        });
    }

    // ===== Zoom =====
    let zoomRafHandle = null;
    let zoomTimeoutHandle = null;

    function refreshMarkersAfterReflow() {
        if (elements.previewLarge) void elements.previewLarge.offsetWidth;
        if (elements.preview) void elements.preview.offsetWidth;
        refreshPointMarkers();

        if (zoomRafHandle !== null) cancelAnimationFrame(zoomRafHandle);
        zoomRafHandle = requestAnimationFrame(() => {
            zoomRafHandle = null;
            if (elements.previewLarge) void elements.previewLarge.offsetWidth;
            if (elements.preview) void elements.preview.offsetWidth;
            refreshPointMarkers();
        });

        if (zoomTimeoutHandle !== null) clearTimeout(zoomTimeoutHandle);
        zoomTimeoutHandle = setTimeout(() => {
            zoomTimeoutHandle = null;
            if (elements.previewLarge) void elements.previewLarge.offsetWidth;
            if (elements.preview) void elements.preview.offsetWidth;
            refreshPointMarkers();
        }, 500);
    }

    function applyPreviewZoom(z) {
        const min = elements.previewZoom ? parseFloat(elements.previewZoom.min) : 0.5;
        const max = elements.previewZoom ? parseFloat(elements.previewZoom.max) : 4;
        z = Math.max(min, Math.min(max, z));
        if (elements.previewZoom) elements.previewZoom.value = z.toFixed(1);
        if (elements.previewZoomValue) elements.previewZoomValue.textContent = z.toFixed(1) + 'x';
        if (elements.previewLarge) {
            elements.previewLarge.style.fontSize = (24 * z) + 'px';
        }
        refreshMarkersAfterReflow();
        return z;
    }

    if (elements.previewZoom) {
        elements.previewZoom.addEventListener('input', () => {
            applyPreviewZoom(parseFloat(elements.previewZoom.value));
        });
    }

    if (elements.previewModalBody) {
        elements.previewModalBody.addEventListener('wheel', (e) => {
            if (elements.previewOverlay && elements.previewOverlay.classList.contains('hidden')) return;
            if (!elements.previewModalBody.contains(e.target)) return;

            e.preventDefault();

            const current = elements.previewZoom ? parseFloat(elements.previewZoom.value) : 1.5;
            const step = 0.1;
            const direction = e.deltaY < 0 ? 1 : -1;
            const next = current + direction * step;

            applyPreviewZoom(next);
        }, { passive: false });
    }

    // ===== Pan =====
    const PAN_LIMIT = 500;
    const PAN_TAP_THRESHOLD = 5;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let panStartOffsetX = 0;
    let panStartOffsetY = 0;
    let panMoved = false;

    function applyPan() {
        if (!elements.previewLarge) return;
        const px = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panX));
        const py = Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, panY));
        panX = px;
        panY = py;
        elements.previewLarge.style.transform = `translate(${px}px, ${py}px)`;
        refreshPointMarkers();
    }

    function resetPan() {
        panX = 0;
        panY = 0;
        if (elements.previewLarge) {
            elements.previewLarge.style.transform = '';
        }
        refreshPointMarkers();
    }

    function startPan(clientX, clientY) {
        isPanning = true;
        panMoved = false;
        panStartX = clientX;
        panStartY = clientY;
        panStartOffsetX = panX;
        panStartOffsetY = panY;
    }

    function movePan(clientX, clientY) {
        if (!isPanning) return;
        const dx = clientX - panStartX;
        const dy = clientY - panStartY;
        if (!panMoved && Math.abs(dx) + Math.abs(dy) < PAN_TAP_THRESHOLD) {
            return;
        }
        if (!panMoved) {
            panMoved = true;
            if (elements.previewModalBody) {
                elements.previewModalBody.classList.add('panning');
            }
        }
        panX = panStartOffsetX + dx;
        panY = panStartOffsetY + dy;
        applyPan();
    }

    function endPan() {
        isPanning = false;
        panMoved = false;
        if (elements.previewModalBody) {
            elements.previewModalBody.classList.remove('panning');
        }
    }

    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    function maybeResetPanFromTap(clientX, clientY) {
        const now = Date.now();
        const timeDiff = now - lastTapTime;
        const dist = Math.abs(clientX - lastTapX) + Math.abs(clientY - lastTapY);
        if (timeDiff < 300 && dist < 30) {
            resetPan();
            lastTapTime = 0;
            return;
        }
        lastTapTime = now;
        lastTapX = clientX;
        lastTapY = clientY;
    }

    if (elements.previewModalBody) {
        elements.previewModalBody.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.char')) return;
            startPan(e.clientX, e.clientY);
            e.preventDefault();
        });

        elements.previewModalBody.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.char')) return;
            e.preventDefault();
        });

        elements.previewModalBody.addEventListener('touchstart', (e) => {
            if (e.target.closest('.char')) return;
            const touch = e.touches[0];
            if (!touch) return;
            startPan(touch.clientX, touch.clientY);
        }, { passive: true });

        elements.previewModalBody.addEventListener('dblclick', (e) => {
            if (e.target.closest('.char')) return;
            resetPan();
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        movePan(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) endPan();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isPanning) return;
        const touch = e.touches[0];
        if (!touch) return;
        movePan(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!isPanning) return;
        if (!panMoved) {
            const touch = e.changedTouches && e.changedTouches[0];
            if (touch) maybeResetPanFromTap(touch.clientX, touch.clientY);
        }
        endPan();
    });

    document.addEventListener('touchcancel', () => {
        if (isPanning) endPan();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.helpOverlay && !elements.helpOverlay.classList.contains('hidden')) {
                closeHelp();
                return;
            }
            if (elements.previewOverlay && !elements.previewOverlay.classList.contains('hidden')) {
                closePreview();
                return;
            }
        }
    });

    window.addEventListener('resize', () => {
        generate();
    });

    const STATE_KEY = 'richTextGenState';
    const PRESETS_KEY = 'richTextGenPresets';

    function collectState() {
        return {
            text: elements.textInput.value,
            userId: elements.userId.value,
            colorMode: elements.colorMode.value,
            colorSource: elements.colorSource.value,
            outputFormat: elements.outputFormat.value,
            textColor: elements.textColor.value,
            gradientColor1: elements.gradientColor1.value,
            gradientColor2: elements.gradientColor2.value,
            gradientType: elements.gradientType.value,
            gradientSteps: elements.gradientSteps.value,
            transparency: elements.transparency.value,
            bold: elements.bold.checked,
            italic: elements.italic.checked,
            underline: elements.underline.checked,
            strikethrough: elements.strikethrough.checked,
            lineBreaks: elements.lineBreaks.checked,
            fixColors: elements.fixColors.checked,
            rgbColors: elements.rgbColors.checked,
            strokeColor: elements.strokeColor.value,
            strokeThickness: elements.strokeThickness.value,
            fontFamily: elements.fontFamily.value,
            charColors: charColors,
            charTransparency: charTransparency,
            gradientPoints: gradientPoints,
            gradientPointTransparency: gradientPointTransparency,
            animateStyle: elements.animateStyle.value,
            animateGrouping: elements.animateGrouping.value,
            animateStepTime: elements.animateStepTime.value,
            animateStepFrequency: elements.animateStepFrequency.value,
            animateStyleTime: elements.animateStyleTime.value,
            previewZoom: elements.previewZoom ? elements.previewZoom.value : '1.5'
        };
    }

    function applyState(s) {
        if (!s || typeof s !== 'object') return;
        try {
            if (typeof s.text === 'string') elements.textInput.value = s.text;
            if (typeof s.userId === 'string') elements.userId.value = s.userId;

            if (s.colorMode) {
                elements.colorMode.value = s.colorMode;
                syncGradientTypeFromMode();
            }
            if (s.colorSource) elements.colorSource.value = s.colorSource;
            if (s.outputFormat) elements.outputFormat.value = s.outputFormat;

            if (s.textColor) {
                elements.textColor.value = s.textColor;
                elements.textColorHex.value = s.textColor;
            }
            if (s.gradientColor1) {
                elements.gradientColor1.value = s.gradientColor1;
                elements.gradientColor1Hex.value = s.gradientColor1;
            }
            if (s.gradientColor2) {
                elements.gradientColor2.value = s.gradientColor2;
                elements.gradientColor2Hex.value = s.gradientColor2;
            }
            if (s.gradientSteps !== undefined) {
                elements.gradientSteps.value = s.gradientSteps;
                elements.gradientStepsValue.textContent = s.gradientSteps;
            }
            if (s.transparency !== undefined) {
                elements.transparency.value = s.transparency;
                elements.transparencyValue.textContent = s.transparency;
            }

            elements.bold.checked = !!s.bold;
            elements.italic.checked = !!s.italic;
            elements.underline.checked = !!s.underline;
            elements.strikethrough.checked = !!s.strikethrough;
            elements.lineBreaks.checked = !!s.lineBreaks;
            elements.fixColors.checked = !!s.fixColors;
            elements.rgbColors.checked = !!s.rgbColors;

            if (s.strokeColor) {
                elements.strokeColor.value = s.strokeColor;
                elements.strokeColorHex.value = s.strokeColor;
            }
            if (s.strokeThickness !== undefined) {
                elements.strokeThickness.value = s.strokeThickness;
                elements.strokeThicknessValue.textContent = s.strokeThickness;
            }
            if (s.fontFamily) elements.fontFamily.value = s.fontFamily;

            charColors = (s.charColors && typeof s.charColors === 'object') ? { ...s.charColors } : {};
            charTransparency = (s.charTransparency && typeof s.charTransparency === 'object') ? { ...s.charTransparency } : {};
            gradientPoints = (s.gradientPoints && typeof s.gradientPoints === 'object') ? { ...s.gradientPoints } : {};
            gradientPointTransparency = (s.gradientPointTransparency && typeof s.gradientPointTransparency === 'object') ? { ...s.gradientPointTransparency } : {};

            if (s.animateStyle !== undefined) elements.animateStyle.value = s.animateStyle;
            if (s.animateGrouping !== undefined) elements.animateGrouping.value = s.animateGrouping;
            if (s.animateStepTime !== undefined) {
                elements.animateStepTime.value = s.animateStepTime;
                elements.animateStepTimeValue.textContent = s.animateStepTime;
            }
            if (s.animateStepFrequency !== undefined) elements.animateStepFrequency.value = s.animateStepFrequency;
            if (s.animateStyleTime !== undefined) {
                elements.animateStyleTime.value = s.animateStyleTime;
                elements.animateStyleTimeValue.textContent = s.animateStyleTime;
            }
            if (s.previewZoom !== undefined && elements.previewZoom) {
                elements.previewZoom.value = s.previewZoom;
                const z = parseFloat(s.previewZoom);
                if (elements.previewZoomValue) elements.previewZoomValue.textContent = z.toFixed(1) + 'x';
                if (elements.previewLarge) elements.previewLarge.style.fontSize = (24 * z) + 'px';
            }
        } catch (e) {
            console.warn('Failed to apply state', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STATE_KEY, JSON.stringify(collectState()));
        } catch (e) {
            console.warn('Failed to save state', e);
        }
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STATE_KEY);
            if (!raw) return false;
            const s = JSON.parse(raw);
            applyState(s);
            return true;
        } catch (e) {
            console.warn('Failed to load state', e);
            return false;
        }
    }

    function loadPresets() {
        try {
            const raw = localStorage.getItem(PRESETS_KEY);
            if (!raw) return {};
            const obj = JSON.parse(raw);
            return (obj && typeof obj === 'object') ? obj : {};
        } catch (e) {
            console.warn('Failed to load presets', e);
            return {};
        }
    }

    function savePresets(presets) {
        try {
            localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        } catch (e) {
            console.warn('Failed to save presets', e);
        }
    }

    function refreshPresetSelect() {
        const presets = loadPresets();
        const current = elements.presetSelect.value;
        elements.presetSelect.innerHTML = '';
        elements.presetSelect.appendChild(new Option(t('selectPreset'), ''));
        Object.keys(presets).sort((a, b) => a.localeCompare(b)).forEach(name => {
            elements.presetSelect.appendChild(new Option(name, name));
        });
        if (current && presets[current]) {
            elements.presetSelect.value = current;
        }
    }

    // ===== Preset import / export =====
    function downloadJson(filename, data) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function sanitizeFilename(name) {
        return String(name).replace(/[^a-zA-Z0-9_\-]+/g, '_').slice(0, 60) || 'preset';
    }

    function parseImportedPresets(data, fallbackName) {
        const result = {};
        if (!data || typeof data !== 'object') return result;

        // Case 1: single preset as { name: "X", state: {...} }
        if (data.name && data.state && typeof data.state === 'object') {
            result[String(data.name)] = data.state;
            return result;
        }

        // Case 2: single state object with known keys
        const knownKeys = ['text', 'colorMode', 'colorSource', 'outputFormat', 'fontFamily', 'charColors', 'gradientPoints'];
        const hasAnyKnownKey = knownKeys.some(k => data[k] !== undefined);
        if (hasAnyKnownKey) {
            result[fallbackName || 'Imported'] = data;
            return result;
        }

        // Case 3: object of multiple presets: { "Name1": {...}, "Name2": {...} }
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value && typeof value === 'object') {
                if (value.state && typeof value.state === 'object') {
                    result[key] = value.state;
                } else {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    if (elements.presetImport) {
        elements.presetImport.addEventListener('click', () => {
            if (elements.presetFileInput) {
                elements.presetFileInput.value = '';
                elements.presetFileInput.click();
            }
        });
    }

    if (elements.presetFileInput) {
        elements.presetFileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    const fallbackName = file.name.replace(/\.json$/i, '') || 'Imported';
                    const parsed = parseImportedPresets(data, fallbackName);
                    const keys = Object.keys(parsed);
                    if (keys.length === 0) {
                        alert(t('importNoPresets'));
                        return;
                    }
                    const presets = loadPresets();
                    let overwritten = 0;
                    keys.forEach(name => {
                        if (presets[name]) overwritten++;
                    });
                    if (overwritten > 0) {
                        if (!confirm(t('presetExists') + ` (${overwritten})`)) {
                            // Отменяем перезапись, но продолжаем с добавлением
                        }
                    }
                    keys.forEach(name => {
                        presets[name] = parsed[name];
                    });
                    savePresets(presets);
                    refreshPresetSelect();
                    if (keys.length === 1) {
                        elements.presetSelect.value = keys[0];
                    }
                    alert(t('importOk').replace('{count}', keys.length));
                } catch (err) {
                    console.warn('Failed to parse preset JSON', err);
                    alert(t('importFailed'));
                }
            };
            reader.readAsText(file);
        });
    }

    if (elements.presetExport) {
        elements.presetExport.addEventListener('click', () => {
            const name = elements.presetSelect.value;
            if (!name) {
                alert(t('exportSelectFirst'));
                return;
            }
            const presets = loadPresets();
            if (!presets[name]) return;
            const payload = {
                name: name,
                state: presets[name]
            };
            downloadJson(sanitizeFilename(name) + '.json', payload);
        });
    }

    if (elements.presetExportAll) {
        elements.presetExportAll.addEventListener('click', () => {
            const presets = loadPresets();
            const keys = Object.keys(presets);
            if (keys.length === 0) {
                alert(t('exportNoPresets'));
                return;
            }
            downloadJson('richTextGenPresets.json', presets);
        });
    }

    elements.presetSave.addEventListener('click', () => {
        const rawName = prompt(t('presetName'), '');
        if (rawName === null) return;
        const name = rawName.trim();
        if (!name) return;
        const presets = loadPresets();
        presets[name] = collectState();
        savePresets(presets);
        refreshPresetSelect();
        elements.presetSelect.value = name;
    });

    elements.presetLoad.addEventListener('click', () => {
        const name = elements.presetSelect.value;
        if (!name) return;
        const presets = loadPresets();
        if (!presets[name]) return;
        applyState(presets[name]);
        toggleGradientColorControls();
        toggleDefaultioControls();
        toggleColorSourceControls();
        generate();
    });

    elements.presetRename.addEventListener('click', () => {
        const name = elements.presetSelect.value;
        if (!name) return;
        const rawNew = prompt(t('renamePreset'), name);
        if (rawNew === null) return;
        const newName = rawNew.trim();
        if (!newName || newName === name) return;
        const presets = loadPresets();
        if (!presets[name]) return;
        if (presets[newName] && !confirm(t('presetExists'))) return;
        presets[newName] = presets[name];
        delete presets[name];
        savePresets(presets);
        refreshPresetSelect();
        elements.presetSelect.value = newName;
    });

    elements.presetDelete.addEventListener('click', () => {
        const name = elements.presetSelect.value;
        if (!name) return;
        if (!confirm(t('deletePreset').replace('{name}', name))) return;
        const presets = loadPresets();
        delete presets[name];
        savePresets(presets);
        refreshPresetSelect();
        elements.presetSelect.value = '';
    });

    if (elements.languageSelect) {
        elements.languageSelect.addEventListener('change', function () {
            applyLanguage(this.value);
            saveSettings();
            refreshPresetSelect();
        });
    }
    if (elements.themeSelect) {
        elements.themeSelect.addEventListener('change', function () {
            applyTheme(this.value);
            saveSettings();
        });
    }
    if (elements.uiModeSelect) {
        elements.uiModeSelect.addEventListener('change', function () {
            applyUiMode(this.value);
            saveSettings();
        });
    }

    const savedSettings = loadSettings() || {};
    applyLanguage(savedSettings.lang || 'en');
    applyTheme(savedSettings.theme || 'dark');
    applyUiMode(savedSettings.uiMode || 'simple');

    loadState();
    refreshPresetSelect();

    if (elements.previewLarge) {
        const initialZoom = elements.previewZoom ? parseFloat(elements.previewZoom.value) : 1.5;
        elements.previewLarge.style.fontSize = (24 * initialZoom) + 'px';
        if (elements.previewZoomValue) elements.previewZoomValue.textContent = initialZoom.toFixed(1) + 'x';
    }

    refreshEditorHost();

    toggleGradientColorControls();
    toggleDefaultioControls();
    toggleColorSourceControls();

    generate();
});
