const sidebar = document.getElementById("sidebar");
const mainContent = document.querySelector(".main-content");

function toggleSidebar() {
  sidebar.classList.toggle("show");
}

mainContent.addEventListener("click", function () {
  if (sidebar.classList.contains("show")) {
    toggleSidebar();
  }
});
