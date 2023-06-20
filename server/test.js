test("testCredit", () => {
    const userId = 1;
    const accountId = 1;
    const montant = 500;
  
    const requestBody = {
      montant: montant
    };
  
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
  
    return fetch(`http://localhost:3100/users/${userId}/accounts/${accountId}/credit`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Résultat de la requête de crédit :');
        console.log(data);
      })

      .catch(error => console.error(error));
  });
  
  test("testDebit", () => {
    const userId = 1;
    const accountId = 1;
    const montant = 300;
  

    
    const requestBody = {
      montant: montant
    };
  
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
  
    return fetch(`http://localhost:3100/users/${userId}/accounts/${accountId}/debit`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Résultat de la requête de débit :');
        console.log(data);
      })
      .catch(error => console.error(error));
  });
  