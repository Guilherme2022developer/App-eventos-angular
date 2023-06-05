import { FormGroup } from '@angular/forms';
interface ValidationMessages {
    [key: string]: {
        [key: string]: string
    }
}

export class GenericValidator {
    constructor(private validationMessages: ValidationMessages) {
    }

    processMessages(container: FormGroup): { [key: string]: string } {
        let messages: { [key: string]: string } = {};
        for (let controlkey in container.controls) {
            if (container.controls.hasOwnProperty(controlkey)) {
                let c = container.controls[controlkey];
                if (c instanceof FormGroup) {
                    let childMessages = this.processMessages(c);
                    Object.assign(messages, childMessages);
                } else {
                    if (this.validationMessages[controlkey]) {
                        messages[controlkey] = '';
                        if (c.dirty || c.touched && c.errors) {
                            if (c.errors) {
                                Object.keys(c.errors).map(messageKey => {
                                    if (this.validationMessages[controlkey][messageKey]) {
                                        messages[controlkey] += this.validationMessages[controlkey][messageKey] + '<br />';
                                    }
                                });
                            }
                        }
                    }
                }

            }
        }
        return messages;
    }
}
