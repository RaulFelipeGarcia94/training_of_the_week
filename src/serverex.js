require("dotenv").config();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();
const knexConfig =
  require("../knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(knexConfig);
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "");

app.use(morgan("common"));

app.use(cors());

app.use(express.static("src"));

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const authType = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];
    if (authType !== "Bearer") {
      res.status(401).json({ erro: "Tipo de autenticação inválida" });
      return;
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
          res.status(401).json({ erro: "Token inválido" });
          return;
        } else {
          req.token = data;
          next();
        }
      });
    }
  } else res.status(401).json({ erro: "Token não informado" });
};

const isAdmin = (req, res, next) => {
  if (req.token.roles.indexOf("ADMIN") === -1)
    res.status(403).json({ erro: "Acesso negado" });
  else next();
};

app.post("/api/register", (req, res) => {
  const { name, email, login, password, roles } = req.body;

  const hashedPassword = bcrypt.hashSync(password);

  knex("users")
    .insert(
      {
        name,
        email,
        login,
        password: hashedPassword,
        roles,
      },
      ["*"]
    )
    .then(() => {
      res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
    })
    .catch((err) => {
      res.status(500).json({ erro: err });
    });
});

app.post("/api/login", (req, res) => {
  let { login, password } = req.body;
  knex("users")
    .where({ login: login })
    .then((ret) => {
      if (ret.length === 0) {
        res.status(401).json({
          erro: "Usuário ou senha inválida",
        });
      } else {
        let user = ret[0];
        if (bcrypt.compareSync(password, user.password)) {
          jwt.sign(
            { id: user.id, roles: user.roles },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
            (err, token) => {
              if (err) res.status(500).json({ erro: err });
              else res.status(200).json({ token: token });
            }
          );
        } else {
          res.status(401).json({ erro: "Usuário ou senha inválida" });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({ erro: err });
    });
});

app.get("/api/trainings", checkToken, (req, res) => {
  knex("trainings")
    .select("id", "description", "type", "day", "load", "series", "interval")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: `Erro ao recuperar lista de produtos: ${err.message}`,
      });
    });
});

app.get("/api/trainings/:id", checkToken, (req, res) => {
  knex("trainings")
    .select("id", "description", "type", "day", "load", "series", "interval")
    .then((trainings) => {
      let id = parseInt(req.params.id);
      let training = trainings.find((p) => p.id === id);
      res.status(200).json(training);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: `Erro ao recuperar produto: ${err.message}`,
      });
    });
});

app.post("/api/trainings", checkToken, isAdmin, (req, res) => {
  const newTraining = req.body;

  knex("trainings")
    .insert(newTraining)
    .returning([
      "id",
      "description",
      "type",
      "day",
      "load",
      "series",
      "interval",
    ])
    .then((insertedTraining) => {
      res.status(201).json({
        mensagem: "Treino adicionado com sucesso.",
        treino: insertedTraining[0],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: `Erro ao adicionar treino: ${err.message}`,
      });
    });
});

app.put("/api/trainings/:id", checkToken, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  knex("trainings")
    .where({ id: id })
    .update(req.body)
    .returning("*")
    .then((updatedTraining) => {
      if (updatedTraining.length > 0) {
        res.status(200).json(updatedTraining[0]);
      } else {
        res.status(404).json({ mensagem: "Treino não encontrado" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: `Erro ao atualizar treino: ${err.message}`,
      });
    });
});

app.delete("/api/trainings/:id", checkToken, isAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  knex("trainings")
    .where({ id: id })
    .del()
    .returning("*")
    .then((deletedTrainings) => {
      if (deletedTrainings > 0) {
        res.status(200).json({ mensagem: "Treino excluído com sucesso" });
      } else {
        res.status(404).json({ mensagem: "Treino não encontrado" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: `Erro ao excluir treino: ${err.message}`,
      });
    });
});

app.use((req, res) => {
  res.status(404).send(`<h2>Erro 404 - Recurso não encontrado</h2>`);
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});

module.exports = app;
