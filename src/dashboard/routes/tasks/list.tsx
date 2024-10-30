import { type FC, type PropsWithChildren, useMemo } from "react";

import {
  type HttpError,
  useList,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";

import { ClearOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import type { MenuProps } from "antd";

import { Task, TASK_CLASSNAME } from "@/dashboard/lib";

import {
  KanbanAddCardButton,
  KanbanBoard,
  KanbanBoardSkeleton,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanItem,
  ProjectCardMemo,
  ProjectCardSkeleton,
} from "./components";

type TaskStageColumn = {
  id: string;
  title: string;
  tasks: Task[];
};

export const KanbanPage: FC<PropsWithChildren> = ({ children }) => {
  const { replace } = useNavigation();

  const stages = ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"];

  const { data: tasks, isLoading: isLoadingTasks } = useList<Task>({
    resource: TASK_CLASSNAME,
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    queryOptions: {
      cacheTime: 0,
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },
    // meta: {
    //   gqlQuery: KANBAN_TASKS_QUERY,
    // },
  });

  // its convert Task[] to TaskStage[] (group by stage) for kanban
  // uses `stages` and `tasks` from useList hooks
  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages)
      return {
        unassignedStage: [],
        stages: [],
      };

    const unassignedStage = tasks.data.filter((task) => task.stage === null);

    // prepare unassigned stage
    const grouped = stages.map((stage) => ({
      id: stage,
      title: stage,
      tasks: tasks.data.filter((task) => task.stage?.toString() === stage),
    }));

    return {
      unassignedStage,
      stages: grouped,
    };
  }, [tasks, stages]);

  const { mutate: updateTask } = useUpdate<Task, HttpError>({
    resource: TASK_CLASSNAME,
    successNotification: false,
    mutationMode: "optimistic",
  });

  const { mutate: updateManyTask } = useUpdateMany({
    resource: TASK_CLASSNAME,
    successNotification: false,
  });

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stage = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStage = event.active.data.current?.stage;
    console.log(taskId);
    console.log(event);
    if (taskStage === stage) {
      return;
    }

    if (stage === "unassigned") {
      stage = null;
    }

    updateTask({
      id: taskId,
      values: {
        stage: stage,
      },
    });
  };

  const handleAddCard = (args: { stage: string }) => {
    const path =
      args.stage === "unassigned" ? "create" : `create?stage=${args.stage}`;

    replace(path);
  };

  const handleClearCards = (args: { taskIds: string[] }) => {
    updateManyTask({
      ids: args.taskIds,
      values: {
        stage: null,
      },
    });
  };

  const getContextMenuItems = (column: TaskStageColumn) => {
    const hasItems = column.tasks.length > 0;

    const items: MenuProps["items"] = [
      {
        label: "Clear all cards",
        key: "2",
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <ClearOutlined />,
        disabled: !hasItems,
        onClick: () =>
          handleClearCards({
            taskIds: column.tasks.map((task) => task.id),
          }),
      },
    ];

    return items;
  };

  const isLoading = isLoadingTasks;

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoard onDragEnd={handleOnDragEnd}>
        <KanbanColumn
          id={"unassigned"}
          title={"unassigned"}
          count={taskStages?.unassignedStage?.length || 0}
          onAddClick={() => handleAddCard({ stage: "unassigned" })}
        >
          {taskStages.unassignedStage?.map((task) => {
            return (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ task, stage: "unassigned" }}
              >
                <ProjectCardMemo task={task} />
              </KanbanItem>
            );
          })}
          {!taskStages.unassignedStage?.length && (
            <KanbanAddCardButton
              onClick={() => handleAddCard({ stage: "unassigned" })}
            />
          )}
        </KanbanColumn>
        {taskStages.stages?.map((column) => {
          const contextMenuItems = getContextMenuItems(column);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
              contextMenuItems={contextMenuItems}
              onAddClick={() => handleAddCard({ stage: column.id })}
            >
              {isLoading && <ProjectCardSkeleton />}
              {!isLoading &&
                column.tasks.map((task) => {
                  return (
                    <KanbanItem
                      key={task.id}
                      id={task.id}
                      data={{
                        task,
                        stage: column.id,
                      }}
                    >
                      <ProjectCardMemo task={task} />
                    </KanbanItem>
                  );
                })}
              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stage: column.id })}
                />
              )}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardSkeleton>
      {Array.from({ length: columnCount }).map((_, index) => {
        return (
          <KanbanColumnSkeleton key={index} type="project">
            {Array.from({ length: itemCount }).map((_, index) => {
              return <ProjectCardSkeleton key={index} />;
            })}
          </KanbanColumnSkeleton>
        );
      })}
    </KanbanBoardSkeleton>
  );
};
