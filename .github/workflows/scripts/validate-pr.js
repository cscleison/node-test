module.exports = ({ github, context }) => {
  //
  const labels = context.payload?.pull_request?.labels.map((l) => l.name);

  const releaseLabels = labels.filter((l) =>
    ["major", "minor", "patch"].includes(l)
  );

  console.log("All labels: ", labels);
  console.log("Release labels: ", releaseLabels);

  if (releaseLabels.length !== 1)
    core.setFailed(
      "You must specify 1 release label level (major, minor or patch)."
    );
};
