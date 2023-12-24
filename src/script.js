//Abre o menu hamburger no mobile
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  });
});

//Função para fechar modal de erro
function handleErrorModal() {
  document.getElementById("modal-error").classList.toggle("hidden");
}

//Função para fechar modal de sucesso
function handleSuccessModal() {
  document.getElementById("modal-success").classList.toggle("hidden");
}

//Função para popular os valores dos inputs no modal de editar treino
function populateEditModal(training) {
  document.getElementById("description-edit").value = training.description;
  document.getElementById("type-edit").value = training.type;
  document.getElementById("day-edit").value = training.day;
  document.getElementById("load-edit").value = training.load;
  document.getElementById("series-edit").value = training.series;
  document.getElementById("interval-edit").value = training.interval;
}

//Função para editar treino
function handleEditModal(training) {
  document.getElementById("modal-edit").classList.toggle("hidden");

  populateEditModal(training);

  const editTraining = document.getElementById("form-edit-training");
  editTraining.onsubmit = async (event) => {
    event.preventDefault();
    try {
      const description = document.getElementById("description-edit").value;
      const type = document.getElementById("type-edit").value;
      const day = document.getElementById("day-edit").value;
      const load = document.getElementById("load-edit").value;
      const series = document.getElementById("series-edit").value;
      const interval = document.getElementById("interval-edit").value;

      const token = localStorage.getItem("token");

      const trainingData = {
        description: description,
        type: type,
        day: day,
        load: load,
        series: series,
        interval: interval,
      };

      const resposta = await fetch(
        `https://training-of-the-week.onrender.com/api/trainings/${training.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(trainingData),
        }
      );
      if (resposta.status === 200) {
        alert("Treino editado com sucesso!");
      } else {
        handleErrorModal();
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
    }
  };
}

//Função para alterar a imagem quando o tamanho da tela alterar
function updateImageSrc() {
  const image = document.getElementById("responsive-image");

  if (window.innerWidth < 768) {
    image.src = "./images/bg-home-mobile.png";
  } else {
    image.src = "./images/bg-home-desktop.png";
  }
}
window.addEventListener("load", updateImageSrc);
window.addEventListener("resize", updateImageSrc);

//Função para descriptografar o token
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(atob(base64));
}

//Função para cadastrar usuário no banco
async function registerUser(e) {
  e.preventDefault();
  try {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const dadosUsuario = {
      name: nome,
      email: email,
      login: usuario,
      password: senha,
      roles: "USER",
    };
    const resposta = await fetch(
      "https://training-of-the-week.onrender.com/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      }
    );
    if (resposta.status === 201) {
      window.location.replace("/src/login.html");
    } else {
      handleErrorModal();
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}

//Função para logar o usuário
async function loginUser(e) {
  e.preventDefault();
  try {
    const usuario = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    const dadosUsuario = {
      login: usuario,
      password: senha,
    };

    const resposta = await fetch(
      "https://training-of-the-week.onrender.com/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      }
    );
    if (resposta.status === 200) {
      const data = await resposta.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decodedToken = parseJwt(data.token);
        if (decodedToken.roles.includes("ADMIN")) {
          window.location.replace("dashboard.html");
        } else {
          window.location.replace("trainings.html");
        }
      } else {
        handleErrorModal();
      }
    } else {
      handleErrorModal();
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}

//Função para cadastrar treino
async function cadastreTraining(e) {
  e.preventDefault();
  try {
    const description = document.getElementById("description").value;
    const type = document.getElementById("type").value;
    const day = document.getElementById("day").value;
    const load = document.getElementById("load").value;
    const series = document.getElementById("series").value;
    const interval = document.getElementById("interval").value;

    const token = localStorage.getItem("token");

    const trainingData = {
      description: description,
      type: type,
      day: day,
      load: load,
      series: series,
      interval: interval,
    };
    const resposta = await fetch(
      "https://training-of-the-week.onrender.com/api/trainings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trainingData),
      }
    );
    if (resposta.status === 201) {
      alert("Cadastro feito com sucesso!");
    } else {
      handleErrorModal();
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}

//Função para deletar treino
async function deleteTraining(idTraining) {
  try {
    const token = localStorage.getItem("token");
    const resposta = await fetch(
      `https://training-of-the-week.onrender.com/api/trainings/${idTraining}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (resposta.status === 200) {
      alert("Treino excluído com sucesso!");
    } else {
      handleErrorModal();
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}
