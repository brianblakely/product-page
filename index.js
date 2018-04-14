const allNodes = (items, callback)=> {
  for(const [index, item] of Array.from(items).entries()) {
    callback(index, item);
  }
};

const clickAll = (items, callback)=> {
  allNodes(items, (index, item)=> {
    item.addEventListener(`click`, (e)=> callback(index, item, e));
  });
};

// Gallery.

const galleryZoom = document.querySelector(`#zoom`),
      galleryItems = document.querySelectorAll(`#gallery li`),
      galleryImages = document.querySelectorAll(`#gallery li img`),
      variantName = document.querySelector(`#variant`);

let galleryActive = document.querySelector(`#gallery li.active`);

clickAll(galleryItems, (index, item)=> {
  galleryZoom.style.backgroundImage = `url(${
    galleryImages[index].src.replace(`small`, `large`)
  })`;

  galleryActive.classList.remove(`active`);
  item.classList.add(`active`);
  galleryActive = item;

  variantName.textContent = galleryImages[index].getAttribute(`alt`);
});

// Gallery zoom.

let zoomRect = galleryZoom.getBoundingClientRect();
window.addEventListener(`resize`, ()=> {
  zoomRect = galleryZoom.getBoundingClientRect();
});

galleryZoom.addEventListener(`mouseover`, ()=> {
  galleryZoom.classList.add(`active`);
});
galleryZoom.addEventListener(`mouseout`, ()=> {
  galleryZoom.classList.remove(`active`);
});
galleryZoom.addEventListener(`mousemove`, (e)=> {
  const x = e.pageX - zoomRect.x,
        y = e.pageY - zoomRect.y,
        pctX = x / zoomRect.width * 100,
        pctY = y / zoomRect.height * 100;

  galleryZoom.style.backgroundPosition = `${pctX}% ${pctY}%`;
});

// Accordion.

const accordion = document.querySelector(`#description dl`),
      accordionH = accordion.offsetHeight,
      accordionHeadings = document.querySelectorAll(`#description dl dt`),
      accordionBodies = document.querySelectorAll(`#description dl dd span`);

let accordionActive = accordionHeadings[0];

let tallestBody = 0;
allNodes(accordionBodies, (index, item)=> {
  if(item.offsetHeight > tallestBody) {
    tallestBody = item.offsetHeight;
  }
});
accordion.parentNode.style.height =
  `${accordion.parentNode.offsetHeight + tallestBody}px`;

clickAll(accordionHeadings, (index, item)=> {
  accordionActive.classList.remove(`active`);
  item.classList.add(`active`);
  accordionActive = item;

  const bodyH = accordionBodies[index].offsetHeight;

  accordion.style.height = `${accordionH + bodyH}px`;

  let iterate = item;
  iterate.style.transform = `translateY(0px)`;

  while((iterate = iterate.previousElementSibling)) {
    iterate.style.transform = `translateY(0px)`;
  }

  iterate = item.nextElementSibling;
  iterate.style.transform = `translateY(0px)`;

  while((iterate = iterate.nextElementSibling)) {
    iterate.style.transform = `translateY(${bodyH}px)`;
  }
});

// Cart modal.

const confirm = document.querySelector(`#confirm`),
      template = `
        <strong>$title</strong>

        <img src="$img" />

        <strong>Amount:</strong>
        <p class="amount">$amount</p>

        <strong>Total</strong>
        <p class="total">$$total</p>
      `;

const open = (props)=> {
  let confirmHTML = template;
  for(const [key, value] of Object.entries(props)) {
    confirmHTML = confirmHTML.replace(`$${key}`, value);
  }
  confirm.insertAdjacentHTML(`beforeend`, confirmHTML);

  confirm.style.display = `block`;
  setTimeout(()=> {
    confirm.classList.add(`active`);
  }, 0);
};

const close = ()=> {
  confirm.classList.remove(`active`);
  setTimeout(()=> {
    confirm.style.display = `none`;
    Array.from(confirm.childNodes).forEach((child)=> {
      if(child.textContent !== `👌`) {
        child.parentNode.removeChild(child);
      }
    });
  }, 250);
};

const amount = document.querySelector(`input[type="number"]`),
      addToCart = document.querySelector(`#add-to-cart`);

addToCart.addEventListener(`click`, ()=> {
  if(!amount.valueAsNumber) {
    amount.style.borderColor = `#f00`;
    return false;
  } else {
    amount.style.borderColor = ``;
  }

  open({
    title: document.querySelector(`h1`).textContent,
    img: document.querySelector(`#gallery li.active img`).src,
    amount: amount.value,
    total:
      Number(Number(document.querySelector(`#price`).textContent.replace(`$`, ``))
      * amount.valueAsNumber).toFixed(2)
  });
});

confirm.querySelector(`span`).addEventListener(`click`, ()=> {
  close();
});
