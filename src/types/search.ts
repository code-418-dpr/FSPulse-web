
import { EventLevel, RequestStatus } from "@/app/generated/prisma";
import { DateValue } from "@internationalized/date";

// Базовые параметры поиска (без пагинации и representativeId)
export interface SearchParams {
  query?: string;
  disciplineIds?: string[];
  levels?: EventLevel[];
  statuses?: RequestStatus[];
  dateRange?: {
    start?: DateValue;
    end?: DateValue;
  };
}

// Полные параметры для функции searchRepresentativeRequests
export interface SearchRepresentativeRequestsParams extends SearchParams {
  representativeId: string;
  page: number;
  pageSize: number;
  minApplicationTime?: Date;
  maxApplicationTime?: Date;
}

// Тип для ответа от searchRepresentativeRequests
export interface SearchRepresentativeRequestsResult<T = unknown> {
  results: T[];
  totalItems: number;
  totalPages: number;
}