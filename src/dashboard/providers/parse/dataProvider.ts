import {
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";

import Parse from "parse";

export const dataProvider: DataProvider = {
  getList: async <TData>({
    resource,
    pagination,
    filters,
    sort,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    const { current = 1, pageSize = 10 } = pagination ?? {};
    const query = new Parse.Query(resource);

    // Apply filters if provided
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === "eq") {
          query.equalTo(filter.field, filter.value);
        }
      });
    }

    // Apply sorting if provided
    if (sort && sort.length > 0) {
      const { field, order } = sort[0];
      if (order === "asc") {
        query.ascending(field);
      } else {
        query.descending(field);
      }
    }

    // Apply pagination
    query.skip((current - 1) * pageSize);
    query.limit(pageSize);

    try {
      const results = await query.find();
      const total = await query.count();

      return {
        data: results.map((item) => ({
          id: item.id,
          ...item.toJSON(),
        })) as TData[],
        total,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getOne: async <TData>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const query = new Parse.Query(resource);
    try {
      const result = await query.get(`${id}`);
      return {
        data: { id: result.id, ...result.toJSON() } as TData,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  create: async <TData, TVariables>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const ParseObject = Parse.Object.extend(resource);
    const parseInstance = new ParseObject();

    Object.keys(variables).forEach((key) => {
      parseInstance.set(key, variables[key]);
    });

    try {
      const result = await parseInstance.save();
      return {
        data: { id: result.id, ...result.toJSON() } as TData,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  update: async <TData, TVariables>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const query = new Parse.Query(resource);
    try {
      const parseInstance = await query.get(`${id}`);

      Object.keys(variables).forEach((key) => {
        parseInstance.set(key, variables[key]);
      });

      const result = await parseInstance.save();
      return {
        data: { id: result.id, ...result.toJSON() } as TData,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  deleteOne: async <TData, TVariables>({
    resource,
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const query = new Parse.Query(resource);
    try {
      const parseInstance = await query.get(`${id}`);
      await parseInstance.destroy();
      return { data: { id } as TData };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Other methods (getMany, updateMany, deleteMany, etc.) can be implemented similarly

  getApiUrl: (): string => {
    return Parse.serverURL ?? "";
  },
};
