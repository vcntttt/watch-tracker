import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Trash2 } from "@/components/icons";
import { StarRating } from "@/components/star-rating";
import { StatusBadge } from "@/components/status-badge";
import { TypeBadge } from "@/components/type-badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { WorkId, WorkStatus } from "@/lib/types";
import { workFromDoc } from "@/lib/works";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/work/$workId")({
	ssr: false,
	component: WorkPage,
});

function WorkPage() {
	const { workId } = Route.useParams();
	const id = workId as WorkId;
	const navigate = Route.useNavigate();

	const doc = useQuery(api.works.get, { id });
	const updateWork = useMutation(api.works.update);
	const removeWork = useMutation(api.works.remove);

	if (doc === undefined) {
		return (
			<div className="container mx-auto p-4 md:p-6">
				<p className="text-sm text-muted-foreground">Loading…</p>
			</div>
		);
	}

	if (doc === null) {
		return (
			<div className="container mx-auto p-4 md:p-6 space-y-4">
				<p className="text-sm text-muted-foreground">Work not found.</p>
				<Link to="/library" className="text-sm underline underline-offset-3">
					Go back to library
				</Link>
			</div>
		);
	}

	const work = workFromDoc(doc);

	const handleStatusChange = async (status: WorkStatus) => {
		await updateWork({ id, patch: { status } });
	};

	const handleRatingChange = async (rating: number) => {
		await updateWork({ id, patch: { rating } });
	};

	const handleDelete = async () => {
		await removeWork({ id });
		navigate({ to: "/library" });
	};

	return (
		<div className="container mx-auto p-4 md:p-6 space-y-6">
			<div className="flex items-center justify-between gap-4">
				<Link
					to="/library"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</Link>

				<AlertDialog>
					<AlertDialogTrigger
						render={<Button variant="outline" size="sm" className="gap-2" />}
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete work?</AlertDialogTitle>
							<AlertDialogDescription>
								This can’t be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<div className="rounded-xl border border-border/50 bg-card/50 p-4 md:p-6 space-y-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0 space-y-1">
						<div className="flex flex-wrap items-center gap-2">
							<TypeBadge type={work.type} />
							<StatusBadge status={work.status} />
						</div>
						<h1 className="text-2xl font-semibold tracking-tight">
							{work.title}
						</h1>
						{work.creator && (
							<p className="text-sm text-muted-foreground">{work.creator}</p>
						)}
					</div>

					<div className="flex items-center gap-3">
						<StarRating
							rating={work.rating}
							interactive
							onRatingChange={handleRatingChange}
						/>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<p className="text-sm font-medium">Status</p>
						<Select
							value={work.status}
							onValueChange={(v) => handleStatusChange(v as WorkStatus)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="backlog">Backlog</SelectItem>
								<SelectItem value="in-progress">In Progress</SelectItem>
								<SelectItem value="finished">Finished</SelectItem>
								<SelectItem value="dropped">Dropped</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<p className="text-sm font-medium">Updated</p>
						<p className="text-sm text-muted-foreground">
							{new Date(work.updatedAt).toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
