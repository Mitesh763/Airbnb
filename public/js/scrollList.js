const rightBtn = document.querySelector(".right-slide-arrow");
const leftBtn = document.querySelector(".left-slide-arrow");
const menuList = document.querySelector(".menu-items-lists");

rightBtn.addEventListener("click", () => {
  console.log(menuList.scrollLeft);
  menuList.scrollLeft += 200;
  if (menuList.scrollLeft >= 15) {
    leftBtn.classList.remove("active");
  }
  if (menuList.scrollLeft >= 570) {
    rightBtn.classList.add("active");
  }
});

leftBtn.addEventListener("click", () => {
  menuList.scrollLeft -= 200;

  if (menuList.scrollLeft <= 535) {
    rightBtn.classList.remove("active");
  }
  if (menuList.scrollLeft == 0) {
    leftBtn.classList.add("active");
  }
});
