const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, 'svgs');

// Lire tous les fichiers SVG
fs.readdirSync(svgDir).filter(f => f.endsWith('.svg')).forEach(file => {
    const filePath = path.join(svgDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Extraire les attributs width, height et viewBox
    const widthMatch = content.match(/width="([^"]+)"/);
    const heightMatch = content.match(/height="([^"]+)"/);
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);

    let width = widthMatch ? widthMatch[1].replace('px', '') : '100';
    let height = heightMatch ? heightMatch[1].replace('px', '') : '100';
    let viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${width} ${height}`;

    // Normaliser: utiliser une viewBox standard 0 0 100 100
    content = content.replace(/width="[^"]+"/, 'width="100"');
    content = content.replace(/height="[^"]+"/, 'height="100"');
    content = content.replace(/viewBox="[^"]+"/, 'viewBox="0 0 100 100"');

    // Ajouter preserveAspectRatio si absent
    if (!content.includes('preserveAspectRatio')) {
        content = content.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Normalized: ${file}`);
});

console.log('All SVGs normalized!');
