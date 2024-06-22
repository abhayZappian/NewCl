import * as Node from "./Nodes";
import NodeSubmitForm from "./NodeSubmitForm";
// import { EmailNode } from "views/email-flow/Nodes/EmailNode";
import { NODETYPE } from "constant";
import { SendEmailNode } from "./SendEmailNode";
import { BeginJourneyNode } from "./BeginJourneyNode";
import { ContactEnterJourneyNode } from "./ContactEnterJourneyNode";
import { WaitForNode } from "./WaitForNode";
import { IsIn } from "./IsIn";
import { EndJourney } from "./EndJourney";
import { SplitNode } from "./SplitNode";

export const nodeTypes = {
  source: Node.Source,
  // [NODETYPE.sendEmail]: EmailNode,
  [NODETYPE.sendEmail]: SendEmailNode,
  [NODETYPE.beginJourney]: BeginJourneyNode,
  [NODETYPE.contactEnterJourney]: ContactEnterJourneyNode,
  [NODETYPE.waitFor]: WaitForNode,
  [NODETYPE.isIn]: IsIn,
  [NODETYPE.split]: SplitNode,
  end_journey: EndJourney,
  event_occurs: Node.Action,
  mail_template: Node.Action,
  call_api_webhook: Node.Action,
  add_to_list: Node.Action,
  add_data_to_field: Node.Action,
  // is_in: Node.Action,
  has_done: Node.Action,
  user_attributes: Node.Action,
  if_this_happens: Node.Action,
  wait_for_time_slot: Node.Action,
  wait_for_event: Node.Action,
  wait_for_date: Node.Action,
  // split: Node.Action,
  // end: Node.End
  // occurrence_of_event: VivekNode,
  // is_segment: ManavNode,
};
