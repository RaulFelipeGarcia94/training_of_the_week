const express = require("express");
const morgan = require("morgan");
const app = express();

let produtos = [
  {
    id: 1,
    descricao: "Arroz parboilizado 5Kg",
    valor: 25.0,
    marca: "Tio João",
  },
  {
    id: 2,
    descricao: "Maionese 250gr",
    valor: 7.2,
    marca: "Helmans",
  },
  { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.5, marca: "Itambé" },
  {
    id: 4,
    descricao: "Batata Maior Palha 300gr",
    valor: 15.2,
    marca: "Chipps",
  },
  { id: 5, descricao: "Nescau 400gr", valor: 8.0, marca: "Nestlé" },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "");

app.use(morgan("common"));

app.use("/site", express.static("public", { extensions: ["html", "htm"] }));

app.get("/", (req, res) => {
  res.send(`Hello to API World<br>
        <a href="/api/produtos">API de Produtos</a>`);
});

app.get("/api/produtos", (req, res) => {
  let sort = req.query.sort;
  if (sort) {
    produtosOrdenados = produtos.sort((a, b) => a[sort].localeCompare(b[sort]));
    res.status(200).json(produtosOrdenados);
  } else res.status(200).json(produtos);
});

app.get("/api/produtos/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let produto = produtos.find((p) => p.id === id);
  res.status(200).json(produto);
});

app.post("/api/produtos", express.json(), (req, res) => {
  const novoProduto = req.body;
  console.log(novoProduto);
  novoProduto.id = produtos.length + 1;
  produtos.push(novoProduto);
  res.status(201).json({
    mensagem: "Produto adicionado com sucesso.",
    produto: novoProduto,
  });
});

app.put("/api/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = produtos.findIndex((p) => p.id === id);

  if (produtoIndex !== -1) {
    const produtoAtualizado = req.body;
    produtos[produtoIndex] = {
      ...produtos[produtoIndex],
      ...produtoAtualizado,
    };
    res.status(200).json(produtos[produtoIndex]);
  } else {
    res.status(404).json({ mensagem: "Produto não encontrado" });
  }
});

app.delete("/api/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produtoIndex = produtos.findIndex((p) => p.id === id);

  if (produtoIndex !== -1) {
    const produtoExcluido = produtos.splice(produtoIndex, 1);
    res.status(200).json(produtoExcluido[0]);
  } else {
    res.status(404).json({ mensagem: "Produto não encontrado" });
  }
});

app.use((req, res) => {
  res.status(404).send(`<h2>Erro 404 - Recurso não encontrado</h2>`);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
