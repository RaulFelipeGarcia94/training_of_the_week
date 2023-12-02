require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const app = express();
const knexConfig = require("./knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(knexConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "");

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send(`Treinos da semana<br>
        <a href="/api/training">API de Treinos</a>`);
});

app.get("/api/trainings", (req, res) => {
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

app.get("/api/trainings/:id", (req, res) => {
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

app.post("/api/trainings", express.json(), (req, res) => {
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

app.put("/api/trainings/:id", (req, res) => {
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

app.delete("/api/trainings/:id", (req, res) => {
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
  console.log("Servidor rodando na porta 3000");
});
