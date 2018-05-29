import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { ENV } from '@app/env';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(ENV.firebase, 'Ionosphere'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  exports: [AngularFireModule, AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule]
})
export class FirebaseModule {
  constructor(afs: AngularFirestore) {
    afs.firestore.settings({ timestampsInSnapshots: true });
    afs.firestore.enablePersistence();
  }
}
