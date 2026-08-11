/** @type {import('@hydra-tv/hydra-gfx-sdk/config').HydraConfig} */
const config = {
  entry: 'src/index.ts',
  outDir: 'dist',
  shared: [
    'react',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    '@hydra-tv/hydra-gfx-runtime',
    'zod',
    '@hydra-tv/ui',
  ],
  runtime: '^0.1.0',
}

export default config
