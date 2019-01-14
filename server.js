const io = require('socket.io')();
const interval = 30000;
const port = 1111;

io.listen(port);
console.log('listening on port ', port);

io.on('connection', (client) => {
    console.log('client connected')
    client.on('subscribeToMessages', () => {
        setInterval(() => {
            const messages = getMessages()
            client.emit('messages', messages)
        }, interval)
    })
});

function getMessages() {
    const requestOptions = {
        method: "GET",
        mode: 'cors',
        body: null
    };

    return fetch(`http://127.0.0.1:5000/messages`, requestOptions)
        .then(handleResponse)
}

function handleResponse(response) {
    return response.json().then(json => {
        if (!response.ok) {
            if (response.status === 403) {
                console.log("403")
            }

            const error = (json && json.message) || response.statusText;
            return Promise.reject(error);
        }
        return json;
    });
}