const express = require('express');

const server = express();
server.use(express.json());
/* query = ?teste=1
route = /users/1
request body = { "name: "diego,} */ 
// CRUD - Create, read, update, delete

const users = ['Diego', 'Carlos', 'Gabriel'];

//middlewares padrão 

server.use((req, res, next) => {
  console.log(`método ${req.method}; URL: ${req.url};`)

  next();
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required'});
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index]
  if(!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}


// CRUD

server.get('/users', (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
})


server.listen(3000);