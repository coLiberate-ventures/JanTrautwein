(function () {
  var websiteId = "1bced3ef-ae2b-41ac-ad39-d2af38af2837";
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://journey.jantrautwein.com/stats/script.js";
  s.setAttribute("data-website-id", websiteId);
  document.head.appendChild(s);

  function track(name) {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name);
    }
  }

  // Capture-phase delegation so clicks still count after the homepage
  // hydrates and replaces the prerendered links.
  document.addEventListener(
    "click",
    function (event) {
      var a = event.target && event.target.closest && event.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || a.href || "";
      if (href.indexOf("contact.html") !== -1) track("contact");
      else if (href.indexOf("t.me/jantrautwein") !== -1) track("telegram");
    },
    true
  );
})();
