//checking the serviceWorker Support for different browser
if('serviceWorker' in navigator){
    //This Method is async and return promises
    //Registering the serviceWorker
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log("Service Worker registered",reg))
    .catch((err) => console.log("Service Worker Not registered",err))
}