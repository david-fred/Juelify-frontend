export function renderWatermark(
  ctx: CanvasRenderingContext2D,
  user: { name: string; matricId: string },
  pageWidth: number,
  pageHeight: number,
) {
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.font = '14px Inter, sans-serif';
  ctx.fillStyle = '#a78bfa';
  ctx.translate(pageWidth / 2, pageHeight / 2);
  ctx.rotate(-Math.PI / 6);

  const text = `${user.name} | ${user.matricId} | ${new Date().toISOString().slice(0, 19)}`;

  for (let y = -pageHeight; y < pageHeight; y += 70) {
    for (let x = -pageWidth; x < pageWidth; x += 380) {
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();
}

