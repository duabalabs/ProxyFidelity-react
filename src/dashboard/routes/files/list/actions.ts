import { useMemo, useState } from "react";
import { ClickHandlerProps, Photo } from "react-photo-album";

import { useTable } from "@refinedev/antd";

import { Grid } from "antd";
import debounce from "lodash/debounce";

import { useAppData } from "@/dashboard/context/app-data";
import { useFetchPresignedUrl } from "@/dashboard/hooks";
import { ProjectFile, PROJECTFILE_CLASSNAME } from "@/dashboard/lib/parse";

export const useDocumentListActions = () => {
  const screens = Grid.useBreakpoint();
  const [file, setFile] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeProject } = useAppData();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<ProjectFile>({
    resource: PROJECTFILE_CLASSNAME,
    queryOptions: {
      cacheTime: 0,
    },
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: (values as any).name,
        },
      ];
    },
    filters: {
      permanent: [
        {
          field: "project",
          value: activeProject,
          operator: "eq",
        },
        {
          field: "document",
          value: true,
          operator: "eq",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

  const handleRowClick = (record) => {
    if (record?.cdnUrl || record?.originalUrl) {
      setFile(record);
      setIsModalVisible(true);
    } else {
      console.error("File not found in the record.");
    }
  };
  return {
    screens,
    file,
    setFile,
    isModalVisible,
    setIsModalVisible,
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQueryResult,
    onSearch,
    debouncedOnChange,
    handleRowClick,
  };
};

export const useGalleryListActions = () => {
  const screens = Grid.useBreakpoint();
  const [photoItem, setPhotoItem] = useState<ClickHandlerProps<Photo>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeProject } = useAppData();

  const {
    tableProps,
    searchFormProps,
    filters,
    sorters,
    tableQuery: tableQueryResult,
  } = useTable<ProjectFile>({
    resource: PROJECTFILE_CLASSNAME,
    queryOptions: {
      cacheTime: 0,
    },
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: (values as any).name,
        },
      ];
    },
    filters: {
      permanent: [
        {
          field: "project",
          value: activeProject,
          operator: "eq",
        },
        {
          field: "media",
          value: true,
          operator: "eq",
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
  });

  const { preSignedUrlFiles } = useFetchPresignedUrl(
    tableQueryResult?.data?.data
  );

  const photos = useMemo(() => {
    return (
      preSignedUrlFiles?.map?.((file) => ({
        src: file?.presignedUrl,
        width: 300,
        height: 300,
      })) ?? []
    );
  }, [preSignedUrlFiles]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFormProps?.onFinish?.({
      name: e.target.value ?? "",
    });
  };

  const debouncedOnChange = debounce(onSearch, 500);

  const handleRowClick = (item: ClickHandlerProps<Photo>) => {
    console.log(item);
    setPhotoItem(item);
    setIsModalVisible(true);
  };
  return {
    screens,
    photoItem,
    isModalVisible,
    setIsModalVisible,
    tableProps,
    searchFormProps,
    filters,
    sorters,
    photos,
    tableQueryResult,
    onSearch,
    debouncedOnChange,
    handleRowClick,
  };
};
