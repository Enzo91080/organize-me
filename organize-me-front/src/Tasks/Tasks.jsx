import { useState, useEffect } from "react";
import taskApi from "./services/task.api";
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Card,
  Radio,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";

export default function Tasks({ tasks, completedTasks, fetchTasks }) {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState(
    sessionStorage.getItem("viewMode") || "grid"
  );
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [form] = Form.useForm();

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const toggleTaskCompletion = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await taskApi.updateTask(task._id, updatedTask);
      fetchTasks();
      message.success(`Tâche "${task.title}" mise à jour.`);
    } catch (err) {
      message.error("Erreur lors de la mise à jour du statut de la tâche.");
      console.error("Error toggling task completion:", err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTasks(tasks);
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

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
    });
  };

  const handleUpdateTask = async (values) => {
    try {
      const updatedTask = { ...editingTask, ...values };
      await taskApi.updateTask(editingTask._id, updatedTask);
      fetchTasks();
      setEditingTask(null);
      message.success("Tâche mise à jour avec succès !");
    } catch (err) {
      message.error("Erreur lors de la mise à jour de la tâche.");
      console.error("Error updating task:", err);
    }
  };

  const handleViewChange = (e) => {
    const newViewMode = e.target.value;
    setViewMode(newViewMode);
    sessionStorage.setItem("viewMode", newViewMode);
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTasks((prev) => {
      const newExpandedTasks = new Set(prev);
      if (newExpandedTasks.has(taskId)) {
        newExpandedTasks.delete(taskId);
      } else {
        newExpandedTasks.add(taskId);
      }
      return newExpandedTasks;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-semibold mb-6">
        Tableau de bord des tâches
      </h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <Input
          placeholder="Rechercher une tâche par titre ou description"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Sélecteur de mode d'affichage */}
      <div className="mb-4 text-center">
        <Radio.Group value={viewMode} onChange={handleViewChange}>
          <Radio.Button value="grid">Grille</Radio.Button>
          <Radio.Button value="list">Liste</Radio.Button>
        </Radio.Group>
      </div>

      {/* Tâches en cours */}
      <h2 className="text-xl font-bold mb-4">Tâches en cours</h2>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            : ""
        }
      >
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={viewMode === "list" ? "mb-4 border p-4 rounded" : ""}
          >
            <Card
              hoverable
              style={{
                width: "100%",
                position: "relative",
              }}
              className={viewMode === "list" ? "shadow-none" : ""}
            >
              <Popconfirm
                title="Êtes-vous sûr de vouloir marquer cette tâche comme terminée ?"
                onConfirm={() => toggleTaskCompletion(task)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckOutlined />}
                  size="large"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: task.completed ? "green" : "gray",
                    borderColor: task.completed ? "green" : "gray",
                  }}
                ></Button>
              </Popconfirm>

              <Card.Meta
                title={task.title}
                description={
                  <div>
                    <div
                      className={`text-gray-600 ${
                        expandedTasks.has(task._id) ||
                        task.description.length <= 100
                          ? ""
                          : "truncate"
                      }`}
                      style={{
                        maxHeight:
                          expandedTasks.has(task._id) ||
                          task.description.length <= 100
                            ? "none"
                            : "4.5rem",
                        overflow: expandedTasks.has(task._id)
                          ? "visible"
                          : "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.description}
                    </div>
                    {task.description.length > 100 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => toggleExpandTask(task._id)}
                        className="p-0 mt-2"
                      >
                        {expandedTasks.has(task._id)
                          ? "Voir moins"
                          : "Voir plus"}
                      </Button>
                    )}
                  </div>
                }
              />
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
                  title="Êtes-vous sûr de vouloir supprimer cette tâche ?"
                  onConfirm={() =>
                    taskApi.deleteTask(task._id).then(fetchTasks)
                  }
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="danger" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Tâches terminées */}
      <h2 className="text-xl font-bold mt-8 mb-4">Tâches terminées</h2>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            : ""
        }
      >
        {completedTasks.map((task) => (
          <div
            key={task._id}
            className={viewMode === "list" ? "mb-4 border p-4 rounded" : ""}
          >
            <Card
              hoverable
              style={{
                width: "100%",
                position: "relative",
              }}
              className={viewMode === "list" ? "shadow-none" : ""}
            >
              <Button
                onClick={() => toggleTaskCompletion(task)}
                type="primary"
                shape="circle"
                icon={<CheckOutlined />}
                size="large"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: task.completed ? "green" : "gray",
                  borderColor: task.completed ? "green" : "gray",
                }}
              />

              <Card.Meta
                title={task.title}
                description={
                  <div>
                    <div
                      className={`text-gray-600 ${
                        expandedTasks.has(task._id) ||
                        task.description.length <= 100
                          ? ""
                          : "truncate"
                      }`}
                      style={{
                        maxHeight:
                          expandedTasks.has(task._id) ||
                          task.description.length <= 100
                            ? "none"
                            : "4.5rem",
                        overflow: expandedTasks.has(task._id)
                          ? "visible"
                          : "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.description}
                    </div>
                    {task.description.length > 100 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => toggleExpandTask(task._id)}
                        className="p-0 mt-2"
                      >
                        {expandedTasks.has(task._id)
                          ? "Voir moins"
                          : "Voir plus"}
                      </Button>
                    )}
                  </div>
                }
              />
            </Card>
          </div>
        ))}
      </div>

      {/* Modale pour modifier une tâche */}
      <Modal
        title="Modifier la tâche"
        visible={!!editingTask}
        onCancel={() => setEditingTask(null)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateTask}
          initialValues={{
            title: editingTask?.title,
            description: editingTask?.description,
          }}
        >
          <Form.Item
            name="title"
            label="Titre de la tâche"
            rules={[{ required: true, message: "Le titre est requis !" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "La description est requise !" },
            ]}
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
    </div>
  );
}
