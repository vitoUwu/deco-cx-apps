import { PullRequest } from "../../types.ts";

export function isDraft(pr: PullRequest) {
  return ["[draft]", "(draft)"].some((draft) =>
    pr.title.toLowerCase().includes(draft)
  );
}
