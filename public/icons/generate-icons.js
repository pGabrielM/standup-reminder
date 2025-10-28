// Script para gerar ícones da extensão
// Execute com: node generate-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

// Configurações
const sizes = [16, 32, 48, 128];
const colors = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  text: '#ffffff',
  bg: '#1e293b',
};

function generateIcon(size, minutes = null) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background com gradiente
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Borda arredondada
  const radius = size * 0.2;
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';

  // Redesenhar gradiente
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Desenhar ícone de relógio/timer
  const centerX = size / 2;
  const centerY = size / 2;
  const clockRadius = size * 0.35;

  // Círculo do relógio
  ctx.strokeStyle = colors.text;
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.arc(centerX, centerY, clockRadius, 0, 2 * Math.PI);
  ctx.stroke();

  // Ponteiros do relógio
  ctx.lineCap = 'round';

  // Ponteiro das horas (10 horas)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX - clockRadius * 0.3, centerY - clockRadius * 0.4);
  ctx.stroke();

  // Ponteiro dos minutos (2 minutos)
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + clockRadius * 0.1, centerY - clockRadius * 0.6);
  ctx.stroke();

  // Ponto central
  ctx.fillStyle = colors.text;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.05, 0, 2 * Math.PI);
  ctx.fill();

  // Se tiver minutos, desenhar badge
  if (minutes !== null && size >= 32) {
    const badgeSize = size * 0.4;
    const badgeX = size - badgeSize * 0.7;
    const badgeY = size - badgeSize * 0.7;
    const badgeRadius = badgeSize / 2;

    // Fundo do badge
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Borda do badge
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = size * 0.04;
    ctx.stroke();

    // Texto do badge
    ctx.fillStyle = colors.text;
    ctx.font = `bold ${badgeSize * 0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(minutes.toString(), badgeX, badgeY);
  }

  return canvas;
}

// Gerar ícones padrão
console.log('Gerando ícones padrão...');
sizes.forEach(size => {
  const canvas = generateIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon${size}.png`, buffer);
  console.log(`✓ icon${size}.png gerado`);
});

// Gerar ícone de exemplo com minutos
console.log('\nGerando ícone de exemplo com minutos...');
const exampleCanvas = generateIcon(128, 42);
const exampleBuffer = exampleCanvas.toBuffer('image/png');
fs.writeFileSync('icon-example-with-minutes.png', exampleBuffer);
console.log('✓ icon-example-with-minutes.png gerado');

console.log('\n✅ Todos os ícones foram gerados com sucesso!');
console.log('📝 Copie os arquivos icon*.png para a pasta public/icons/');
