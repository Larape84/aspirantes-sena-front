import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import cors from 'cors';

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({ origin: true });

export const createConvocatoria = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                res.status(405).send('Método no permitido');
                return;
            }

            const {
                convocatoria,
                vigencia,
                centroFormacion,
                dataConvocatoria,
                estado,
                token,
            } = req.body;

            console.log('Body recibido:', req.body);

            if (!token) {
                res.status(401).json({ error: 'Falta el token de sesión' });
                return;
            }

            const docRef = db.collection('convocatorias').doc();
            await docRef.set({
                convocatoria,
                vigencia,
                centroFormacion,
                estado,
                token,
            });

            if (Array.isArray(dataConvocatoria)) {
                console.log(
                    `Insertando ${dataConvocatoria.length} registros en subcolección...`
                );
                const batch = db.batch();

                dataConvocatoria.forEach((row: any) => {
                    const subRef = docRef.collection('dataConvocatoria').doc();
                    batch.set(subRef, { ...row, token });
                });

                await batch.commit();
            } else {
                console.warn(
                    'dataConvocatoria no es un array, se ignora:',
                    dataConvocatoria
                );
            }

            res.status(200).json({ success: true, id: docRef.id });
        } catch (err: any) {
            console.error('Error en createConvocatoria:', err);
            res.status(500).json({ error: err.message || 'Error interno' });
        }
    });
});
