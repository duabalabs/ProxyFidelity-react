import { useCallback, useEffect, useState } from "react";

import { Button, List, Modal } from "antd";
import Parse from "parse";

import { useAppData } from "@/dashboard/context/app-data";

import { Project } from "../lib/parse";

export const ProjectSelectorModal = ({ isVisible, onClose }) => {
  const { updateActiveProject } = useAppData();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const query = new Parse.Query(Project);
      const results = await query.find();
      setProjects(results);
    };
    fetchProjects();
  }, []);

  const handleProjectSelect = useCallback(
    async (project) => {
      await updateActiveProject(project);
      window.location.reload();
    },
    [updateActiveProject]
  );

  return (
    <Modal open={isVisible} onCancel={onClose} title="Select a Project">
      <List
        dataSource={projects}
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
