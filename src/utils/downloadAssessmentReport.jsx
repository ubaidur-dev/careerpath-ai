import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { getFontEmbedCSS, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import AssessmentReport, { PAGE_WIDTH } from '../components/AssessmentReport';
import { formatIssueDate } from './issueDate';

let interFontCSS = null;

async function getInterFontCSS(node) {
  if (interFontCSS) return interFontCSS;
  try {
    const link = document.querySelector('link[href*="fonts.googleapis.com"]');
    const css = await (await fetch(link.href)).text();
    const faces = [...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*{[^}]*})/g)].map((m) => m[1]);
    const embedded = await Promise.all(faces.map(async (face) => {
      const url = face.match(/url\(([^)]+)\)/)[1];
      const blob = await (await fetch(url)).blob();
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      return face.replace(url, dataUrl);
    }));
    if (embedded.length) {
      interFontCSS = embedded.join('\n');
      return interFontCSS;
    }
  } catch (err) {
    console.warn('Could not embed the Inter font directly', err);
  }
  return getFontEmbedCSS(node).catch(() => undefined);
}

const waitForImages = (root) => Promise.all(
  [...root.querySelectorAll('img')].map((img) => (img.complete
    ? Promise.resolve()
    : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; })))
);

export async function downloadAssessmentReport(report, studentName) {
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-${PAGE_WIDTH * 3}px;top:0;width:${PAGE_WIDTH}px;pointer-events:none;`;
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    const issued = { ...report, issuedAt: formatIssueDate(new Date()) };
    flushSync(() => root.render(<AssessmentReport report={issued} studentName={studentName || 'Student'} />));
    await document.fonts.ready;
    await waitForImages(host);

    const pages = [...host.querySelectorAll('[data-pdf-page]')];
    const fontEmbedCSS = await getInterFontCSS(pages[0]);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i += 1) {
      const node = pages[i];
      const image = await toJpeg(node, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#fcf8fe',
        fontEmbedCSS,
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
      const scale = Math.min(pageW / node.offsetWidth, pageH / node.offsetHeight);
      const w = node.offsetWidth * scale;
      const h = node.offsetHeight * scale;
      if (i > 0) pdf.addPage();
      pdf.setFillColor('#fcf8fe');
      pdf.rect(0, 0, pageW, pageH, 'F');
      pdf.addImage(image, 'JPEG', (pageW - w) / 2, 0, w, h, undefined, 'FAST');
    }

    pdf.save(`CareerPath-AI-Assessment-${report.number}-Report.pdf`);
  } finally {
    root.unmount();
    host.remove();
  }
}
