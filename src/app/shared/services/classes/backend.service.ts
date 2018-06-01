import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class BackendService {
  private _fsCollectionKey: string;
  constructor(private __afs: AngularFirestore, options: { collection: string }) {
    this._fsCollectionKey = options.collection;
  }

  getDocument(documentOrId: any): AngularFirestoreDocument<any> {
    return documentOrId instanceof AngularFirestoreDocument
      ? documentOrId
      : this.__afs.doc(`${this._fsCollectionKey}/${documentOrId}`);
  }

  updateDocument(documentOrId: any, fieldsToUpdate: {}): Promise<void> {
    return this.getDocument(documentOrId).update(fieldsToUpdate);
  }

  toggleDocumentProperty(documentOrId: any, property) {
    this.modifyNestedProperty(documentOrId, property, (nestedPojo, leafProperty) => !!!nestedPojo[leafProperty]);
  }

  setDocumentPropertyValue(documentOrId: any, property, newValue) {
    this.modifyNestedProperty(documentOrId, property, (nestedPojo, leafProperty) => newValue);
  }

  modifyNestedProperty(documentOrId, property, modFunction) {
    const segments = property.split('.');
    this.getDocumentValue$(documentOrId)
      .pipe(take(1))
      .subscribe(documentValue => {
        const { pojo } = this.reachNestedProperty(documentValue, segments);
        const leafProperty = property.split('.').pop();
        const newValue = modFunction(pojo, leafProperty);
        this.updateDocument(documentOrId, {
          [property]: newValue
        });
      });
  }

  private getNestedPropertyValue(pojo: any, segments: string[]) {
    const { value } = this.reachNestedProperty(pojo, segments);
    return value;
  }

  private reachNestedProperty(pojo: any, segments: string[]): { pojo: any; value: string } {
    const segment = segments.shift();
    if (!pojo.hasOwnProperty(segment)) {
      pojo[segment] = {};
    }
    if (segments.length > 1) {
      this.reachNestedProperty(pojo[segment], segments);
    }
    return { pojo: pojo[segment], value: pojo[segment][segments.shift()] };
  }

  getDocumentValue$(documentOrId: any): Observable<{}> {
    return this.getDocument(documentOrId).valueChanges();
  }

  getCollection(): AngularFirestoreCollection<any> {
    return this.__afs.collection<any>(this._fsCollectionKey);
  }

  getCollectionMonitor(collectionKey: string, operation: 'added' | 'removed' | 'modified'): any {}

  getDocumentMonitor(folderPath: string, documentKey: string): any {}
}
