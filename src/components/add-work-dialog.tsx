import { useMutation } from "convex/react";
import type React from "react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { WorkStatus, WorkType } from "@/lib/types";
import { api } from "../../convex/_generated/api";
import { Plus } from "./icons";
import { StarRating } from "./star-rating";

const workTypes: { value: WorkType; label: string }[] = [
	{ value: "book", label: "Book" },
	{ value: "movie", label: "Movie" },
	{ value: "series", label: "Series" },
	{ value: "anime", label: "Anime" },
	{ value: "manga", label: "Manga" },
];

const workStatuses: { value: WorkStatus; label: string }[] = [
	{ value: "backlog", label: "Backlog" },
	{ value: "in-progress", label: "In Progress" },
	{ value: "finished", label: "Finished" },
	{ value: "dropped", label: "Dropped" },
];

export function AddWorkDialog() {
	const [open, setOpen] = useState(false);
	const titleId = useId();
	const typeId = useId();
	const statusId = useId();
	const creatorId = useId();
	const totalId = useId();
	const tagsId = useId();
	const [title, setTitle] = useState("");
	const [type, setType] = useState<WorkType>("book");
	const [status, setStatus] = useState<WorkStatus>("backlog");
	const [creator, setCreator] = useState("");
	const [tags, setTags] = useState("");
	const [rating, setRating] = useState(0);
	const [totalProgress, setTotalProgress] = useState("");
	const createWork = useMutation(api.works.create);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		const parsedTotalProgress = Number.parseInt(totalProgress, 10) || 0;

		await createWork({
			title: title.trim(),
			type,
			status,
			creator: creator.trim() || undefined,
			tags: tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			rating: rating > 0 ? rating : undefined,
			progress:
				type !== "movie" && parsedTotalProgress > 0
					? { current: 0, total: parsedTotalProgress }
					: undefined,
		});

		setTitle("");
		setType("book");
		setStatus("backlog");
		setCreator("");
		setTags("");
		setRating(0);
		setTotalProgress("");
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
				<Plus className="h-4 w-4" />
				Add Work
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Work</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={titleId}>Title</Label>
						<Input
							id={titleId}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter title..."
							autoFocus
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={typeId}>Type</Label>
							<Select
								value={type}
								onValueChange={(v) => setType(v as WorkType)}
							>
								<SelectTrigger id={typeId}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{workTypes.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor={statusId}>Status</Label>
							<Select
								value={status}
								onValueChange={(v) => setStatus(v as WorkStatus)}
							>
								<SelectTrigger id={statusId}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{workStatuses.map((s) => (
										<SelectItem key={s.value} value={s.value}>
											{s.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor={creatorId}>
							Creator (Author / Director / Studio)
						</Label>
						<Input
							id={creatorId}
							value={creator}
							onChange={(e) => setCreator(e.target.value)}
							placeholder="e.g., Christopher Nolan"
						/>
					</div>

					{type !== "movie" && (
						<div className="space-y-2">
							<Label htmlFor={totalId}>
								Total{" "}
								{type === "book"
									? "Pages"
									: type === "manga"
										? "Chapters"
										: "Episodes"}
							</Label>
							<Input
								id={totalId}
								type="number"
								value={totalProgress}
								onChange={(e) => setTotalProgress(e.target.value)}
								placeholder="e.g., 320"
							/>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor={tagsId}>Tags (comma-separated)</Label>
						<Textarea
							id={tagsId}
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="e.g., sci-fi, philosophy, drama"
							rows={2}
						/>
					</div>

					<div className="space-y-2">
						<Label>Rating</Label>
						<StarRating
							rating={rating}
							interactive
							onRatingChange={setRating}
							size="lg"
						/>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!title.trim()}>
							Add Work
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
