/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("trainings").del();
  await knex("trainings").insert([
    {
      id: 1,
      description: "Dorsal + Bíceps",
      type: "Definição muscular",
      day: "Segunda-feira",
      load: "10kg",
      series: "4x10",
      interval: 0.1,
    },
    {
      id: 2,
      description: "Funcional",
      type: "Definição muscular",
      day: "Terça-feira",
      load: "0kg",
      series: "4x12",
      interval: 0.1,
    },
    {
      id: 3,
      description: "Peitoral + Tríceps",
      type: "Definição muscular",
      day: "Quarta-feira",
      load: "16kg",
      series: "4x10",
      interval: 0.1,
    },
    {
      id: 4,
      description: "Funcional",
      type: "Definição muscular",
      day: "Quinta-feira",
      load: "0kg",
      series: "4x12",
      interval: 0.1,
    },
    {
      id: 5,
      description: "Inferior completo",
      type: "Definição muscular",
      day: "Sexta-feira",
      load: "50kg",
      series: "3x15",
      interval: 0.1,
    },
  ]);
};
