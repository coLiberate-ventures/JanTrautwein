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

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href*="contact.html"]').forEach(function (link) {
      link.addEventListener("click", function () {
        track("contact");
      });
    });
    document.querySelectorAll('a[href*="t.me/jantrautwein"]').forEach(function (link) {
      link.addEventListener("click", function () {
        track("telegram");
      });
    });
  });
})();
