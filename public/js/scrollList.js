const rightBtn = document.querySelector(".right-slide-arrow");
const leftBtn = document.querySelector(".left-slide-arrow");
const menuList = document.querySelector(".menu-items-lists");

rightBtn.addEventListener("click", () => {
  menuList.scrollLeft += 200;
  if (menuList.scrollLeft >= 15) {
    leftBtn.classList.remove("active");
  }
  if (menuList.scrollLeft >= 545) {
    rightBtn.classList.add("active");
  }
  //   console.log(menuList.scrollLeft);
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
