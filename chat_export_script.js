// Run this on each chat page
(function() {
  const title = document.title.replace(/[^a-z0-9]/gi, '_');
  const messages = [];
  
  // Extract all messages
  document.querySelectorAll('div[class*="font-"][class*="-message"]').forEach(el => {
    const role = el.className.includes('claude') ? 'Claude' : 'User';
    const text = el.innerText;
    messages.push({ role, text });
  });
  
  // Extract artifacts
  const artifacts = [];
  document.querySelectorAll('pre code').forEach((code, i) => {
    artifacts.push({
      index: i,
      language: code.className?.match(/language-(\w+)/)?.[1] || 'text',
      content: code.textContent
    });
  });
  
  // Create markdown
  let md = '# ' + document.title + '\n\n';
  messages.forEach(m => {
    md += '## ' + m.role + '\n' + m.text + '\n\n';
  });
  
  if (artifacts.length > 0) {
    md += '\n## Artifacts\n\n';
    artifacts.forEach(a => {
      md += '### Artifact ' + (a.index + 1) + ' (' + a.language + ')\n';
      md += '```' + a.language + '\n' + a.content + '\n```\n\n';
    });
  }
  
  // Download
  const blob = new Blob([md], {type: 'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title + '.md';
  a.click();
})();