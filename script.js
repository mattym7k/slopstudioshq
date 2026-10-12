(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Mobile menu */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setMenu(false);
    });
  }

  /* Scroll reveal: elements enter once, in reading order. */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Hero: wireframe terrain rendered on canvas.
     Purpose: a live, real-time visual that stands in for product imagery and
     shows the studio does graphics work. Pointer tilts the camera. */
  var canvas = document.getElementById("field");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var COLS = 34, ROWS = 26;
  var width = 0, height = 0, dpr = 1;
  var t = 0;
  var tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
  var running = false, raf = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduceMotion) draw();
  }

  function heightAt(x, z, time) {
    return Math.sin(x * 1.4 + time) * 0.35
      + Math.cos(z * 1.1 - time * 0.8) * 0.3
      + Math.sin((x + z) * 0.7 + time * 0.5) * 0.25;
  }

  function project(x, y, z) {
    // Rotate around X (tilt) then Y (yaw), then perspective.
    var cy = Math.cos(tiltX), sy = Math.sin(tiltX);
    var y1 = y * cy - z * sy;
    var z1 = y * sy + z * cy;
    var cx = Math.cos(tiltY), sx = Math.sin(tiltY);
    var x2 = x * cx + z1 * sx;
    var z2 = -x * sx + z1 * cx;
    var depth = 3.6 + z2;
    var scale = Math.min(width, height) * 0.95 / depth;
    return {
      x: width / 2 + x2 * scale,
      y: height * 0.56 + y1 * scale,
      d: depth
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    var pts = [];
    for (var r = 0; r <= ROWS; r++) {
      var row = [];
      for (var c = 0; c <= COLS; c++) {
        var x = (c / COLS - 0.5) * 3.2;
        var z = (r / ROWS - 0.5) * 2.6;
        var y = 0.55 - heightAt(x, z, t) * 0.45;
        row.push(project(x, y, z));
      }
      pts.push(row);
    }
    ctx.lineWidth = 1;
    for (r = 0; r <= ROWS; r++) {
      for (c = 0; c <= COLS; c++) {
        var p = pts[r][c];
        var a = Math.max(0.05, Math.min(0.75, 1.9 / p.d - 0.3));
        ctx.strokeStyle = "rgba(45, 212, 230, " + a.toFixed(3) + ")";
        if (c < COLS) {
          var q = pts[r][c + 1];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        if (r < ROWS) {
          var s = pts[r + 1][c];
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(s.x, s.y); ctx.stroke();
        }
      }
    }
  }

  function frame() {
    if (!running) return;
    t += 0.012;
    tiltX += (targetX - tiltX) * 0.04;
    tiltY += (targetY - tiltY) * 0.04;
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  tiltX = 0.95; targetX = 0.95;
  tiltY = 0.0; targetY = 0.0;

  canvas.parentElement.addEventListener("pointermove", function (e) {
    var rect = canvas.getBoundingClientRect();
    var nx = (e.clientX - rect.left) / rect.width - 0.5;
    var ny = (e.clientY - rect.top) / rect.height - 0.5;
    targetY = nx * 0.5;
    targetX = 0.95 + ny * 0.3;
  });
  canvas.parentElement.addEventListener("pointerleave", function () {
    targetY = 0; targetX = 0.95;
  });

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener("resize", resize);
  }
  resize();

  // Only animate while the hero is on screen and the tab is visible.
  var onScreen = true;
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      onScreen ? start() : stop();
    }, { threshold: 0.05 }).observe(canvas);
  } else {
    start();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else if (onScreen) start();
  });
})();
