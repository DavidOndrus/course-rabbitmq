function callApi() {
  fetch('http://localhost:8080/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "author": "David",
      "item": "Lamp",
      "price": 1400
    }),
  });

  fetch('http://localhost:8080/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "author": "Dave",
      "item": "Car",
      "price": 1300
    }),
  });

  fetch('http://localhost:8080/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "author": "Dav",
      "item": "Bed",
      "price": 1500
    }),
  });
}

setInterval(callApi, 10);
