function opentab(evt:any, cityName:any) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    const cityElement = document.getElementById(cityName);
    if (cityElement) {
        cityElement.style.display = "grid";
    }
    evt.currentTarget.className += " active";
  }
  document.addEventListener("DOMContentLoaded", () => {
    const defaultOpen = document.getElementById("defaultOpen");
    if (defaultOpen) {
      defaultOpen.click();
    }
  });
