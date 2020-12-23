import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    
    // Private
    error = undefined;
    @track searchOptions;
    @wire(getBoatTypes)
        
    // Wire a custom Apex method
    boatTypes({ error, data }) {
      if (data) {
          console.log('received data in boatTypes');
        this.searchOptions = data.map(type => {
          return {
              label: type.Name, value: type.Id
          };
        });
        this.searchOptions.unshift({ label: 'All Types', value: '' });
      } else if (error) {
          console.log('error in boatTypes');
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      this.selectedBoatTypeId = event.target.value;
      console.log('boatSearchForm.handleSearchOptionChange.selectedBoatTypeId: ' + this.selectedBoatTypeId);
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      const searchEvent = new CustomEvent('search', {
          detail: {
              boatTypeId: this.selectedBoatTypeId
          }
      });
      
      //searchEvent;
      this.dispatchEvent(searchEvent);
    }

  }

  