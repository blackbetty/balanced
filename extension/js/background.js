// Get tab URL for content script
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     // wait for document to load
//     if (changeInfo.status == 'complete') {
//
//     }
// });

// Make HTTP request on content script's behalf
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    console.log(request.action);
    if (request.action == 'sendTabUrl') {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
            callback(tabs[0].url);
        });

        return true;
    } else if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            var json = JSON.parse(xhttp.responseText);
            callback(json);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhttp.send(request.data);
        return true; // prevents the callback from being called too early on return
    }
});
