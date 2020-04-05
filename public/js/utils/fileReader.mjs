// @TODO - Make a better file loader
const HOST = 'http://localhost:8080';

const ReadyState = {
    Done: 4
};
const HttpStatus = {
    Ok: 200
};
const RequestMethod = {
    Get: "GET"
};
export const ResponseType = {
    Json: "json",
    Text: 'text'
};

// basic file loader
export function readFile(url, request = new XMLHttpRequest(), responseType = ResponseType.Json) {
    return new Promise((resolve) => {
        request.onreadystatechange = function readyStateChanged() {
            if (this.readyState === ReadyState.Done && this.status === HttpStatus.Ok) {
                resolve(request.response);
            }
        };
        request.responseType = responseType
        request.open(RequestMethod.Get, `${HOST}${url}`);
        request.send();
    });
}