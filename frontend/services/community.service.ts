import { request } from "@/lib/request";
import { ApiResponse, Community, CommunityMessage } from "@/types";

export interface PaginationMessages {
    messages: CommunityMessage[];
    nextCursor: string | null;
    hasMore: boolean;
}

export const communityService = {
    listAll: () =>
        request.get<ApiResponse<{ communities: Community[] }>>("/api/communities"),

    getOne: (communityId: string) =>
        request.get<ApiResponse<{ community: Community }>>(`/api/communities/${communityId}`),

    join: (communityId: string) =>
        request.post<ApiResponse<null>>(`/api/communities/${communityId}/join`),

    leave: (communityId: string) =>
        request.delete<ApiResponse<null>>(`/api/communities/${communityId}/leave`),

    getMessages: (communityId: string, cursor?: string, limit = 20) =>
        request.get<ApiResponse<PaginationMessages>>(
            `/api/communities/${communityId}/messages`,
            { cursor, limit }
        )
}