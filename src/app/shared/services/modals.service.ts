import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { take } from 'rxjs/operators';

import { DocumentEditorComponent, DocumentEditorNavParams } from '../components/document-editor/document-editor';
import { BackendService } from './classes/backend.service';

@Injectable()
export class ModalsService {
  constructor(private _modalCtrl: ModalController) {}

  editDocument(docId: string, backendService: BackendService) {
    const doc = backendService.getDocument(docId);
    const navParams: DocumentEditorNavParams = {
      data$: doc.valueChanges()
    };

    const modal = this._modalCtrl.create(DocumentEditorComponent, navParams, {});

    modal.onDidDismiss(data => {
      console.log('data: ', data);
    });

    modal.present();
  }
}
