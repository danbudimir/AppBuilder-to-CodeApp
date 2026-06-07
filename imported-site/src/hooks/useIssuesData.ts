import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IssuesService } from "@/api/services/IssuesService";
import { BuildingsService } from "@/api/services/BuildingsService";
import { RoomsService } from "@/api/services/RoomsService";
import { AccountsService, type AccountRecord } from "@/api/services/AccountsService";
import type { Issues } from "@/api/models/IssuesModel";
import type { Buildings } from "@/api/models/BuildingsModel";
import type { Rooms } from "@/api/models/RoomsModel";

export function useIssues() {
  return useQuery<Issues[], Error>({
    queryKey: ["issues"],
    queryFn: async () => {
      let result;
      try {
        result = await IssuesService.getAll();
      } catch {
        throw new Error("Unable to connect to data service");
      }
      if (result.success && result.data) return result.data;
      throw new Error("Failed to load issues");
    },
  });
}

export function useBuildings() {
  return useQuery<Buildings[], Error>({
    queryKey: ["buildings"],
    queryFn: async () => {
      let result;
      try {
        result = await BuildingsService.getAll();
      } catch {
        throw new Error("Unable to connect to data service");
      }
      if (result.success && result.data) return result.data;
      throw new Error("Failed to load buildings");
    },
  });
}

export function useRooms() {
  return useQuery<Rooms[], Error>({
    queryKey: ["rooms"],
    queryFn: async () => {
      let result;
      try {
        result = await RoomsService.getAll();
      } catch {
        throw new Error("Unable to connect to data service");
      }
      if (result.success && result.data) return result.data;
      throw new Error("Failed to load rooms");
    },
  });
}

export function useAccounts() {
  return useQuery<AccountRecord[], Error>({
    queryKey: ["accounts"],
    queryFn: async () => {
      let result;
      try {
        result = await AccountsService.getAll();
      } catch {
        throw new Error("Unable to connect to Dataverse account data source");
      }
      if (result.success && result.data) return result.data;
      throw new Error("Failed to load accounts");
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Issues, "ID">) => {
      let result;
      try {
        result = await IssuesService.create(payload);
      } catch {
        throw new Error("Create operation failed");
      }
      if (!result.success) throw new Error("Failed to create issue");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

export function useUpdateIssueStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      let result;
      try {
        result = await IssuesService.update(id, { status: { Value: status } });
      } catch {
        throw new Error("Update operation failed");
      }
      if (!result.success) throw new Error("Failed to update issue");
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}

