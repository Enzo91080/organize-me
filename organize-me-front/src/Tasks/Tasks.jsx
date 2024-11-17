import { useState, useEffect } from "react";
import taskApi from "./services/task.api";
import { Button, Modal, Form, Input, Popconfirm, message, Card, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // Tâches filtrées pour l'affichage
  const [searchQuery, setSearchQuery] = useState(""); // Valeur de la recherche
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAllTasks();
      setTasks(response); // Mettre à jour les tâches
      setFilteredTasks(response); // Initialiser les tâches filtrées avec toutes les tâches
    } catch (err) {
      setError("Erreur lors de la récupération des tâches.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      fetchTasks();
      message.success("Tâche supprimée avec succès!");
    } catch (err) {
      // message d'erreur pour expliquer que seulement les admins peuvent supprimer
      setError("Seuls les administrateurs peuvent supprimer les tâches.");
      console.error("Error deleting task:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    if (!taskId) {
      setError("L'ID de la tâche est manquant.");
      console.error("Task ID is missing.");
      return;
    }

    try {
      await taskApi.updateTask(taskId, updatedTask);
      fetchTasks();
      setEditingTask(null);
      message.success("Tâche mise à jour avec succès!");
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche.");
      console.error("Error updating task:", err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTasks(tasks); // Réinitialiser si aucune recherche
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseQuery) ||
          task.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredTasks(filtered);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-semibold mb-6">Tableau de bord des tâches</h1>
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher une tâche par titre ou description"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Liste des tâches */}
      <Row gutter={[16, 16]}>
        {filteredTasks.map((task) => (
          <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={<div style={{ height: 200, background: '#f0f2f5' }} />}
            >
              <Card.Meta title={task.title} description={task.description} />
              <div className="mt-4 flex justify-between">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditTask(task)}
                  style={{ marginRight: 8 }}
                >
                  Modifier
                </Button>
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer cette tâche?"
                  onConfirm={() => handleDeleteTask(task._id)}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="danger" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </Card>

            {editingTask && editingTask._id === task._id && (
              <Modal
                title="Modifier la tâche"
                visible={editingTask !== null}
                onCancel={() => setEditingTask(null)}
                footer={null}
              >
                <Form
                  initialValues={{
                    title: task.title,
                    description: task.description,
                  }}
                  onFinish={(values) => {
                    handleUpdateTask(task._id, values);
                  }}
                >
                  <Form.Item
                    name="title"
                    label="Titre de la tâche"
                    rules={[{ required: true, message: "Le titre est requis!" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "La description est requise!" }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Mettre à jour
                    </Button>
                    <Button
                      type="default"
                      onClick={() => setEditingTask(null)}
                      style={{ marginLeft: 10 }}
                    >
                      Annuler
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
}
