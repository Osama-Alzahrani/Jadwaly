const fs = require('fs');
const path = require('path');
const { minify: minifyJS } = require('terser');
const { minify: minifyHTML } = require('html-minifier-terser');
const CleanCSS = require('clean-css');

const rootDir = './';
const srcDir = './src';
const buildDir = './build';

const rootFilesList = [
    'main.js',
    'background.js',
    'injection.js',
    'popup.js',
    'index.html',
    'popup.html',
    'manifest.json',
    'style.css',
    'focus-mode.css',
];

const copyList = [
    'assets',
    'manifest.json',
    'dist'
]

const cssMinifier = new CleanCSS({ level: 2 }); // Level 2 = aggressive optimization

async function processFile(srcPath, distPath, filename) {
    const ext = path.extname(filename);
    
    if (ext === '.js') {
        const code = fs.readFileSync(srcPath, 'utf8');
        const minified = await minifyJS(code, { compress: true, mangle: true });
        fs.writeFileSync(distPath, minified.code);
        console.log(`⚡ JS Minified: ${filename}`);

    } else if (ext === '.html') {
        const html = fs.readFileSync(srcPath, 'utf8');
        const minified = await minifyHTML(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true, // Minifies JS inside <script> tags
            minifyCSS: true // Minifies CSS inside <style> tags
        });
        fs.writeFileSync(distPath, minified);
        console.log(`🌍 HTML Minified: ${filename}`);

    } else if (ext === '.css') {
        const css = fs.readFileSync(srcPath, 'utf8');
        const minified = cssMinifier.minify(css);
        fs.writeFileSync(distPath, minified.styles);
        console.log(`🎨 CSS Minified: ${filename}`);

    } else {
        // Just copy manifest, images, or fonts
        fs.copyFileSync(srcPath, distPath);
        console.log(`📄 Copied: ${filename}`);
    }
}

// 1. Process the Root List
async function processRootFiles() {
    for (const file of rootFilesList) {
        const srcPath = path.join(rootDir, file);
        const distPath = path.join(buildDir, file);
        if (fs.existsSync(srcPath)) {
            await processFile(srcPath, distPath, file);
        }
    }
}

// 2. Process the SRC Folder recursively
async function processSrcFolder(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(srcDir, fullPath);
        const targetPath = path.join(buildDir, 'src', relativePath);

        if (fs.statSync(fullPath).isDirectory()) {
            if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
            await processSrcFolder(fullPath);
        } else {
            await processFile(fullPath, targetPath, file);
        }
    }
}

async function copyAssets() {
    for (const item of copyList) {
        const srcPath = path.join(rootDir, item);
        const distPath = path.join(buildDir, item);
        if (fs.existsSync(srcPath)) {
            if (fs.statSync(srcPath).isDirectory()) {
                fs.cpSync(srcPath, distPath, { recursive: true });
                console.log(`📁 Copied Directory: ${item}`);
            } else {
                fs.copyFileSync(srcPath, distPath);
                console.log(`📄 Copied: ${item}`);
            } 
        } else {
                console.warn(`⚠️  Warning: ${item} not found in root directory.`);
        }
    }
}


async function runBuild() {
    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true });
    fs.mkdirSync(path.join(buildDir, 'src'), { recursive: true });

    await processRootFiles();
    await processSrcFolder(srcDir);
    await copyAssets();
    console.log("\n🚀 ✨ Build Complete! Your extension is now ultra-compressed.");
}

runBuild();