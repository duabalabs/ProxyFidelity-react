import { useCallback } from "react";

import { useList } from "@refinedev/core";

import { Button, List, Modal } from "antd";

import { useAppData } from "@/dashboard/context/app-data";

import { Project } from "../lib/parse";

export const ProjectSelectorModal = ({ isVisible, onClose }) => {
  const { updateActiveProject } = useAppData();

  const { data: projects, isLoading } = useList<Project>({
    resource: "Project",
  });

  const handleProjectSelect = useCallback(
    async (project) => {
      await updateActiveProject(project);
      window.location.reload();
    },
    [updateActiveProject]
  );

  return (
    <Modal visible={isVisible} onCancel={onClose} title="Select a Project">
      <List
        dataSource={projects?.data}
        renderItem={(project) => (
          <List.Item
            actions={[
              <Button onClick={() => handleProjectSelect(project)}>
                Select
              </Button>,
            ]}
          >
            {project?.name}
          </List.Item>
        )}
      />
    </Modal>
  );
};
