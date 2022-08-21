module.exports = async ({ github, context, core }) => {
  // console.log(github);
  const defaultLevel = "patch";

  function extractPrNumber(commitMsg) {
    const squashRegex = /\(#(\d+)\)/;
    const squashMatches = commitMsg.match(squashRegex);

    if (squashMatches?.length > 1) {
      return squashMatches[1].trim();
    }
    return null;
  }

  async function fetchPR(prNumber) {
    try {
      const response = await github.rest.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber,
      });

      return response.data;
    } catch (e) {
      throw new Error(`Failed to fetch data for PR #${prNumber}: ${e.message}`);
    }
  }

  function getSemverLevel(pr) {
    const labelNames = pr.labels.map((l) => l.name);
    const level = labelNames.find((l) =>
      ["major", "minor", "patch"].includes(l)
    );

    if (level) return level;

    core.warning(
      `No semver level tag found in the PR for this commit. Falling back to default level ${defaultLevel}.`
    );
    return defaultLevel;
  }

  try {
    const commitMsg = context.payload.head_commit.message;
    const prNumber = extractPrNumber(commitMsg);

    if (!prNumber) {
      core.warning(
        `Could not extract PR number from the commit message. Commit: "${commitMsg}". Falling back to default level ${defaultLevel}.`
      );
      return defaultLevel;
    }

    const pr = await fetchPR(prNumber);
    return getSemverLevel(pr);
  } catch (e) {
    return core.setFailed(e.message);
  }
};
