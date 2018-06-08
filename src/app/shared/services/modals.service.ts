import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { take } from 'rxjs/operators';

import { BackendService } from './classes/backend.service';
import { DocumentEditorModalComponent } from './modals/document-editor-modal/document-editor-modal';
import { DocumentEditorNavParams } from './modals/document-editor-modal/document-editor-nav-params';

@Injectable()
export class ModalsService {
  constructor(private _modalCtrl: ModalController) {}

  editDocument(docId: string, backendService: BackendService) {
    const doc = backendService.getDocument(docId);
    const navParams: DocumentEditorNavParams = {
      data$: doc.valueChanges()
    };

    const modal = this._modalCtrl.create(DocumentEditorModalComponent, navParams, {});

    modal.onDidDismiss(data => {
      if (data) {
        backendService.updateDocument(docId, data);
      }
    });

    modal.present();
  }
}
