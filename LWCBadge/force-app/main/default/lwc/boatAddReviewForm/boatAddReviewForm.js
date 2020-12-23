import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating = 0;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
        return this.boatId;
    }
    set recordId(value) {
      this.setAttribute('boatId',value);
      this.boatId = value;
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) { 
        this.rating = event.detail.rating;
    }
    
    handleSubmit(event) { 
        event.preventDefault();
        
        const fields = event.detail.fields;
        fields.Boat__c = this.boatId;
        fields.Rating__c = this.rating;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
      const evt = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: TOAST_MESSAGE,
          variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);
      this.dispatchEvent(new CustomEvent('createreview'));

      this.handleReset();
    }
    
    // Clears form data upon submission
    handleReset() { 
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            })
        }
    }
  }