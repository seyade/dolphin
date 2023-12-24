"use client";

import { useEffect, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";

import { prepareDataForTreeView } from "./utils";

import "./directory.css";

type Repo = {
	id: string;
	download_url?: string;
	git_url?: string;
	html_url?: string;
	name?: string;
	path?: string;
	sha?: string;
	size?: number;
	type?: string;
	url?: string;
};

type RepoResponse = {
	message: string;
	repoContents: Repo[];
};

const FolderIcon = ({ isOpen }: { isOpen: boolean }) =>
	isOpen ? (
		<FaRegFolderOpen color="e8a87c" className="icon" />
	) : (
		<FaRegFolder color="e8a87c" className="icon" />
	);

const FileIcon = ({ filename }: { filename: string }) => {
	const extension = filename.slice(filename.lastIndexOf(".") + 1);
	switch (extension) {
		case "js":
			return <DiJavascript color="yellow" className="icon" />;
		case "css":
			return <DiCss3 color="turquoise" className="icon" />;
		case "json":
			return <FaList color="yellow" className="icon" />;
		case "npmignore":
			return <DiNpm color="red" className="icon" />;
		default:
			return null;
	}
};

export default function Home() {
	const [repoTree, setRepoTree] = useState([]);

	useEffect(() => {
		async function fetchData(url: string) {
			try {
				const response = await fetch(url);
				const data = await response.json();

				console.log("DATA__", data.repoContents);

				setRepoTree(data.repoContents.tree);
			} catch (error) {
				console.log("FETCH_ERROR:::", error);
			}
		}

		fetchData("http://localhost:5000/api/dolphin/v1/");
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<header>
				<h1>Dolphin Project</h1>
			</header>
			<article>
				<section>
					<h2>Folders</h2>

					<div className="directory">
						{repoTree.length ? (
							<section>
								<>
									{/* {console.log("TREE__", prepareDataForTreeView(repoTree))} */}
									{console.log(
										"TREE_FLAT__",
										flattenTree({
											name: "dashing-test",
											children: prepareDataForTreeView(repoTree),
										})
									)}
								</>

								<TreeView
									data={flattenTree({
										name: "[root repo name]",
										children: prepareDataForTreeView(repoTree),
									})}
									nodeRenderer={({
										element,
										isBranch,
										isExpanded,
										getNodeProps,
										level,
									}) => (
										<div
											{...getNodeProps()}
											style={{ paddingLeft: 20 * (level - 1) }}
										>
											{isBranch ? (
												<FolderIcon isOpen={isExpanded} />
											) : (
												<FileIcon filename={element.name} />
											)}

											{element.name}
										</div>
									)}
								/>
							</section>
						) : (
							<h2>Loading...</h2>
						)}
					</div>
				</section>
			</article>
		</main>
	);
}
