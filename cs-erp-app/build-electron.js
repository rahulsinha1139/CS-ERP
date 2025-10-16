const { build } = require('esbuild');
const path = require('path');

async function bundleElectron() {
  try {
    console.log('📦 Bundling Electron main process...');

    // Bundle main process
    await build({
      entryPoints: [path.join(__dirname, 'electron/main.ts')],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: path.join(__dirname, 'dist/electron/main.js'),
      external: [
        'electron',
        'sqlite3',
        'canvas',
        '@prisma/client',
        '@prisma/engines',
        'better-sqlite3',
        'next',
        'react',
        'react-dom',
        '@next/*',
        '@tanstack/*',
        '@trpc/*',
        'superjson',
        'zod',
      ],
      format: 'cjs',
      sourcemap: false,
      minify: false, // Set to true for production
      logLevel: 'info',
    });

    console.log('✅ Main process bundled successfully');

    // Bundle preload script
    await build({
      entryPoints: [path.join(__dirname, 'electron/preload.ts')],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: path.join(__dirname, 'dist/electron/preload.js'),
      external: ['electron'],
      format: 'cjs',
      sourcemap: false,
      minify: false,
      logLevel: 'info',
    });

    console.log('✅ Preload script bundled successfully');
    console.log('✨ Electron bundling complete!');
  } catch (error) {
    console.error('❌ Bundling failed:', error);
    process.exit(1);
  }
}

bundleElectron();
