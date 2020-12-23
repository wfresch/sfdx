import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    @track isLoading = true;
    
    // Handles loading event
    handleLoading() { 
        console.log('handleLoading');
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        console.log('handleDoneLoading');
        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        const boatTypeId = event.detail.value;
        console.log('boatSearch.searchBoats.boatTypeId: ' + boatTypeId);
        this.template.querySelector("c-boat-search-results").searchBoats(boatTypeId);
        //this.handleLoading();
    }
    
    createNewBoat() { 
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new',
            },
        });
    }
  }