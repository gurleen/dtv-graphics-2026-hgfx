import index from './index.html'

const server = Bun.serve({
  port: 3456,
  hostname: '127.0.0.1',
  routes: {
    '/': index,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Matchup intro demo: ${server.url}`)
