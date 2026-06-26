import { useState } from "react";
import { Switch, Button, Select, Card, Divider, Space } from "antd";
import {
  BellOutlined,
  LockOutlined,
  UserOutlined,
  SaveOutlined,
} from "@ant-design/icons";

export default function TechnicalOfficerSettingsPage() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    jobReminders: true,
    language: "en",
    theme: "light",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(
      "technical-officer-settings",
      JSON.stringify(settings),
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <h1 style={{ marginBottom: "24px" }}>Technical Officer Settings</h1>

      {/* Notification Settings removed */}

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
      {/* ...existing code... */}
    </div>
  );
}
