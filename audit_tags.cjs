const fs = require('fs');

function auditFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    // Handle Vue templates
    const templateMatch = content.match(/<template>([\s\S]*)<\/template>/);
    const templateContent = templateMatch ? templateMatch[1] : content;

    const tagRegex = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/)?>/g;
    const stack = [];
    // Use a more inclusive list or just a generic filter
    const ignoredTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];

    console.log(`Auditing ${filePath}...`);

    let match;
    let matchesFound = 0;
    while ((match = tagRegex.exec(templateContent)) !== null) {
        matchesFound++;
        const isClosing = match[1] === '/';
        const tagName = match[2]; // Keep case for reporting, but compare lower
        const lowerTagName = tagName.toLowerCase();
        const isSelfClosing = match[4] === '/' || ignoredTags.includes(lowerTagName);

        if (isSelfClosing) continue;

        const beforeMatch = templateContent.substring(0, match.index);
        const lineNumber = (content.substring(0, content.indexOf(templateContent) + match.index)).split('\n').length;

        if (isClosing) {
            if (stack.length === 0) {
                console.log(`[EXTRA CLOSING] </${tagName}> at line ${lineNumber}`);
            } else {
                const lastTag = stack.pop();
                if (lastTag.name.toLowerCase() !== lowerTagName) {
                    console.log(`[MISMATCH] </${tagName}> at line ${lineNumber} (Expected </${lastTag.name}> from line ${lastTag.line})`);
                    // Recovery logic: search for the tag in stack
                    const index = stack.map(t => t.name.toLowerCase()).lastIndexOf(lowerTagName);
                    if (index !== -1) {
                        // Found it deeper, assume we missed some closings
                        stack.splice(index);
                    } else {
                        // Not found, assume this is just an extra closing tag or a typo
                        stack.push(lastTag);
                        console.log(`  (Note: No matching opening tag found for </${tagName}> in stack. Treating as extra closing.)`);
                    }
                }
            }
        } else {
            stack.push({ name: tagName, line: lineNumber });
        }
    }

    if (stack.length > 0) {
        console.log(`[REMAINING OPEN] Tags left on stack:`);
        stack.forEach(t => console.log(`  <${t.name}> opened at line ${t.line}`));
    }

    if (matchesFound === 0) {
        console.log(`No tags found in ${filePath} (check regex/template structure)`);
    }
}

const files = process.argv.slice(2);
files.forEach(auditFile);
