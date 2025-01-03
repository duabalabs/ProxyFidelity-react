import type { FC, PropsWithChildren } from "react";
import { RowsPhotoAlbum } from "react-photo-album";

import { List } from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";

import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Skeleton, Space, Spin } from "antd";

import { ListTitleButton } from "@/components";
import { FilePreviewModal } from "@/routes/files/components/file-preview-modal";

import { useGalleryListActions } from "./actions";

import "react-photo-album/rows.css";

export const GalleryListPage: FC<PropsWithChildren> = ({ children }) => {
  const {
    screens,
    photoItem,
    isModalVisible,
    setIsModalVisible,
    searchFormProps,
    filters,
    debouncedOnChange,
    handleRowClick,
    photos,
    isLoading,
  } = useGalleryListActions();

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => {
          return (
            <Space
              style={{
                marginTop: screens.xs ? "1.6rem" : undefined,
              }}
            >
              <Form
                {...searchFormProps}
                initialValues={{
                  name: getDefaultFilter("nam", filters, "contains"),
                }}
                layout="inline"
              >
                <Form.Item name="name" noStyle>
                  <Input
                    size="large"
                    prefix={
                      <SearchOutlined
                        className="anticon tertiary"
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                    suffix={<Spin size="small" spinning={isLoading} />}
                    placeholder="Search by name"
                    onChange={debouncedOnChange}
                  />
                </Form.Item>
              </Form>
            </Space>
          );
        }}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        title={<ListTitleButton buttonText="Add Media" toPath="gallery" />}
      >
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} round />
          ))}
        {!isLoading && (
          <RowsPhotoAlbum photos={photos} onClick={handleRowClick} />
        )}
      </List>
      {children}

      {/* Modal for File Preview */}
      {photoItem && (
        <FilePreviewModal
          isVisible={isModalVisible}
          photo={photoItem.photo}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};
