// Script para gerar ícones SVG da extensão
// Execute com: node generate-svg-icons.js

const fs = require('fs');

function generateSVG(size, minutes = null) {
  const clockRadius = size * 0.35;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = size * 0.08;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background com bordas arredondadas -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad-${size})"/>
  
  <!-- Círculo do relógio -->
  <circle cx="${centerX}" cy="${centerY}" r="${clockRadius}" fill="none" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  
  <!-- Ponteiro das horas -->
  <line x1="${centerX}" y1="${centerY}" x2="${centerX - clockRadius * 0.3}" y2="${centerY - clockRadius * 0.4}" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  
  <!-- Ponteiro dos minutos -->
  <line x1="${centerX}" y1="${centerY}" x2="${centerX + clockRadius * 0.1}" y2="${centerY - clockRadius * 0.6}" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  
  <!-- Ponto central -->
  <circle cx="${centerX}" cy="${centerY}" r="${size * 0.05}" fill="white"/>`;

  // Badge com minutos
  if (minutes !== null && size >= 32) {
    const badgeSize = size * 0.4;
    const badgeX = size - badgeSize * 0.7;
    const badgeY = size - badgeSize * 0.7;
    const badgeRadius = badgeSize / 2;
    const fontSize = badgeSize * 0.65;

    svg += `
  
  <!-- Badge de minutos -->
  <circle cx="${badgeX}" cy="${badgeY}" r="${badgeRadius}" fill="#ef4444" stroke="white" stroke-width="${size * 0.04}"/>
  <text x="${badgeX}" y="${badgeY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${minutes}</text>`;
  }

  svg += '\n</svg>';
  return svg;
}

// Gerar ícones SVG
const sizes = [16, 32, 48, 128];

console.log('Gerando ícones SVG...\n');

sizes.forEach(size => {
  const svg = generateSVG(size);
  fs.writeFileSync(`./icon${size}.svg`, svg);
  console.log(`✓ icon${size}.svg gerado`);
});

// Gerar exemplos com minutos
console.log('\nGerando exemplos com minutos...');
const exampleSVG = generateSVG(128, 42);
fs.writeFileSync('./icon-example-42min.svg', exampleSVG);
console.log('✓ icon-example-42min.svg gerado');

const exampleSVG2 = generateSVG(128, 5);
fs.writeFileSync('./icon-example-5min.svg', exampleSVG2);
console.log('✓ icon-example-5min.svg gerado');

console.log('\n✅ Todos os ícones SVG foram gerados com sucesso!');
console.log('💡 Use os arquivos SVG diretamente ou converta para PNG com uma ferramenta online');
