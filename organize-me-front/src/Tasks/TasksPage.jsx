import { useState, useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import PageCanvas from "../Common/components/Panels/PageCanvas";
import Tasks from "./Tasks";
import taskApi from "./services/task.api";

const TasksPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]); // Tâches en cours
  const [completedTasks, setCompletedTasks] = useState([]); // Tâches terminées
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAllTasks();
      const ongoingTasks = response.filter((task) => !task.completed);
      const doneTasks = response.filter((task) => task.completed);
      setTasks(ongoingTasks);
      setCompletedTasks(doneTasks);
    } catch (err) {
      message.error("Erreur lors de la récupération des tâches.");
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleAddTask = async (values) => {
    setLoading(true);
    try {
      const newTask = await taskApi.createTask(values);
      message.success("Tâche ajoutée avec succès !");
      fetchTasks();
      setIsModalVisible(false);
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
          <Button type="primary" onClick={showModal}>
            Créer une tâche
          </Button>
        </PageCanvas.Actions>

        <PageCanvas.Content>
          <Tasks tasks={tasks} completedTasks={completedTasks} fetchTasks={fetchTasks} />
        </PageCanvas.Content>
      </PageCanvas>

      <Modal
        title="Ajouter une tâche"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTask} layout="vertical">
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
            <Button type="primary" htmlType="submit" loading={loading} block>
              Ajouter la tâche
            </Button>
            <Button type="default" onClick={handleCancel} style={{ marginTop: 10 }} block>
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TasksPage;


