module.exports = ({ github, context }) => {
  const labels = context.payload?.pull_request?.labels.map((l) => l.name);
  const releaseLabels = labels.filter(
    (l) =>
      l === "release/major" || l === "release/minor" || l === "release/patch"
  );
  console.log("All labels: ", labels);
  console.log("Release labels: ", releaseLabels);
  if (releaseLabels.length !== 1)
    core.setFailed(
      "You must specify a release label level (major, minor or patch)."
    );
};
