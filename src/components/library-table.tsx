"use client";

import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Work, WorkStatus, WorkType } from "@/lib/types";
import { Search } from "./icons";
import { StarRating } from "./star-rating";
import { StatusBadge } from "./status-badge";
import { TypeBadge } from "./type-badge";

type SortKey = "title" | "type" | "status" | "rating" | "updatedAt";

export function LibraryTable({ works }: { works: Work[] }) {
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<WorkType | "all">("all");
	const [statusFilter, setStatusFilter] = useState<WorkStatus | "all">("all");
	const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

	const filteredWorks = useMemo(() => {
		let result = [...works];

		// Search
		if (search) {
			const q = search.toLowerCase();
			result = result.filter(
				(w) =>
					w.title.toLowerCase().includes(q) ||
					w.creator?.toLowerCase().includes(q) ||
					w.tags.some((t) => t.toLowerCase().includes(q)),
			);
		}

		// Type filter
		if (typeFilter !== "all") {
			result = result.filter((w) => w.type === typeFilter);
		}

		// Status filter
		if (statusFilter !== "all") {
			result = result.filter((w) => w.status === statusFilter);
		}

		// Sort
		result.sort((a, b) => {
			let comparison = 0;
			switch (sortKey) {
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "type":
					comparison = a.type.localeCompare(b.type);
					break;
				case "status":
					comparison = a.status.localeCompare(b.status);
					break;
				case "rating":
					comparison = (a.rating ?? 0) - (b.rating ?? 0);
					break;
				case "updatedAt":
					comparison =
						new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					break;
			}
			return sortDir === "asc" ? comparison : -comparison;
		});

		return result;
	}, [works, search, typeFilter, statusFilter, sortKey, sortDir]);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDir(sortDir === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDir("asc");
		}
	};

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search by title, creator, or tag..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={typeFilter}
						onValueChange={(v) => setTypeFilter(v as WorkType | "all")}
					>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="book">Book</SelectItem>
							<SelectItem value="movie">Movie</SelectItem>
							<SelectItem value="series">Series</SelectItem>
							<SelectItem value="anime">Anime</SelectItem>
							<SelectItem value="manga">Manga</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={statusFilter}
						onValueChange={(v) => setStatusFilter(v as WorkStatus | "all")}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="backlog">Backlog</SelectItem>
							<SelectItem value="in-progress">In Progress</SelectItem>
							<SelectItem value="finished">Finished</SelectItem>
							<SelectItem value="dropped">Dropped</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-lg border border-border/50 overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead
								className="cursor-pointer select-none"
								onClick={() => handleSort("title")}
							>
								Title {sortKey === "title" && (sortDir === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead
								className="cursor-pointer select-none"
								onClick={() => handleSort("type")}
							>
								Type {sortKey === "type" && (sortDir === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead
								className="cursor-pointer select-none"
								onClick={() => handleSort("status")}
							>
								Status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead
								className="cursor-pointer select-none"
								onClick={() => handleSort("rating")}
							>
								Rating {sortKey === "rating" && (sortDir === "asc" ? "↑" : "↓")}
							</TableHead>
							<TableHead className="hidden sm:table-cell">Tags</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredWorks.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-24 text-center text-muted-foreground"
								>
									No works found
								</TableCell>
							</TableRow>
						) : (
							filteredWorks.map((work) => (
								<TableRow key={work.id} className="group">
									<TableCell>
										<Link
											to="/work/$workId"
											params={{ workId: work.id }}
											className="font-medium text-foreground hover:underline"
										>
											{work.title}
										</Link>
										{work.creator && (
											<p className="text-sm text-muted-foreground">
												{work.creator}
											</p>
										)}
									</TableCell>
									<TableCell>
										<TypeBadge type={work.type} showIcon={false} />
									</TableCell>
									<TableCell>
										<StatusBadge status={work.status} />
									</TableCell>
									<TableCell>
										{work.rating ? (
											<StarRating rating={work.rating} size="sm" />
										) : (
											"—"
										)}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										<div className="flex flex-wrap gap-1">
											{work.tags.slice(0, 2).map((tag) => (
												<span
													key={tag}
													className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
												>
													{tag}
												</span>
											))}
											{work.tags.length > 2 && (
												<span className="text-xs text-muted-foreground">
													+{work.tags.length - 2}
												</span>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<p className="text-sm text-muted-foreground">
				Showing {filteredWorks.length} of {works.length} works
			</p>
		</div>
	);
}
