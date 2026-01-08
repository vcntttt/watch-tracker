import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { AddWorkDialog } from "@/components/add-work-dialog";
import { LibraryTable } from "@/components/library-table";
import { workFromDoc } from "@/lib/works";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/library")({
	ssr: false,
	component: LibraryPage,
});

function LibraryPage() {
	const docs = useQuery(api.works.list, {});
	const works = (docs ?? []).map(workFromDoc);

	return (
		<div className="container mx-auto p-4 md:p-6 space-y-6">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">Library</h1>
					<p className="text-sm text-muted-foreground">
						Search, filter, and sort all your works.
					</p>
				</div>
				<AddWorkDialog />
			</div>

			<LibraryTable works={works} />
		</div>
	);
}
