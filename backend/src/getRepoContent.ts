import { Request, Response } from "express";
import { Octokit } from "octokit";

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

async function getRepoContent(req: Request, res: Response) {
	// TODO: read file from remote, repo details and destPath from req.body
	// --> const { repo, owner, destPath } = req.body;
	// TODO: Get README file content for AI asssitant learning

	// const CONTENTS = "GET /repos/{owner}/{repo}/contents";
	// const TREE_SHA = "GET /repos/{owner}/{repo}/git/trees/{tree_sha}";

	try {
		const response = await octokit.request(
			"GET /repos/{owner}/{repo}/git/trees/{tree_sha}/",
			{
				owner: "seyade",
				repo: "dashing-test",
				tree_sha: "main",
				recursive: "true",
				headers: { accept: "application/vnd.github+json" },
			}
		);

		const data = response.data;

		res.status(200).json({
			message: "success",
			repoContents: data,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error getting repo data from repository", error });
	}
}

export default getRepoContent;
