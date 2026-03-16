(() => {
  let tries = 0;
  const maxTries = 50;
  const tryNext = () => {
    tries++;
    if (tries > maxTries) {
      console.warn("Loader timeout");
      return;
    }
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      const overlay = document.getElementById("page-loader-overlay");
      if (overlay) {
        overlay.classList.add("is-hidden");
        setTimeout(() => overlay.remove(), 400);
      }
    } else {
      setTimeout(tryNext, 100);
    }
  };
  tryNext();
})();
