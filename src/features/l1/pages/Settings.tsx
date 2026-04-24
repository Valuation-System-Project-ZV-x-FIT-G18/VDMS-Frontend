<<<<<<< managers-portal
import { useState } from "react";
import { Switch, Button, Select, Card, Divider, Space } from "antd";
import {
  BellOutlined,
  LockOutlined,
  UserOutlined,
  SaveOutlined,
} from "@ant-design/icons";

export default function L1SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    reportReminders: true,
    language: "en",
    theme: "light",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("l1-settings", JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <h1 style={{ marginBottom: "24px" }}>L1 Manager Settings</h1>

      {/* Notification Settings */}
      <Card
        title={
          <span style={{ color: "#3b82f6" }}>
            <BellOutlined style={{ marginRight: "8px" }} />
            Notification Settings
          </span>
        }
        style={{ marginBottom: "16px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span>Enable All Notifications</span>
          <Switch
            checked={settings.notifications}
            onChange={(value) => handleChange("notifications", value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <span>Email Alerts</span>
          <Switch
            checked={settings.emailAlerts}
            onChange={(value) => handleChange("emailAlerts", value)}
            disabled={!settings.notifications}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Report Reminders</span>
          <Switch
            checked={settings.reportReminders}
            onChange={(value) => handleChange("reportReminders", value)}
            disabled={!settings.notifications}
          />
        </div>
      </Card>

      <Divider />

      {/* Preference Settings */}
      <Card
        title={
          <span style={{ color: "#3b82f6" }}>
            <UserOutlined style={{ marginRight: "8px" }} />
            Preferences
          </span>
        }
        style={{ marginBottom: "16px" }}
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Language
          </label>
          <Select
            value={settings.language}
            onChange={(value) => handleChange("language", value)}
            style={{ width: "100%" }}
          >
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="es">Spanish</Select.Option>
            <Select.Option value="fr">French</Select.Option>
          </Select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Theme</label>
          <Select
            value={settings.theme}
            onChange={(value) => handleChange("theme", value)}
            style={{ width: "100%" }}
          >
            <Select.Option value="light">Light</Select.Option>
            <Select.Option value="dark">Dark</Select.Option>
          </Select>
        </div>
      </Card>

      <Divider />

      {/* Security Settings */}
      <Card
        title={
          <span style={{ color: "#3b82f6" }}>
            <LockOutlined style={{ marginRight: "8px" }} />
            Security
          </span>
        }
        style={{ marginBottom: "16px" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button block>Change Password</Button>
          <Button block>Two-Factor Authentication</Button>
        </Space>
      </Card>

      <Divider />

      {/* Save Button */}
      <Space>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
        {isSaved && (
          <span style={{ color: "#10b981" }}>
            ✓ Settings saved successfully
          </span>
        )}
      </Space>
    </div>
  );
}
=======
const L1SettingsPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Settings</h1>
      <p>L1 Manager settings page</p>
    </div>
  );
};

export default L1SettingsPage;
>>>>>>> dev
