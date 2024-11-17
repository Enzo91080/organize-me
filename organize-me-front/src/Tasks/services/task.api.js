import ApiService from "../../common/services/apiService";

// Instance d'ApiService pour les tâches
const apiService = new ApiService('/tasks');

const taskApi = {
  // Récupérer toutes les tâches
  getAllTasks: async (params = {}) => {
    return await apiService.find("", params);
  },

  // Récupérer une tâche par ID
  getTaskById: async (id) => {
    return await apiService.get(`/${id}`);
  },

  // Récupérer une tâche par ID sans token
  getTaskByIdNoToken: async (id) => {
    return await apiService.get(`/${id}`);
  },

  // Créer une nouvelle tâche
  createTask: async (data) => {
    return await apiService.post("", data);
  },

  // Mettre à jour une tâche par ID
  updateTask: async (id, data) => {
    return await apiService.put(`/${id}`, data);
  },

  // Supprimer une tâche par ID
  deleteTask: async (id) => {
    return await apiService.delete(`/${id}`);
  },
};

export default taskApi;
