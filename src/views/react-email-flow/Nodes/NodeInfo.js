export const NodeInfo = (nodeType) => {
    switch (nodeType) {
        case 'send_email':
            return {
                title: 'Email',
                description: 'Description for Email'
            };
        case 'begin_journey':
            return {
                title: 'begin_journey',
                description: 'Description for Begin Journey'
            };
        case 'end_journey':
            return {
                title: 'End Journey',
                description: 'Journey is Ended'
            };
        case 'contact_enters_journey':
            return {
                title: 'Contact Node',
                description: 'Description for contact_enters_journey'
            };
        case 'event_occurs':
            return {
                title: 'Event Occurs',
                description: 'Description for Push'
            };
        case 'mail_template':
            return {
                title: 'mail_template',
                description: 'Description for Email Mobile'
            };
        case 'call_api_webhook':
            return {
                title: 'Call API ',
                description: 'Description for Email Mobile'
            };
        case 'add_to_list':
            return {
                title: 'Add to list',
                description: 'Description for Email Mobile'
            };
        case 'add_data_to_field':
            return {
                title: 'Add Data to Field',
                description: 'Description for Email Mobile'
            };
        case 'is_in':
            return {
                title: 'Is in',
                description: 'Description for Email Mobile'
            };
        case 'has_done':
            return {
                title: 'Has Done',
                description: 'Description for Email Mobile'
            };
        case 'user_attributes':
            return {
                title: 'User Attributes',
                description: 'Description for Email Mobile'
            };
        case 'if_this_happens':
            return {
                title: 'If this happens',
                description: 'Description for Email Mobile'
            };
        case 'wait_for':
            return {
                title: 'Wait for',
                description: 'Description for Email Mobile'
            };
        case 'wait_for_time_slot':
            return {
                title: 'wait_for_time_slot',
                description: 'Description for Email Mobile'
            };
        case 'wait_for_event':
            return {
                title: 'wait_for_event',
                description: 'Description for Email Mobile'
            };
        case 'wait_for_date':
            return {
                title: 'wait_for_date',
                description: 'Description for Email Mobile'
            };
        case 'split':
            return {
                title: 'split',
                description: 'Description for Email Mobile'
            };

        // Add more cases for other node types as needed
        default:
            return {
                title: 'Default Title',
                description: 'Default Description'
            };
    }
};
