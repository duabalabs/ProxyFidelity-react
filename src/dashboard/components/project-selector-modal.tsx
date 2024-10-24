import { useCallback, useEffect, useState } from "react";

import { Button, List, Modal, Spin } from "antd";
import Parse from "parse";

import { useAppData } from "@/dashboard/context/app-data";

import { Project } from "../lib/parse";

export const ProjectSelectorModal = ({ isVisible, onClose }) => {
  const { updateActiveProject, activeProject } = useAppData();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const query = new Parse.Query(Project);
      const results = await query.find();
      setProjects(results);
      if (!activeProject) {
        updateActiveProject(results[0]);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectSelect = useCallback(
    async (project) => {
      setLoading(true);
      await updateActiveProject(project);
      setLoading(false);
      onClose();
    },
    [updateActiveProject]
  );

  return (
    <Modal open={isVisible} onCancel={onClose} title="Select a Project">
      <Spin spinning={loading}>
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
      </Spin>
    </Modal>
  );
};
