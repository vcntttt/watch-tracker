import type { Doc } from "../../convex/_generated/dataModel";
import type { Work } from "./types";

export type WorkDoc = Doc<"works">;

export function workFromDoc(doc: WorkDoc): Work {
	const { _id, _creationTime, ...rest } = doc;
	void _creationTime;
	return { id: _id, ...rest };
}
