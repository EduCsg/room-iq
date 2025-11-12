const API_URL = "http://localhost:3000/api";

export const api = {
  // Blocos
  getBlocos: () => fetch(`${API_URL}/blocos`).then((r) => r.json()),
  getBloco: (id: number) =>
    fetch(`${API_URL}/blocos/${id}`).then((r) => r.json()),
  createBloco: (data: unknown) =>
    fetch(`${API_URL}/blocos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateBloco: (id: number, data: unknown) =>
    fetch(`${API_URL}/blocos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  deleteBloco: (id: number) =>
    fetch(`${API_URL}/blocos/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),

  // Salas
  getSalas: () => fetch(`${API_URL}/salas`).then((r) => r.json()),
  getSala: (id: number) =>
    fetch(`${API_URL}/salas/${id}`).then((r) => r.json()),
  createSala: (data: unknown) =>
    fetch(`${API_URL}/salas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateSala: (id: number, data: unknown) =>
    fetch(`${API_URL}/salas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  deleteSala: (id: number) =>
    fetch(`${API_URL}/salas/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),
  addEquipamentoToSala: (salaId: number, equipamentoId: number) =>
    fetch(`${API_URL}/salas/${salaId}/equipamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipamento_id: equipamentoId }),
    }).then((r) => r.json()),
  removeEquipamentoFromSala: (salaId: number, equipamentoId: number) =>
    fetch(`${API_URL}/salas/${salaId}/equipamentos/${equipamentoId}`, {
      method: "DELETE",
    }).then((r) => r.json()),

  // Equipamentos
  getEquipamentos: () => fetch(`${API_URL}/equipamentos`).then((r) => r.json()),
  getEquipamento: (id: number) =>
    fetch(`${API_URL}/equipamentos/${id}`).then((r) => r.json()),
  createEquipamento: (data: unknown) =>
    fetch(`${API_URL}/equipamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateEquipamento: (id: number, data: unknown) =>
    fetch(`${API_URL}/equipamentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  deleteEquipamento: (id: number) =>
    fetch(`${API_URL}/equipamentos/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),

  // Usuarios
  getUsuarios: () => fetch(`${API_URL}/usuarios`).then((r) => r.json()),
  getUsuario: (id: number) =>
    fetch(`${API_URL}/usuarios/${id}`).then((r) => r.json()),
  createUsuario: (data: unknown) =>
    fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateUsuario: (id: number, data: unknown) =>
    fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  deleteUsuario: (id: number) =>
    fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),

  // Reservas
  getReservas: () => fetch(`${API_URL}/reservas`).then((r) => r.json()),
  getReserva: (id: number) =>
    fetch(`${API_URL}/reservas/${id}`).then((r) => r.json()),
  getReservasByUsuario: (usuarioId: number) =>
    fetch(`${API_URL}/reservas/usuario/${usuarioId}`).then((r) => r.json()),
  getReservasBySala: (salaId: number) =>
    fetch(`${API_URL}/reservas/sala/${salaId}`).then((r) => r.json()),
  createReserva: (data: unknown) =>
    fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateReserva: (id: number, data: unknown) =>
    fetch(`${API_URL}/reservas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  updateReservaStatus: (id: number, status: string) =>
    fetch(`${API_URL}/reservas/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
  deleteReserva: (id: number) =>
    fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
    }).then((r) => r.json()),
};
