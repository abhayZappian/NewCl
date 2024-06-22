const checkForValidJourney = (type, formData, id) => {
    let fdnode;
    switch (type) {
        case 'begin_journey':
            return { action: 1, message: 'begin_journey' };
        case 'end_journey':
            return { action: 1, message: 'end_journey' };
        case 'contact_enters_journey':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in contact journey',
                    nodeId: id
                };
            }
            if (formData[id].contacts.length !== 0) {
                formData[id].contacts.map((listele) => {
                    if (listele instanceof Object) {
                        if (Object.keys(listele).length === 0) {
                            return { action: 0, message: 'please select list_name' };
                        } else if (listele.list.list_name.length === 0 && listele.list.list_name.length === 0) {
                            return { action: 0, message: 'please select list_name' };
                        }
                    }
                    if (Array.isArray(listele)) {
                        if (listele.length === 0) {
                            return { action: 0, message: 'please select segment_name' };
                        } else {
                            listele.map((segele) => {
                                if (segele.segment_name.length === 0) {
                                    return { action: 0, message: 'please select segment_name' };
                                }
                            });
                        }
                    }
                });
                return { action: 1, message: 'contact_enters_journey' };
            }
            return { action: 0, message: 'please select list and segment' };
        case 'send_email':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in email',
                    nodeId: id
                };
            }
            if (Object.keys(fdnode.offerId).length === 0) {
                return { action: 0, message: 'please select offerId', nodeId: id };
            } else if (fdnode.offerId.offer_name.length === 0) {
                return { action: 0, message: 'please select offer_name', nodeId: id };
            } else if (Object.keys(fdnode.espName).length === 0) {
                return { action: 0, message: 'please select espName' };
            } else if (fdnode.espName.esp_name.length === 0) {
                return { action: 0, message: 'please select esp_name' };
            } else if (Object.keys(fdnode.emailServiceAccount).length === 0) {
                return { action: 0, message: 'please select emailServiceAccount' };
            } else if (fdnode.emailServiceAccount.account_name.length === 0) {
                return { action: 0, message: 'please select account_name' };
            } else if (Object.keys(fdnode.templateList).length === 0) {
                return { action: 0, message: 'please select templateList' };
            } else if (fdnode.templateList.template_name.length === 0) {
                return { action: 0, message: 'please select template_name' };
            } else if (fdnode.fromName.length === 0) {
                return { action: 0, message: 'please select fromName' };
            } else if (fdnode.subjectLine.length === 0) {
                return { action: 0, message: 'please select subjectLine' };
            } else if (fdnode.fromDomain.length === 0) {
                return { action: 0, message: 'please select fromDomain' };
            } else if (fdnode.replyTo.length === 0) {
                return { action: 0, message: 'please select replyTo' };
            }
            return { action: 1, message: 'send_emai' };
        case 'call_api_webhook':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in call_api_webhook',
                    nodeId: id
                };
            }
            fdnode = formData[id];
            if (fdnode.callApi.length === 0) {
                return { action: 0, message: 'please select call api list' };
            } else {
                fdnode.callApi.map((ele) => {
                    if (ele.value.length === 0) {
                        return { action: 0, message: 'please select call api list' };
                    }
                });
                return { action: 1, message: 'callApi' };
            }

        case 'add_to_list':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in add_to_list',
                    nodeId: id
                };
            }
            fdnode = formData[id];
            if (fdnode.type.length === 0) {
                return { action: 0, message: 'please select a type' };
            } else if (fdnode.type === 'Existing') {
                if (fdnode.list.length === 0) {
                    return { action: 0, message: 'please select a list' };
                }
                return { action: 1, message: 'Add To List' };
            } else if (fdnode.type === 'New') {
                if (fdnode.listName.length === 0) {
                    return { action: 0, message: 'please select a list' };
                } else if (fdnode.description.length === 0) {
                    return { action: 0, message: 'please type a description' };
                }
                return { action: 1, message: 'Add To List' };
            }
        // eslint-disable-next-line no-fallthrough
        case 'event_occurs':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in event_occurs',
                    nodeId: id
                };
            }
            fdnode = formData[id];
            if (fdnode.conditonOptions.length === 0) {
                return { action: 0, message: 'please select a condition option' };
            } else if (fdnode.schedularConditions && Object.keys(fdnode.schedularConditions).length === 0) {
                return { action: 0, message: 'please select a schedularCondition' };
            } else if (fdnode?.schedularConditions?.label?.length === 0) {
                return { action: 0, message: 'please select a schedularCondition' };
            }
            return { action: 1, message: 'event_occurs' };
        case 'wait_for':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in wait_for',
                    nodeId: id
                };
            }
            fdnode = formData[id];
            if (fdnode.type.length === 0) {
                return { action: 0, message: 'please select a type' };
            }
            if (fdnode.type === 'Relative') {
                if (fdnode.fieldKey.length === 0) {
                    return { action: 0, message: 'please select a field key' };
                } else if (fdnode.fieldKey === 'Year') {
                    if (fdnode.Year === null || fdnode.Year === undefined) {
                        return { action: 0, message: 'please select a year' };
                    } else if (fdnode.months === null || fdnode.months === undefined) {
                        return { action: 0, message: 'please select a month' };
                    } else if (fdnode.Day === null || fdnode.Day === undefined) {
                        return { action: 0, message: 'please select a day' };
                    } else if (fdnode.time.length === 0) {
                        return { action: 0, message: 'please select a time' };
                    }
                    return { action: 1, message: 'wait_for' };
                } else if (fdnode.fieldKey === 'Months') {
                    if (fdnode.months === null || fdnode.months === undefined) {
                        return { action: 0, message: 'please select a month' };
                    } else if (fdnode.Day === null || fdnode.Day === undefined) {
                        return { action: 0, message: 'please select a day' };
                    } else if (fdnode.time.length === 0) {
                        return { action: 0, message: 'please select a time' };
                    }
                    return { action: 1, message: 'wait_for' };
                } else if (fdnode.fieldKey === 'Week') {
                    if (fdnode.Week === null && fdnode.Week === undefined) {
                        return { action: 0, message: 'please select a week' };
                    } else if (fdnode.Day === null || fdnode.Day === undefined) {
                        return { action: 0, message: 'please select a day' };
                    } else if (fdnode.time.length === 0) {
                        return { action: 0, message: 'please select a time' };
                    }
                    return { action: 1, message: 'wait_for' };
                } else if (fdnode.fieldKey === 'Day') {
                    if (fdnode.Day === null || fdnode.Day === undefined) {
                        return { action: 0, message: 'please select a day' };
                    } else if (fdnode.time.length === 0) {
                        return { action: 0, message: 'please select a time' };
                    }
                    return { action: 1, message: 'wait_for' };
                } else if (fdnode.fieldKey === 'Hours') {
                    if (fdnode.hours === null && fdnode.hours === undefined) {
                        return { action: 0, message: 'please select hours' };
                    } else if (fdnode.minutes === null && fdnode.minutes === undefined) {
                        return { action: 0, message: 'please select minutes' };
                    }
                    return { action: 1, message: 'wait_for' };
                } else if (fdnode.fieldKey === 'Minutes') {
                    if (fdnode.minutes === null && fdnode.minutes === undefined) {
                        return { action: 0, message: 'please select minutes' };
                    }
                    return { action: 1, message: 'wait_for' };
                }
            }
            if (fdnode.type === 'Fixed') {
                if (fdnode.date.length === 0) {
                    return { action: 0, message: 'please select a date' };
                } else if (fdnode.time.length === 0) {
                    return { action: 0, message: 'please select a time' };
                }
                return { action: 1, message: 'wait_for' };
            }
        case 'user_attributes':
            fdnode = formData[id];
            if (Object.keys(fdnode.list).length === 0) {
                return { action: 0, message: 'please select a list' };
            } else if (Object.keys(fdnode.column).length === 0) {
                return { action: 0, message: 'please select a column' };
            } else if (Object.keys(fdnode.conditions).length === 0) {
                return { action: 0, message: 'please select a conditions' };
            } else if (Object.keys(fdnode.value).length === 0) {
                return { action: 0, message: 'please select a value' };
            }
            return { action: 1, message: 'user_attributes' };
        case 'add_data_to_field':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in add_data_to_field',
                    nodeId: id
                };
            }
            if (fdnode.value1.length === 0) {
                return { action: 0, message: 'please select a value' };
            } else if (fdnode.value2.length === 0) {
                return { action: 0, message: 'please select a value' };
            } else if (fdnode.value3.length === 0) {
                return { action: 0, message: 'please select a value' };
            } else if (Object.keys(fdnode.list1).length === 0) {
                return { action: 0, message: 'please select a list ' };
            } else if (Object.keys(fdnode.list2).length === 0) {
                return { action: 0, message: 'please select a list ' };
            } else if (Object.keys(fdnode.list3).length === 0) {
                return { action: 0, message: 'please select a list ' };
            } else if (Object.keys(fdnode.colomn1).length === 0) {
                return { action: 0, message: 'please select a column' };
            } else if (Object.keys(fdnode.colomn2).length === 0) {
                return { action: 0, message: 'please select a column' };
            } else if (Object.keys(fdnode.colomn3).length === 0) {
                return { action: 0, message: 'please select a column' };
            }
            return { action: 1, message: 'add_data_to_field' };
        case 'is_in':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in is_in',
                    nodeId: id
                };
            }
            if (fdnode.list.length === 0) {
                return { action: 0, message: 'please select a list' };
            } else if (fdnode.segment.length === 0) {
                return { action: 0, message: 'please select a segment' };
            }
            return { action: 1, message: 'is_in' };
        case 'has_done':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in has_done',
                    nodeId: id
                };
            }
            if (fdnode.not === null) {
                return { action: 0, message: 'please select a not' };
            } else if (fdnode.conditonOptions.length === 0) {
                return { action: 0, message: 'please select a condition option' };
            } else if (Object.keys(fdnode.schedularConditions).length === 0) {
                return { action: 0, message: 'please select a schedularCondition' };
            }
            return { action: 1, message: 'has_done' };
        case 'if_this_happens':
            fdnode = formData[id];
            if (!fdnode) {
                return {
                    action: 0,
                    message: 'Error in if_this_happens',
                    nodeId: id
                };
            }
            if (fdnode.option.length === 0) {
                return { action: 0, message: 'please select a option' };
            }
            return { action: 1, message: 'if_this_happens' };
        default:
            console.log('journey end for the email id.');
            return { action: 1, message: '' };
    }
};

export const checkJourneyValidOrNot = (data) => {
    console.log(data.formData, 'lengthhhhhhh');
    let result = {};
    for (let i = 0; i < data.nodes.length; i++) {
        // console.log(data.nodes[i], 'eeeeee');
        console.log(data.formData, 'ccccccc');
        result = checkForValidJourney(data?.nodes[i]?.type, data?.formData, data?.nodes[i]?.id);
        if (result.action === 0) {
        }
        return result;
    }

    console.log('i am out of loop');
    return result;
};
