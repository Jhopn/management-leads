import fastify from 'fastify';

const app = fastify();

app.listen({ port: 3000}, (err, address) => {
  console.log('Server ativo!', address);
})
