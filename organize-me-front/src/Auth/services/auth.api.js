import ApiService from "../../common/services/apiService";

const AUTH_PATH_API = "auth";

class AuthApi extends ApiService {
  constructor() {
    super(AUTH_PATH_API);
  }

  login(credentials) {
    return this.post("/login", credentials);
  }

  me() {
    return this.get("/me");
  }

  register(userData) {
    return this.post("/register", userData);
  }

  logout() {
    // Optionnel : si vous voulez implémenter une déconnexion côté serveur
    return this.post("/logout");
  }
}

const authApi = new AuthApi();

export default authApi;
