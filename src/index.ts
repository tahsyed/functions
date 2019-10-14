import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/warmup', (request, response) => {

    response.send('Warming up friend.');

});


app.get('/getcustomers/:id', async (request, response) => {
  try {
    const custId = request.params.id;

    if (!custId) throw new Error('cust ID is required');

    const cust = await db.collection('customers').doc(custId).get();
	
	

    if (!cust.exists){
        throw new Error('customer doesnt exist.')
    }

    response.json({
      id: cust.id,
      data: cust.data()
    });

  } catch(error){

    response.status(500).send(error);

  }
});

app.get('/getcustomers2/:id', async (request, response) => {
  try {
    const custId = request.params.id;

    if (!custId) throw new Error('customer ID is required');

    const cust = await db.collection('customers').doc(custId).get();
	
	 response.json({
      id: cust.id,
      title: cust.get('name')
    });
	


 

  } catch(error){

    response.status(500).send(error);

  }
});


