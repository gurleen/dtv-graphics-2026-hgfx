import index from './index.html'
import showcase from './showcase/index.html'

const server = Bun.serve({
  port: 3456,
  hostname: '127.0.0.1',
  routes: {
    '/': index,
    '/showcase': showcase,
  },
  development: {
    hmr: true,
    console: true,
  },
})

console.log(`Developer demo: ${server.url}`)
console.log(`Stakeholder showcase: ${new URL('/showcase', server.url)}`)
