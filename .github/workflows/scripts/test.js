module.exports = async ({ github, context }) => {
  function extractPRNumber(commitMsg) {
    const squashRegex = /\(#(\d+)\)/;
    const squashMatches = commitMsg.match(squashRegex);

    if (squashMatches?.length > 1) {
      return squashMatches[1].trim();
    }
    return null;
  }

  async function fetchPR(prNumber) {
    try {
      const data = await github.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: prNumber,
      });

      console.log(data);

      return data;
    } catch (e) {
      throw new Error(`Failed to fetch data for PR #${prNumber}: ${e.message}`);
    }
  }

  const commitMsg = context.payload.head_commit.message;
  const prNumber = extractPRNumber(commitMsg);

  if (!prNumber) {
    return core.setFailed(
      "Could not extract PR number from the commit message."
    );
  }

  return fetchPR(prNumber);
};
