import { Endpoints } from "https://esm.sh/@octokit/types@9.0.0";
import { Octokit } from "https://esm.sh/octokit@4.0.2";

export class GithubClient {
  constructor(private octokit: Octokit) {}

  public async getAllActivePulls(
    organization: string,
    repoName: string,
  ) {
    const response = await this.octokit.request(
      "GET /repos/{owner}/{repo}/pulls?state=open",
      { owner: organization, repo: repoName },
    ) as Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"];

    // I'm not sure which sort is being used, but it's possible that this
    // response only contains the first page. Might need to do some pagination here
    // if we discover some important branches are not being returned.

    return response.data;
  }

  public async requestReviewersForPull(
    organization: string,
    repoName: string,
    pullNumber: number,
    reviewers: string[],
  ) {
    const response = await this.octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
      {
        owner: organization,
        repo: repoName,
        pull_number: pullNumber,
        reviewers,
      },
    ) as Endpoints[
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ]["response"];

    return response.data;
  }
}
