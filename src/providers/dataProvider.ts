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
    const { current = 1, pageSize = 100 } = pagination ?? {};
    const query = new Parse.Query(resource);

    // Apply filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === "eq") {
          query.equalTo(filter.field, filter.value);
        }
      });
    }

    // Apply sorting
    if (sort && sort.length > 0) {
      const { field, order } = sort[0];
      order === "asc" ? query.ascending(field) : query.descending(field);
    }

    // Apply pagination
    query.skip((current - 1) * pageSize);
    query.limit(pageSize);

    try {
      // Fetch from Local Datastore first
      // const resultsFromCache = await query.fromLocalDatastore().find();

      // if (resultsFromCache.length > 0) {
      //   return {
      //     data: resultsFromCache.map((item) => ({
      //       id: item.id,
      //       ...item.toJSON(),
      //       _parseObject: item, // Keep reference to Parse object
      //     })) as TData[],
      //     total: resultsFromCache.length, // Local Datastore doesn't count total
      //   };
      // }

      // Fallback to server fetch if no data in cache
      const results = await query.find();
      const total = await query.count();

      // Cache fetched data locally
      // await Parse.Object.pinAll(results);

      return {
        data: results.map((item) => ({
          id: item.id,
          ...item.toJSON(),
          _parseObject: item,
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
      // Check Local Datastore first
      const resultFromCache = await query.fromLocalDatastore().get(id as any);

      if (resultFromCache) {
        return {
          data: {
            id: resultFromCache.id,
            ...resultFromCache.toJSON(),
            _parseObject: resultFromCache,
          } as TData,
        };
      }

      // Fallback to direct fetch if not in cache
      const result = await query.get(id as any);
      await result.pin(); // Pin the fetched object locally

      return {
        data: {
          id: result.id,
          ...result.toJSON(),
          _parseObject: result,
        } as TData,
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
      await result.pin(); // Pin the new object to Local Datastore

      return {
        data: {
          id: result.id,
          ...result.toJSON(),
          _parseObject: result,
        } as TData,
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
      const parseInstance = await query.get(id as any);

      Object.keys(variables).forEach((key) => {
        parseInstance.set(key, variables[key]);
      });

      const result = await parseInstance.save();
      await result.pin(); // Update local cache

      return {
        data: {
          id: result.id,
          ...result.toJSON(),
          _parseObject: result,
        } as TData,
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
      const parseInstance = await query.get(id as any);
      await parseInstance.destroy();
      await parseInstance.unPin(); // Remove from local cache

      return { data: { id } as TData };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getApiUrl: (): string => {
    return Parse.serverURL ?? "";
  },
};
