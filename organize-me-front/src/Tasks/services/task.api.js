import ApiService from "../../Common/services/apiService";
const TASK_PATH_API = "tasks";

class TaskApi extends ApiService {
  constructor() {
    super(TASK_PATH_API);
  }

  getAllTasks() {
    return this.get("");
  }

  getTaskById(id) {
    return this.get(`/${id}`);
  }

  createTask(data) {
    return this.post("", data);
  }

  updateTask(id, data) {
    return this.put(`/${id}`, data);
  }

  deleteTask(id) {
    return this.delete(`/${id}`);
  }
}

const taskApi = new TaskApi();

export default taskApi;