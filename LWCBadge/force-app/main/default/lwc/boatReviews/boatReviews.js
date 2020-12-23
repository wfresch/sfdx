import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    @track boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
        return this.boatId;
    }
    set recordId(value) {
      //sets boatId attribute
      this.setAttribute('boatId', value);
      //sets boatId assignment
      this.boatId = value;
      //get reviews associated with boatId
      this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
        return (this.boatReviews != undefined && this.boatReviews != null && this.boatReviews != '') ? true : false;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() { 
        this.getReviews();
    }
    
    // Imperative Apex call to get reviews for given boat
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 
        // returns immediately if boatId is empty or null
        if (this.boatId == null || this.boatId == '') {
            return;
        }

        // sets isLoading to true during the process and false when it’s completed
        this.isLoading = true;
        this.error = undefined;

        getAllReviews({ boatId: this.boatId })
        //getAllReviews({ boatId: this.recordId })
        .then(res => {
            this.boatReviews = res;
            this.isLoading = false;
        })
        .catch(error => {
            this.boatReviews = undefined;
            //this.error = error.body.message;
            this.error = error;
        })
        .finally(() => {
            this.isLoading = false;
        })
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'User',
                recordId: event.target.dataset.recordId,
                actionName: 'view'
            }
        });
    }
  }