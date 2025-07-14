import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Function to check if a file might contain incorrect imports
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for incorrect react-Icons imports (with capital I)
  if (content.includes('react-icons/')) {
    console.log(`Found incorrect import in: ${filePath}`);
    
    // Replace all occurrences of react-Icons with react-icons
    const correctedContent = content.replace(/react-Icons\//g, 'react-icons/');
    
    // Write the corrected content back to the file
    fs.writeFileSync(filePath, correctedContent);
    console.log(`✓ Fixed import in: ${filePath}`);
  }
}

// Function to recursively traverse directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other directories that should be ignored
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walkDir(filePath);
      }
    } else if (stat.isFile() && 
              (filePath.endsWith('.js') || 
               filePath.endsWith('.jsx') || 
               filePath.endsWith('.ts') || 
               filePath.endsWith('.tsx'))) {
      checkFile(filePath);
    }
  });
}

console.log('Checking for incorrect react-icons imports...');
walkDir(rootDir);
console.log('Done!');
