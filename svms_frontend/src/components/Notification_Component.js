import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import { Dropdown, Badge, ListGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="notification-container">
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <FaBell size={24} />
          {notifications.length > 0 && (
            <Badge bg="danger" className="notification-badge">
              {notifications.length}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notification-dropdown">
          <h6 className="px-3 pt-2">Notifications</h6>
          <ListGroup variant="flush">
            {notifications.length === 0 ? (
              <ListGroup.Item className="text-muted text-center">
                No new notifications.
              </ListGroup.Item>
            ) : (
              notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`d-flex justify-content-between align-items-start ${
                    notification.isRead ? "bg-light" : "bg-white"
                  }`}
                >
                  <div>
                    <strong className={notification.isRead ? "text-muted" : "text-dark"}>
                      {notification.title}
                    </strong>
                    <p className="mb-1 text-muted">{notification.message}</p>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </small>
                  </div>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <OverlayTrigger overlay={<Tooltip>Mark as Read</Tooltip>}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="ms-2"
                        >
                          <FaCheck />
                        </Button>
                      </OverlayTrigger>
                    )}

                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="ms-2"
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
