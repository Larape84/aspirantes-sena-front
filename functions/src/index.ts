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
                fecha,
                registros,
                user,
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
                fecha,
                registros,
                user,
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

export const getCollection = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    corsHandler(req, res, async () => {
        try {
            if (req.method !== 'POST') {
                res.status(405).send('Método no permitido');
                return;
            }

            const { collectionName } = req.body;

            if (!collectionName) {
                res.status(400).json({
                    error: 'Falta el nombre de la colección',
                });
                return;
            }

            const snapshot = await db.collection(collectionName).get();

            if (snapshot.empty) {
                res.status(404).json({
                    error: 'La colección está vacía o no existe',
                });
                return;
            }

            const documentos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            res.status(200).json(documentos);
        } catch (err: any) {
            console.error('Error en getCollection:', err);
            res.status(500).json({ error: err.message || 'Error interno' });
        }
    });
});

export const buscarEnConvocatorias = functions.https.onRequest(
    async (req, res) => {
        // habilitar CORS si lo necesitas
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        try {
            if (req.method !== 'POST') {
                res.status(405).send('Método no permitido');
                return;
            }

            const { DOCUMENTO, TIPO_DOCUMENTO } = req.body;

            if (!DOCUMENTO || !TIPO_DOCUMENTO) {
                res.status(400).json({ error: 'Faltan parámetros' });
                return;
            }

            const convocatoriasRef = db.collection('convocatorias');
            const snapshot = await convocatoriasRef.get();

            let resultados: any[] = [];

            for (const doc of snapshot.docs) {
                const dataConvRef = convocatoriasRef
                    .doc(doc.id)
                    .collection('dataConvocatoria');

                const querySnap = await dataConvRef
                    .where('DOCUMENTO', '==', String(DOCUMENTO)) // 🔑 forzar a string
                    .where('TIPO_DOC', '==', String(TIPO_DOCUMENTO)) // 🔑 ojo con el nombre del campo
                    .get();

                if (!querySnap.empty) {
                    querySnap.forEach((subDoc) => {
                        resultados.push({
                            convocatoriaId: doc.id,
                            dataConvocatoriaId: subDoc.id,
                            ...subDoc.data(),
                        });
                    });
                }
            }

            if (resultados.length === 0) {
                res.json({ error: 'No se encontraron resultados' });
            } else {
                res.json({ resultados });
            }
        } catch (error: any) {
            console.error('Error en getConvocatoria:', error);
            res.status(500).json({ error: error.message || 'Error interno' });
        }
    }
);
