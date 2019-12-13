/**
* MyClient class
*/
class MyPrologInterface {
    /**
     * @constructor
     * @param port - Port in which requests are made
     */
    constructor(port) {
        this.serverPort = port || 8081;

        this.successRequest = function (data) { console.log("Request successful. Reply: " + data.target.response); };
        this.errorRequest = function (data) { console.log("Error waiting for response, check SICStus server (LMAO) config... Reply: " + data.target.response); };
    }

    /**
    * Sending a request string to prolog server
    * in which success/error cases for handler are treated 
    * @param requestString request in proccess 
    * @param onSuccess recall for effective request 
    * @param onError recall for denied request 
    */
    getPrologRequest(requestString, onSuccess, onError) {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.serverPort + '/' + requestString, true);

        request.onload = onSuccess || this.successRequest;
        request.onerror = onError || this.errorRequest;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    };
}
