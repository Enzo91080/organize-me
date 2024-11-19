import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Common/contexts/AuthContext";
import { ROUTES } from "../Common/router";

export default function LandingPage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Simplifiez votre quotidien avec Organize Me
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Planifiez vos tâches, suivez vos progrès et atteignez vos objectifs en toute simplicité.
          </p>
          <Link
            to={isLoggedIn ? ROUTES.TASKS : ROUTES.AUTH.LOGIN}
            className="px-8 py-3 bg-blue-500 text-black rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Démarrer maintenant
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Pourquoi choisir Organize Me ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Planification intuitive</h3>
              <p className="text-gray-600">
                Organisez vos tâches rapidement grâce à une interface simple et claire.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Suivi des progrès</h3>
              <p className="text-gray-600">
                Visualisez vos progrès pour rester motivé et atteindre vos objectifs.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-blue-600 mb-4">Multi-plateformes</h3>
              <p className="text-gray-600">
                Utilisez Organize Me sur tous vos appareils, où que vous soyez.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
