import { LightningElement, api, wire } from 'lwc';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { MessageContext, publish } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true' },
    { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
    { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
];

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  isLoading = false;
  
  // wired message context
  @wire(MessageContext)
  messageContext;
  
  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
//   wiredBoats(result) { 
//       this.boats = result;
//       if (result.error) {
//           this.error = result.error;
//           this.boats = undefined;
//       }
//       this.isLoading = false;
//       this.notifyLoading(this.isLoading);
//   }
  wiredBoats(result) {
    this.notifyLoading(false);
    this.boats = result;
    if (result.error) {
      console.log(result.error.message);
    }
    this.notifyLoading(false);
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) { 
      console.log('boatSearchResults.searchBoats.boatTypeId: ' + boatTypeId);
    //   this.isLoading = true;
    //   this.notifyLoading(this.isLoading);
    //   this.boatTypeId = boatTypeId;
    this.notifyLoading(true);
    this.boatTypeId = boatTypeId;
    this.notifyLoading(false);
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() { 
    // this.isLoading = true;
    // this.notifyLoading(this.isLoading); 
    this.notifyLoading(true);
    await refreshApex(this.boats);
    // this.isLoading = false;
    // this.notifyLoading(this.isLoading); 
    this.notifyLoading(false);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
      this.selectedBoatId = event.detail.boatId;
      this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    publish(this.messageContext, BOATMC, { recordId: boatId});
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    this.notifyLoading = true;
    
    const updatedFields = event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return fields;
    })

    const promises = updatedFields.map(updatedField => updateRecord(updatedFields));
    Promise.all(promises).then (res => {
        this.dispatchEvent(
            new ShowToastEvent({ title: SUCCESS_TITLE, message: MESSAGE_SHIP_IT, variant: SUCCESS_VARIANT })
        );
        this.draftValues = [];
        return this.refresh();
    }).catch(error => {
        this.error = error;
        this.dispatchEvent(
            new ShowToastEvent({ title: ERROR_TITLE, message: error.body.message, variant: ERROR_VARIANT })
        );
        this.notifyLoading(false);
    }).finally(() => {
        this.draftValues = [];
    });

    // Update the records via Apex
    // updateBoatList({data: updatedFields})
    // .then(() => {
    //     this.ShowToastEvent(SUCCESS_TITLE, MESSAGE_SHIP_IT, SUCCESS_VARIANT);
    //     this.draftValues = [];
    //     return this.refresh();
    // })
    // .catch(error => {
    //     this.error = error;
    //     this.ShowToastEvent(ERROR_TITLE, error.body.message, ERROR_VARIANT);
    //     this.notifyLoading = false;
    // })
    // .finally(() => {
    //     this.draftValues = [];
    // });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
      this.isLoading = isLoading;
    if (isLoading) {
        this.dispatchEvent(new CustomEvent('loading'));
    }
    else {
        this.dispatchEvent(CustomEvent('doneloading'));
    }
  }
}
