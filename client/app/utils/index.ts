type GitHubTreeItem = {
	path: string;
	mode: string;
	type: "blob" | "tree";
	sha: string;
	size?: number;
	url: string;
};

type TreeViewItem = {
	id: string;
	name: string;
	children?: TreeViewItem[];
};

export const createTreeItemMap = (
	items: GitHubTreeItem[]
): Map<string, TreeViewItem[]> => {
	const map = new Map<string, TreeViewItem[]>();

	items.forEach(item => {
		const { path, sha } = item;
		// Use the file SHA as a unique identifier for treeview items
		const treeViewItem: TreeViewItem = {
			id: sha,
			name: path.split("/").pop()!,
		};

		if (item.type === "tree") {
			treeViewItem.children = [];
		}

		const parentPath = path.includes("/")
			? path.substring(0, path.lastIndexOf("/"))
			: "";

		// console.log("PARENT_PATH__", parentPath);

		const children = map.get(parentPath) || [];

		children.push(treeViewItem);
		map.set(parentPath, children);
	});

	return map;
};

export const buildHierarchy = (
	parentPath: string,
	map: Map<string, TreeViewItem[]>
): TreeViewItem[] => {
	const children = map.get(parentPath) || [];

	children.forEach((child, index) => {
		console.log("CHILD__", child);

		if (child.children) {
			child.children = buildHierarchy(child.name, map);
		}
	});
	return children;
};

export const prepareDataForTreeView = (
	items: GitHubTreeItem[]
): TreeViewItem[] => {
	const map = createTreeItemMap(items);

	return buildHierarchy("", map);
};
