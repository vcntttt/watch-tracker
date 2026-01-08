export type WorkType = "book" | "movie" | "series" | "anime" | "manga";

export type WorkStatus = "backlog" | "in-progress" | "finished" | "dropped";

export type WorkId = import("../../convex/_generated/dataModel").Id<"works">;

export interface Work {
	id: WorkId;
	title: string;
	type: WorkType;
	status: WorkStatus;
	rating?: number; // 1-5
	review?: string;
	tags: string[];
	notes?: string; // markdown
	coverUrl?: string;
	creator?: string; // author, director, studio
	year?: number;
	// Progress tracking
	progress?: {
		current: number;
		total: number;
	};
	// Dates
	startedAt?: number;
	finishedAt?: number;
	createdAt: number;
	updatedAt: number;
}
