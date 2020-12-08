export default () => {
  let appInstallEvent = null;
  window.addEventListener('load', () => {
    // Listen for addToHomeScreen event
    window.addEventListener('beforeinstallprompt', (evt) => {
      evt.preventDefault();
      appInstallEvent = evt;
    });
    // Notifiy user once app installed successfully
    window.addEventListener('appinstalled', (evt) => {
      //code to notify user about installation complete
      appInstallEvent = null;
    });

    document.addEventListener('click', (evt) => {
      let installPromptElem = document.querySelector('#installApp');
      if(evt.target === installPromptElem) {
        appInstallEvent.prompt();
        appInstallEvent.userChoice
          .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            appInstallEvent = null;
          });
      }
    });
  });
};
