(function () {
  var bar = document.querySelector(".progress");
  var links = Array.prototype.slice.call(document.querySelectorAll(".rail a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (bar && max > 0) bar.style.transform = "scaleX(" + doc.scrollTop / max + ")";
  }

  function spy() {
    if (!sections.length) return;
    var mark = 150;
    var currentId = sections[0].id;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= mark) currentId = section.id;
    });
    links.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + currentId;
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", function () { onScroll(); spy(); }, { passive: true });
  onScroll();
  spy();

  var dialog = document.getElementById("lightbox");
  var shot = document.getElementById("lightbox-img");
  var caption = document.getElementById("lightbox-cap");
  if (dialog && shot) {
    document.querySelectorAll("button.shot").forEach(function (button) {
      button.addEventListener("click", function () {
        var img = button.querySelector("img");
        shot.src = img.currentSrc || img.src;
        shot.alt = img.alt;
        caption.textContent = button.getAttribute("data-caption") || img.alt;
        if (typeof dialog.showModal === "function") dialog.showModal();
      });
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    var closeBtn = dialog.querySelector(".close");
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  }

  var materials = [
    { name: "Small postcard", size: "Small", theme: "Property Marketing" },
    { name: "Jumbo postcard", size: "Jumbo", theme: "Property Marketing" },
    { name: "Small postcard", size: "Small", theme: "Open House" },
    { name: "Jumbo postcard", size: "Jumbo", theme: "Open House" },
    { name: "8.5 × 11 flyer", size: "Flyer", theme: "Property Marketing" }
  ];

  var form = document.getElementById("logic-demo");
  if (!form) return;
  var rule = document.getElementById("rule-text");
  var list = document.getElementById("demo-results");
  var count = document.getElementById("demo-count");

  function selected(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (input) { return input.value; });
  }

  function render() {
    var sizes = selected("size");
    var themes = selected("theme");
    var matches = materials.filter(function (item) {
      var sizeOk = sizes.length === 0 || sizes.indexOf(item.size) !== -1;
      var themeOk = themes.length === 0 || themes.indexOf(item.theme) !== -1;
      return sizeOk && themeOk;
    });

    var sizeClause = sizes.length ? sizes.join(" or ") : "any size";
    var themeClause = themes.length ? themes.join(" or ") : "any theme";
    if (!sizes.length && !themes.length) {
      rule.textContent = "No filters yet. The full set is showing.";
    } else if (sizes.length && themes.length) {
      rule.textContent = "Showing " + sizeClause + ", and only if the theme is " + themeClause + ".";
    } else if (sizes.length) {
      rule.textContent = "Within Size, matches are combined with OR: " + sizeClause + ".";
    } else {
      rule.textContent = "Within Theme, matches are combined with OR: " + themeClause + ".";
    }

    count.textContent = matches.length + (matches.length === 1 ? " material" : " materials");
    list.innerHTML = "";
    if (!matches.length) {
      var empty = document.createElement("li");
      empty.textContent = "Nothing matches. Categories combine with AND, so every selected category has to hit. Clear one category to widen the set.";
      list.appendChild(empty);
      return;
    }
    matches.forEach(function (item) {
      var li = document.createElement("li");
      var name = document.createElement("strong");
      name.textContent = item.name;
      var meta = document.createElement("span");
      meta.textContent = item.size + " · " + item.theme;
      li.appendChild(name);
      li.appendChild(meta);
      list.appendChild(li);
    });
  }

  form.addEventListener("change", render);
  form.addEventListener("reset", function () { window.setTimeout(render, 0); });
  render();
})();
