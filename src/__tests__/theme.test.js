import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Theme Configuration', () => {
  it('should define Cyberpunk color variables in index.css', () => {
    const cssPath = path.resolve(__dirname, '../index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    // Core Cyberpunk Palette
    expect(cssContent).toContain('--color-background: #0a0a0f');
    expect(cssContent).toContain('--color-accent: #00ff88');
    expect(cssContent).toContain('--color-accent-secondary: #ff00ff');
    
    // New Warning Color required for input validation
    expect(cssContent).toContain('--color-warning: #facc15'); 
  });
});
