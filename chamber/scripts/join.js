const params = new URLSearchParams(window.location.search);

["fname", "lname", "email", "phone", "organization", "timestamp"]
  .forEach(id => {
    const element = document.getElementById(id);
    const value = params.get(id);

    if (element && value) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = value;
      } else {
        element.textContent = value;
      }
    }
  });
