import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData, doc, docData , getDoc, getDocs, getDocsFromServer, query, setDoc, updateDoc, where  } from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root',

})
export class FirebaseService {

    private readonly tokenSesion = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiTEFSQVBFIiwib3duZXJJZCI6MSwicHJvZmlsZUlkIjoxLCJ0eXBlVXNlciI6InVzZXIiLCJpYXQiOjE3NDI1MDIxNDEsImV4cCI6MTc0MjUwNTc0MX0.X0ptAEuvE-z6TLCsPkoiSdW6LA77pF49QWmEkfcn0vY'

    encryptedText: string = '';
    decryptedText: string = '';


  constructor(
    private firestore: Firestore,


) {}

getCollection<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    const q = query(ref,
        where("token", "==", this.tokenSesion));
    return from(getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    ));
  }


//   getDocumentId(collectionName: string, userId: string): Observable<any> {
//     const userRef = collection(this.firestore, collectionName);
//     const q = query(userRef, where("__name__", "==", String(userId)), where("token", "==", this.tokenSesion));
//   return from(getDocs(q).then(querySnapshot => {
//     if (!querySnapshot.empty) {
//       return querySnapshot.docs[0].data();
//     }
//     return null;
//   }));
//   }


  getDocumentId(collectionName: string, userId: string): Observable<any> {
    const userRef = collection(this.firestore, collectionName);

    // 🔹 Filtrar por ID y Token
    const q = query(userRef,
        where("token", "==", this.tokenSesion),
        where("__name__", "==", String(userId)))

    return from(getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }
        return null;
    }));
}




  createDocumentWithId<T>(collectionName: string, docId: string, data: T): Observable<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(collectionRef, docId);
    const dataWithId = { ...data, id: docId, token: this.tokenSesion };
    return from(setDoc(docRef, dataWithId));
  }

  updateDocument(collectionName: string, docId: string, data: any): Observable<void> {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return from(updateDoc(docRef, {...data, token: this.tokenSesion}));
  }


  updateDocumentComplet<T>(collectionName: string, docId: string, data: any): Observable<T> {
    const docRef : DocumentReference<DocumentData, DocumentData> = doc(this.firestore, `${collectionName}/${docId}`);

    return from(updateDoc(docRef, {...data, token:this.tokenSesion})).pipe(
      switchMap(() => from(getDoc(docRef))), // Obtener el documento después de actualizarlo
      map((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as T; // Devolver el documento actualizado
        } else {
          throw new Error("El documento no existe");
        }
      })
    );
  }




  getDocumentsByRange(collectionName: string, field: string, minValue: number, maxValue: number): Observable<any> {
    const ref = collection(this.firestore, collectionName);
    const q = query(ref,
        where(field, ">=", minValue),
        where(field, "<=", maxValue),
        where('token', "==", this.tokenSesion),
    );
    return from(getDocs(q).then(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ));
}







}
