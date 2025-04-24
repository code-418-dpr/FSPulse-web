import { Discipline, EventLevel, RequestStatus } from "@/app/generated/prisma";

export interface SearchParams {
    query?: string;
    disciplineId?: string;
    level?: EventLevel;
    requestStatus?: RequestStatus;
    minApplicationTime?: Date;
    maxApplicationTime?: Date;
    minStartTime?: Date;
    maxStartTime?: Date;
    minAge?: number;
    maxAge?: number;
    isOnline?: boolean;
    isTeamFormatAllowed?: boolean;
    isPersonalFormatAllowed?: boolean;
}
export interface Paged<T> {
    results: T[];
    totalItems: number;
    totalPages: number;
}

export interface SearchRepresentativeEventRequestsParams {
    page: number;
    pageSize: number;
    representativeId?: string;
    query?: string;
    disciplineId?: string;
    minApplicationTime?: Date;
    maxApplicationTime?: Date;
    level?: EventLevel;
    requestStatus?: RequestStatus;
}

export interface RepresentativeRequestItem {
    id: string;
    name: string;
    cover: Uint8Array;
    applicationTime: Date;
    level: EventLevel;
    requestStatus: RequestStatus;
    discipline: Discipline;
}

export interface SearchRepresentativeEventsParams {
    page: number;
    pageSize: number;
    representativeId?: string;
    query?: string;
    disciplineId?: string;
    minStartTime?: Date;
    maxStartTime?: Date;
    level?: EventLevel;
    requestStatus?: RequestStatus;
    minAge?: number;
    maxAge?: number;
    isOnline?: boolean;
    isTeamFormatAllowed?: boolean;
    isPersonalFormatAllowed?: boolean;
}

export interface BaseSearchParams {
    query?: string;
    disciplineId?: string;
    level?: EventLevel;
}

export interface DateRangeParams {
    minStartTime?: Date;
    maxStartTime?: Date;
    minApplicationTime?: Date;
    maxApplicationTime?: Date;
}

export interface FormatParams {
    isOnline?: boolean;
    isTeamFormatAllowed?: boolean;
    isPersonalFormatAllowed?: boolean;
}

export interface AgeParams {
    minAge?: number;
    maxAge?: number;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface RepresentativeParams {
    representativeId?: string;
}

export interface RequestStatusParams {
    requestStatus?: RequestStatus;
}
export type UniversalSearchParams = BaseSearchParams &
    Partial<DateRangeParams> &
    Partial<FormatParams> &
    Partial<AgeParams> &
    Partial<PaginationParams> &
    Partial<RepresentativeParams> &
    Partial<RequestStatusParams>;
