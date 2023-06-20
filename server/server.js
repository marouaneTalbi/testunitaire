var express = require('express');

const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    user: 'jiji',
    password: 'pass',
    host: 'localhost',
    database: 'db_bank',
    port: 5432,
});
app.use(express.json());


app.get("/users", (req, res) => {
    pool.query('SELECT * FROM "users"', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send("Une erreur s'est produite lors de la récupération des utilisateurs");
        } else {
            res.json(results.rows);
        }
    });
});

app.put("/users/:userId/accounts/:accountId/credit", (req, res) => {
    const userId = req.params.userId;
    const accountId = req.params.accountId;
    const { montant } = req.body;
  
    pool.query(
      'SELECT * FROM bankaccount WHERE user_id = $1 AND id = $2',
      [userId, accountId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("Une erreur s'est produite lors de la récupération du compte bancaire de l'utilisateur");
        } else {
          const bankAccount = results.rows[0];
          const currentBalance = bankAccount.montant;
          
          const amountToAdd = parseInt(montant); // Montant à ajouter
          let newBalance = parseInt(currentBalance) + amountToAdd; // Nouveau solde du compte
          const limit = 1000;
  
          let amountAdded = 0;
          let amountNotAdded = 0;

          console.log(amountAdded, newBalance, amountToAdd)
  
          if (newBalance <= limit) {
            amountAdded = amountToAdd;

          } else if(amountToAdd < limit ){
            amountAdded = limit - currentBalance;
            newBalance = limit;
            console.log(3333)
            let f = amountToAdd - amountAdded

            res.json({
                amountAdded: amountAdded,
                amountNotAdded: f,
                newBalance: newBalance
              });
              return;

          }else {
            amountAdded = limit - currentBalance;
            amountNotAdded = amountToAdd - amountAdded;
            newBalance = limit;
            res.json({
              amountAdded: amountAdded,
              amountNotAdded: amountNotAdded,
              newBalance: newBalance
            });
            return;
          }

  
          pool.query(
            'UPDATE bankaccount SET montant = $1 WHERE user_id = $2 AND id = $3 RETURNING *',
            [newBalance, userId, accountId],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Une erreur s'est produite lors de la mise à jour du compte bancaire");
              } else {
                const updatedBankAccount = results.rows[0];
  
                res.json({
                  amountAdded: amountAdded,
                  amountNotAdded: amountNotAdded,
                  newBalance: updatedBankAccount.montant
                });
              }
            }
          );
        }
      }
    );
  });
  

app.get("/users/:userId/check-accounts", (req, res) => {
    const userId = req.params.userId;
  
    pool.query(
      'SELECT COUNT(*) AS account_count FROM bankaccount WHERE user_id = $1',
      [userId],
      (error, results) => {
        console.log(results.rows[0])
        if (error) {
          console.error(error);
          res.status(500).send("Une erreur s'est produite lors de la vérification des comptes bancaires de l'utilisateur");
        } else {
          const accountCount = results.rows[0].account_count;
          if (accountCount < 5) {
            res.json({ message: "L'utilisateur a moins de 5 comptes bancaires" });
          } else {
            res.json({ message: "L'utilisateur a déjà 5 comptes bancaires" });
          }
        }
      }
    );
  });


  
  app.put("/users/:userId/accounts/:accountId/debit", (req, res) => {
    const userId = req.params.userId;
    const accountId = req.params.accountId;
    const { montant } = req.body;
  
    pool.query(
      'SELECT * FROM bankaccount WHERE user_id = $1 AND id = $2',
      [userId, accountId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("Une erreur s'est produite lors de la récupération du compte bancaire de l'utilisateur");
        } else {
          const bankAccount = results.rows[0];
          const currentBalance = bankAccount.montant;
  
          const amountToDebit = parseInt(montant); // Montant à débiter
          let newBalance = currentBalance - amountToDebit; // Nouveau solde du compte
  
          let amountDebited = 0;
          let amountNotDebited = 0;
  
          if (currentBalance >= amountToDebit) {
            amountDebited = amountToDebit;
          } else {
            amountDebited = currentBalance;
            amountNotDebited = amountToDebit - currentBalance;
            newBalance = 0;
          }
  
          pool.query(
            'UPDATE bankaccount SET montant = $1 WHERE user_id = $2 AND id = $3 RETURNING *',
            [newBalance, userId, accountId],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send("Une erreur s'est produite lors de la mise à jour du compte bancaire");
              } else {
                const updatedBankAccount = results.rows[0];
  
                res.json({
                  amountDebited: amountDebited,
                  amountNotDebited: amountNotDebited,
                  newBalance: updatedBankAccount.montant
                });
              }
            }
          );
        }
      }
    );
  });
  
//     // console.log(req.body)
//     const userId = req.params.userId;
//     const accountId = req.params.accountId;
//     const { montant } = req.body;
  
//     pool.query(
//       'SELECT * FROM bankaccount WHERE user_id = $1 AND id = $2',
//       [userId, accountId],
//       (error, results) => {
//         if (error) {
//           console.error(error);
//           res.status(500).send("Une erreur s'est produite lors de la récupération du compte bancaire de l'utilisateur");
//         } else {
//           const bankAccount = results.rows[0];
//           const currentBalance = bankAccount.montant;
//           const amountToAdd = parseInt(montant); // Montant à ajouter
//           const newBalance = parseInt(currentBalance) + amountToAdd; // Nouveau solde du compte
//           const limit = 1000;
  
//           let amountAdded = 0;
//           let amountNotAdded = 0;
  
//           if (newBalance <= limit) {
//             amountAdded = amountToAdd;
//             console.log(1)
//           } else {
//             amountAdded = limit - currentBalance;
//             console.log(2,'===>',currentBalance, limit, amountAdded)

//             amountNotAdded = parseInt(amountToAdd) - amountAdded;
//           }

//           console.log(amountAdded, amountNotAdded)
//           pool.query(
//             'UPDATE bankaccount SET montant = $1 WHERE user_id = $2 AND id = $3 RETURNING *',
//             [newBalance, userId, accountId],
//             (error, results) => {
//               if (error) {
//                 console.error(error);
//                 res.status(500).send("Une erreur s'est produite lors de la mise à jour du compte bancaire");
//               } else {

//                 const updatedBankAccount = results.rows[0];
  
//                 res.json({
//                   amountAdded: amountAdded,
//                   amountNotAdded: amountNotAdded,
//                   newBalance: updatedBankAccount.montant
//                 });
//               }
//             }
//           );
//         }
//       }
//     );
//   });
  
  


app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello world");
})

app.post("/", (req, res) => {
    res.json(req.body);
})

app.listen(3100, () => {
    console.log("server is running on port 3100")
})