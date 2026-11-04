(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      const label = navToggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = open ? "メニューを閉じる" : "メニューを開く";
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNavOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) setNavOpen(false);
    });
  }

  document.querySelectorAll(".faq-trigger").forEach(function (button) {
    button.addEventListener("click", function () {
      const item = button.closest(".faq-item");
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  if (header) {
    const offset = header.offsetHeight;
    document.querySelectorAll("section[id], main[id]").forEach(function (section) {
      section.style.scrollMarginTop = offset + "px";
    });
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  const success = document.getElementById("form-success");
  const message = document.getElementById("message");
  const params = new URLSearchParams(window.location.search);
  const intent = params.get("intent");
  const presets = {
    trial: "無料トライアルを希望します。",
    demo: "デモの申し込みを希望します。"
  };

  if (message && presets[intent] && !message.value) {
    message.value = presets[intent];
  }

  const fields = [
    { id: "last-name", message: "姓を入力してください。" },
    { id: "first-name", message: "名を入力してください。" },
    { id: "company", message: "会社名を入力してください。" },
    { id: "email", message: "メールアドレスを入力してください。", invalid: "メールアドレスの形式を確認してください。" },
    { id: "phone", message: "", invalid: "電話番号の形式を確認してください。" },
    { id: "message", message: "お問い合わせ内容を入力してください。" }
  ];

  function showError(input, text) {
    const error = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", "true");
    if (error) {
      error.hidden = false;
      error.textContent = text;
    }
  }

  function clearError(input) {
    const error = document.getElementById(input.id + "-error");
    input.removeAttribute("aria-invalid");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

  function validateField(spec) {
    const input = document.getElementById(spec.id);
    if (!input) return true;
    const value = input.value.trim();
    clearError(input);

    if (spec.id === "phone") {
      if (value && !/^[0-9+\-() 　]{8,}$/.test(value)) {
        showError(input, spec.invalid);
        return false;
      }
      return true;
    }

    if (!value) {
      showError(input, spec.message);
      return false;
    }

    if (spec.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(input, spec.invalid);
      return false;
    }

    return true;
  }

  fields.forEach(function (spec) {
    const input = document.getElementById(spec.id);
    if (!input) return;
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(spec);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let firstInvalid = null;
    fields.forEach(function (spec) {
      const ok = validateField(spec);
      if (!ok && !firstInvalid) firstInvalid = document.getElementById(spec.id);
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    form.hidden = true;
    if (success) success.hidden = false;
    success.focus();
  });
})();
