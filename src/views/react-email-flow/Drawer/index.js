import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { selectGetDrawer, selectSelectedNodeType } from 'store/selectors';
import { setDrawerOpen } from 'store/action/journeyCanvas';
import { EmailFormComponent } from 'ui-component/FormComponents/EmailFormComponent';
import { NODETYPE } from 'constant';
import { ContactJourneyFormComponent } from 'ui-component/FormComponents/ContactJourneyFormComponent';
import { MailTempletsFormComponent } from 'ui-component/FormComponents/MailTempletsFormComponent';
import { CallApiWebHookFormComponent } from 'ui-component/FormComponents/CallApiWebHookFormComponent';
import { AddToSegment } from 'ui-component/FormComponents/AddToSegment';
import { AddDateToField } from 'ui-component/FormComponents/AddDateToField';
import { IsInFormComponent } from 'ui-component/FormComponents/IsInFormComponent';
import { HasDoneFormComponent } from 'ui-component/FormComponents/HasDoneFormComponent';
import { UserAttributesForm } from 'ui-component/FormComponents/UserAttributesForm';
import { IfThisHappensFormComponent } from 'ui-component/FormComponents/IfThisHappensFormComponent';
import { WaitForForm } from 'ui-component/FormComponents/WaitForForm';
import { WaitForTimeSlotForm } from 'ui-component/FormComponents/WaitForTimeSlotForm';
import { WaitForEventForm } from 'ui-component/FormComponents/WaitForEventForm';
import { WaitForDateForm } from 'ui-component/FormComponents/WaitForDateForm';
import { SplitForm } from 'ui-component/FormComponents/SplitForm';
import { EventOccurs } from 'ui-component/FormComponents/EventOccurs';
import BeginJourneyFormComponent from 'ui-component/FormComponents/BeginJourneyFormComponent';
import { ScheduleEmailFormComponent } from 'ui-component/FormComponents/ScheduleEmailFormComponent';

export const TemporaryDrawer = () => {
    const isOpen = useSelector(selectGetDrawer);
    const dispatch = useDispatch();
    const selectedNodeType = useSelector(selectSelectedNodeType);
    return (
        <div>
            <Drawer
                anchor={'right'}
                open={isOpen}
                onClose={() => {
                    dispatch(setDrawerOpen(false));
                }}
            >
                {/* {selectedNodeType === 'begin_journey' ? <BeginJourneyFormComponent /> : null} */}
                {selectedNodeType === 'contact_enters_journey' ? <ContactJourneyFormComponent /> : null}
                {selectedNodeType === 'mail_template' ? <MailTempletsFormComponent /> : null}
                {selectedNodeType === 'call_api_webhook' ? <CallApiWebHookFormComponent /> : null}
                {selectedNodeType === 'add_to_list' ? <AddToSegment /> : null}
                {selectedNodeType === 'add_data_to_field' ? <AddDateToField /> : null}
                {selectedNodeType === 'is_in' ? <IsInFormComponent /> : null}
                {selectedNodeType === 'has_done' ? <HasDoneFormComponent /> : null}
                {selectedNodeType === 'user_attributes' ? <UserAttributesForm /> : null}
                {selectedNodeType === 'if_this_happens' ? <IfThisHappensFormComponent /> : null}
                {selectedNodeType === 'wait_for' ? <WaitForForm /> : null}
                {selectedNodeType === 'wait_for_time_slot' ? <WaitForTimeSlotForm /> : null}
                {selectedNodeType === 'wait_for_event' ? <WaitForEventForm /> : null}
                {selectedNodeType === 'wait_for_date' ? <WaitForDateForm /> : null}
                {selectedNodeType === 'split' ? <SplitForm /> : null}
                {selectedNodeType === 'event_occurs' ? <EventOccurs /> : null}
                {selectedNodeType === 'schedule' ? <ScheduleEmailFormComponent /> : null}
                {selectedNodeType === NODETYPE.sendEmail ? <EmailFormComponent /> : null}
            </Drawer>
        </div>
    );
};
