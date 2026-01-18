const fs = require('fs');

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const tagRegex = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/)?>/g;
    const stack = [];
    const monitoredTags = ['div', 'span', 'button', 'nuxtlink', 'p', 'svg', 'path'];

    console.log(`Auditing ${filePath}...`);

    lines.forEach((line, lineIdx) => {
        let match;
        const lineNumber = lineIdx + 1;

        // For each line, find all tags
        while ((match = tagRegex.exec(line)) !== null) {
            const isClosing = match[1] === '/';
            const tagName = match[2].toLowerCase();
            const isSelfClosing = match[4] === '/' || (tagName === 'path' && match[0].endsWith('/>'));

            if (!monitoredTags.includes(tagName)) continue;

            if (isSelfClosing) {
                // console.log(`[Self-Closing] ${tagName} at line ${lineNumber}`);
                continue;
            }

            if (isClosing) {
                if (stack.length === 0) {
                    console.log(`[EXTRA CLOSING] </${tagName}> at line ${lineNumber}`);
                } else {
                    const lastTag = stack.pop();
                    if (lastTag.name !== tagName) {
                        console.log(`[MISMATCH] </${tagName}> at line ${lineNumber} (Expected </${lastTag.name}> from line ${lastTag.line})`);
                        // Try to find the correct tag in stack to recover
                        const index = stack.map(t => t.name).lastIndexOf(tagName);
                        if (index !== -1) {
                            // We found the correct tag deeper in the stack, so we missed closing tags
                            // console.log(`  Recovered by popping ${stack.length - index} tags`);
                            stack.splice(index);
                        } else {
                            // We didn't find the tag, put the last one back
                            stack.push(lastTag);
                        }
                    }
                }
            } else {
                stack.push({ name: tagName, line: lineNumber });
            }
        }
        // Optimization: avoid infinite loops with regex
        tagRegex.lastIndex = 0;

        // However, exec on the same line needs manual loop control
        // Let's refine the loop to handle multiple tags per line correctly
        let lineRemaining = line;
        let posOffset = 0;
        while (true) {
            const lineMatch = tagRegex.exec(lineRemaining);
            if (!lineMatch) break;

            const isClosing = lineMatch[1] === '/';
            const tagName = lineMatch[2].toLowerCase();
            const isSelfClosing = lineMatch[4] === '/' || (tagName === 'path' && lineMatch[0].endsWith('/>'));

            if (monitoredTags.includes(tagName)) {
                if (!isSelfClosing) {
                    if (isClosing) {
                        if (stack.length === 0) {
                            console.log(`[EXTRA CLOSING] </${tagName}> at line ${lineNumber}`);
                        } else {
                            const lastTag = stack.pop();
                            if (lastTag.name !== tagName) {
                                console.log(`[MISMATCH] </${tagName}> at line ${lineNumber} (Expected </${lastTag.name}> from line ${lastTag.line})`);
                            }
                        }
                    } else {
                        stack.push({ name: tagName, line: lineNumber });
                    }
                }
            }
            lineRemaining = lineRemaining.substring(lineMatch.index + lineMatch[0].length);
        }
    });

    if (stack.length > 0) {
        console.log(`[REMAINING OPEN] Tags left on stack:`);
        stack.forEach(t => console.log(`  <${t.name}> opened at line ${t.line}`));
    }
}

const files = process.argv.slice(2);
files.forEach(auditFile);
