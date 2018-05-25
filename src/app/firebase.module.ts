import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { ENV } from '@app/env';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(ENV.firebase, 'Ionosphere'),
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  exports: [AngularFireModule, AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule]
})
export class FirebaseModule {}
