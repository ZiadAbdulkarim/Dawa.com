const fs = require('fs');
const files = [
  'src/app/pages/home/home.component.scss',
  'src/app/shared/components/medicine-card/medicine-card.component.scss'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Replace [dir="rtl"] with :host-context([dir="rtl"]) except when preceded by :host-context(
    content = content.replace(/(?<!:host-context\()\[dir="rtl"\]/g, ':host-context([dir="rtl"])');
    fs.writeFileSync(f, content);
  }
});
