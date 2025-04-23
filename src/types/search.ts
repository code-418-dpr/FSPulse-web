import { Discipline, EventLevel, RequestStatus } from "@/app/generated/prisma";

export interface SearchParams {
    query?: string;
    disciplineId?: string; // Изменили на одиночное значение
    level?: EventLevel; // Изменили на одиночное значение
    requestStatus?: RequestStatus; // Изменили на одиночное значение
    minApplicationTime?: Date;
    maxApplicationTime?: Date;
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
    representativeId: string;
    query?: string;
    disciplineId?: string;
    minStartTime?: Date;
    maxStartTime?: Date;
    level?: EventLevel;
    minAge?: number;
    maxAge?: number;
    isOnline?: boolean;
    isTeamFormatAllowed?: boolean;
    isPersonalFormatAllowed?: boolean;
}
