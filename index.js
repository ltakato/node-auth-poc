const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jwt-simple');

const app = express();

const jwtConfig = require('./infra/jwtconfig');
const passportStrategies = require('./infra/passport-strategies');
const AuthMiddleware = require('./infra/auth-middleware');
const products = require('./products');

app.use(bodyParser.json());
app.use(passport.initialize({}));

passport.use('jwt', passportStrategies.jwt);

app.get('/products', AuthMiddleware(['sales']), async (req, res) => res.send(products));

app.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const users = Array.from(require('./users'));
    const user = users.find(user => user.name === name);

    if (!user) return res.status(404);

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) res.status(404).send({ error: 'Senha inválida'});

    const tokenPayload = { name: user.name, roles: user.roles };
    const token = jwt.encode(tokenPayload, jwtConfig.jwtSecret);

    res.send({ token });
  } catch (error) {
    res.status(400).send({ error });
  }
});

app.post('/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // TODO: armazena usuario no banco

  res.send();
});

app.listen(3000, () => console.log('app listening on port 3000'));
