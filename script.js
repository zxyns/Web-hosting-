// ZXYN Hosting — Frontend Animations

document.addEventListener("DOMContentLoaded", () => {

  // Scroll reveal animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });


  // Pricing buttons
  document.querySelectorAll(".pricing button").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.closest("article");

      if (plan) {
        const name = plan.querySelector("h3");

        alert(
          `ZXYN Hosting\n\n${name ? name.textContent : "Plan"} selected!`
        );
      }
    });
  });


  // Smooth navigation
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId && targetId !== "#") {
        const target = document.querySelector(targetId);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

});
