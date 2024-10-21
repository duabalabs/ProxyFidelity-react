import { createContext, useContext, useEffect, useState } from "react";

import Parse from "parse";

import { Project, User } from "../lib/parse";

type AppDataType = {
  activeProject: Project;
  updateActiveProject: (project: Project) => Promise<void>;
  projects: Project[];
  fetchProjects: () => void;
};
const AppDataContext = createContext<AppDataType>({} as AppDataType);

export const AppDataProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getInitialData = async () => {
      const getUser = Parse.User.current() as User;
      setUser(getUser);
      const userActiveProject = getUser.get("activeProject");
      await userActiveProject?.fetch();
      setActiveProject(userActiveProject);
    };
    getInitialData();
  }, []);

  const fetchProjects = async () => {
    const query = new Parse.Query(Project);
    const results = await query.find();
    setProjects(results);
  };

  const updateActiveProject = async (project) => {
    setActiveProject(project);
    user?.set("activeProject", project);
    await user.save();
  };

  return (
    <AppDataContext.Provider
      value={{ activeProject, updateActiveProject, projects, fetchProjects }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  return useContext(AppDataContext);
};
