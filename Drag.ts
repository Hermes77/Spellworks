function createDrag() {
    const dragWindow = document.getElementsByClassName("dragwindow")[0];
    const dragInfo = document.createElement("div");
    const spellCard = document.getElementById("spell-card");
    dragInfo.style.display = "block";
    dragInfo.className = "DragInfo"; // Add a class for styling if needed

    if (spellCard) {
        const spellName = spellCard.querySelector(".spell-name")?.textContent || "Unknown Spell";
        dragInfo.id = `DragInfo-${spellName}`;
        dragInfo.innerHTML = `
            <div id="${dragInfo.id}-header" class="Dragheader"> 
                <button class="DragClose">X</button>
                <button class="SpellDisplayClose">^</button>
                <label class="DragTitle">${spellName}</label>
            </div>
            <div class="DragContent">${spellCard?.innerHTML}</div>`;
    }

    const dragCloseButton = dragInfo.querySelector(".DragClose");
    const spellDisplayCloseButton = dragInfo.querySelector(".SpellDisplayClose");

    if (dragCloseButton) {
        dragCloseButton.addEventListener("click", () => dragInfo.remove());
    }

    if (spellDisplayCloseButton) {
        spellDisplayCloseButton.addEventListener("click", () => {
            const DragContent = dragInfo.querySelector(".DragContent");
            if (DragContent) {
                const currentDisplay = window.getComputedStyle(DragContent).display;
                if (currentDisplay === "block") {
                    (DragContent as HTMLElement).style.display = "none";
                    dragInfo.style.width = "fit-content";
                    spellDisplayCloseButton.textContent = "v";
                } else {
                    (DragContent as HTMLElement).style.display = "block";
                    dragInfo.style.width = "";
                    spellDisplayCloseButton.textContent = "^";
                }
            }
        });
    }

    dragWindow.appendChild(dragInfo);
    dragElement(dragInfo); // Make the new window draggable
}


function dragElement(elmnt: HTMLElement | null) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt && document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    const header = document.getElementById(elmnt.id + "header");
    if (header) {
      header.onmousedown = dragMouseDown;
    }
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    if (elmnt) {
      elmnt.onmousedown = dragMouseDown;
    }
  }

  function dragMouseDown(e: MouseEvent | undefined) {
    e = e || (window.event as MouseEvent);
    if (!e) return;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get element dimensions
    if (!elmnt) return;
    const elemRect = elmnt.getBoundingClientRect();
    const elemWidth = elemRect.width;
    const elemHeight = elemRect.height;

    // Calculate new position
    let newLeft = elmnt.offsetLeft - pos1;
    let newTop = elmnt.offsetTop - pos2;

    // Constrain within bounds
    newLeft = Math.max(0, Math.min(viewportWidth - elemWidth, newLeft));
    newTop = Math.max(0, Math.min(viewportHeight - elemHeight, newTop));

    // Apply constrained position
    elmnt.style.left = newLeft + "px";
    elmnt.style.top = newTop + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
