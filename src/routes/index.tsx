import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { AddWorkDialog } from "@/components/add-work-dialog";
import { DashboardSection } from "@/components/dashboard-section";
import { workFromDoc } from "@/lib/works";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/")({
	ssr: false,
	component: DashboardPage,
});

function DashboardPage() {
	const docs = useQuery(api.works.list, {});
	const works = (docs ?? []).map(workFromDoc);

	const inProgress = works.filter((w) => w.status === "in-progress");
	const backlog = works.filter((w) => w.status === "backlog");
	const finished = works.filter((w) => w.status === "finished");

	return (
		<div className="container mx-auto p-4 md:p-6 space-y-8">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
					<p className="text-sm text-muted-foreground">
						Track what you want to watch/read, what you’re currently doing, and
						what you’ve finished.
					</p>
				</div>
				<AddWorkDialog />
			</div>

			<DashboardSection
				title="In Progress"
				works={inProgress}
				variant="default"
				emptyMessage="Start something new by adding a work."
			/>
			<DashboardSection
				title="Backlog"
				works={backlog}
				variant="compact"
				emptyMessage="Your backlog is empty."
			/>
			<DashboardSection
				title="Finished"
				works={finished}
				variant="compact"
				emptyMessage="Nothing finished yet."
			/>
		</div>
	);
}
