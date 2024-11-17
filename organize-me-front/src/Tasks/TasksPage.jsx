import { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import PageCanvas from "../Common/components/Panels/PageCanvas";
import Tasks from "./Tasks";
import taskApi from "./services/task.api"; // Assurez-vous que l'API pour gérer les tâches est bien importée

const TasksPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // État pour contrôler l'affichage de la modale
  const [loading, setLoading] = useState(false); // État de chargement pour l'ajout de la tâche
  const [tasks, setTasks] = useState([]); // L'état des tâches

  // Fonction pour récupérer les tâches depuis l'API
  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAllTasks();
      setTasks(response); // Met à jour l'état avec les tâches récupérées
    } catch (err) {
      message.error("Erreur lors de la récupération des tâches.");
      console.error("Error fetching tasks:", err);
    }
  };

  // Ouvrir la modale
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fermer la modale
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Fonction pour ajouter une tâche
  const handleAddTask = async (values) => {
    setLoading(true);
    try {
      // Appel API pour ajouter la tâche
      const newTask = await taskApi.createTask(values);
      message.success("Tâche ajoutée avec succès !");
      setTasks((prevTasks) => [...prevTasks, newTask]); // Met à jour la liste des tâches localement
      setIsModalVisible(false); // Ferme la modale après l'ajout
    } catch (err) {
      message.error("Erreur lors de l'ajout de la tâche.");
      console.error("Error adding task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageCanvas title="Liste des tâches">
        <PageCanvas.Actions>
          {/* Bouton pour ouvrir la modale */}
          <Button type="primary" onClick={showModal}>
            Créer une tâche
          </Button>
        </PageCanvas.Actions>

        <PageCanvas.Content>
          <Tasks tasks={tasks} /> {/* Passez les tâches en prop ici */}
        </PageCanvas.Content>
      </PageCanvas>

      {/* Modale pour ajouter une tâche */}
      <Modal
        title="Ajouter une tâche"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={handleAddTask}
          layout="vertical"
          initialValues={{ title: "", description: "" }}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Ajouter la tâche
            </Button>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginTop: 10 }}
              block
            >
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TasksPage;
