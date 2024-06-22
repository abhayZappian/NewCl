/* eslint-disable default-case */
import * as colors from '@contactlab/ds-tokens/constants/colors';
import { DatabaseOutlined } from '@ant-design/icons';
import { useNodeId, useReactFlow } from 'reactflow';
import { useDispatch } from 'react-redux';
import { clearFormData, setDrawerOpen, setSelectedNodeId, setSelectedNodeType } from 'store/action/journeyCanvas';
// import { useNodeInfo } from "hooks/useNodeInfo";
import {
    mdiEmailOutline,
    mdiEmailVariant,
    mdiEmailFastOutline,
    mdiClockStart,
    mdiStopCircleOutline,
    mdiLocationEnter,
    mdiCalendarClock,
    mdiWebhook,
    mdiSegment,
    mdiPlus,
    mdiViewListOutline,
    mdiCheckOutline,
    mdiAccountCircleOutline,
    mdiShapeOutline,
    mdiTimerSandComplete,
    mdiCalendarFilterOutline,
    mdiClipboardTextClock,
    mdiFormatPageSplit,
    mdiCloseThick
} from '@mdi/js';

import './Style.scss';
import Icon from '@mdi/react';

export const BaseNode = ({ type, data, selected, disabled, onNodeClick, onCloseIconClick, additionalClassName }) => {
    const nodeId = useNodeId();
    const dispatch = useDispatch();
      const { setNodes, setEdges } = useReactFlow();

    const handleClick = () => {
        dispatch(setDrawerOpen(true));
        dispatch(setSelectedNodeType(type));
        dispatch(setSelectedNodeId(nodeId));
    };
 const handleDeleteNode = (event) => {
   console.log("delete called");
   console.log(nodeId);
   dispatch(clearFormData(nodeId));
   setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
//    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
 setEdges((edges) =>
   edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
 );
   event.stopPropagation();
 };
    const content = (
      <>
        {/* {getIconSrc(type)} */}
        {/* <div className="NodeContent">
        <div className="NodeTitle">{data.title}</div>
        <p className="NodeDesc">{data.description}</p>
      </div> */}
        <div onClick={handleClick} className="node_design_wrapper" >
          <div className="icon_design">
            <Icon path={getIconSrc(type)} size={1.7} />
          </div>
          <div className="node_delete_icon">
            <Icon
              onClick={handleDeleteNode}
              
              color="red"
              path={mdiCloseThick}
              size={1}
            />
          </div>
          <div className="node_info">
            <div className="NodeTitle">{data.title}</div>
            <p className="NodeDesc">{data.description}</p>
            {/* <button onClick={handleDelete}>delete</button> */}
          </div>
        </div>
      </>
    );
    return (
        <div
            // style={{ color: getColor(type) }}
            aria-disabled={disabled}
            {...(onNodeClick && { onClick: () => onNodeClick(type, data) })}
        >
            {content}
            {/* <CloseOutlined className="closeIcon" onClick={onCloseIconClick} /> */}
        </div>
    );
};

export const EmptyBaseNode = () => {
    return <div className="EmptyNodeInnerWrapper"></div>;
};

// --- Helpers
const getColor = (type) => {
    switch (type) {
        case 'source':
            return colors.black;
        case 'send_email':
            return colors.accent;
        case 'sms':
            return colors.accent;
        case 'waitThenCheck':
            return colors.warning;
        case 'end':
            return colors.base;
        default:
            return colors.base;
    }
};

const getIconSrc = (type) => {
    const color = getColor(type);

    switch (type) {
        case 'source':
            return <DatabaseOutlined className="NodeIcon" style={{ color }} />;
        case 'send_email':
            // return <DatabaseOutlined className="NodeIcon" style={{ color }} />;
            return mdiEmailOutline;
        case 'begin_journey':
            return mdiClockStart;
        case 'end_journey':
            return mdiStopCircleOutline;
        case 'contact_enters_journey':
            return mdiLocationEnter;
        case 'event_occurs':
            return mdiCalendarClock;
        case 'mail_template':
            return mdiEmailFastOutline;
        case 'call_api_webhook':
            return mdiWebhook;
        case 'add_to_list':
            return mdiSegment;
        case 'add_data_to_field':
            return mdiPlus;
        case 'is_in':
            return mdiViewListOutline;
        case 'has_done':
            return mdiCheckOutline;
        case 'user_attributes':
            return mdiAccountCircleOutline;
        case 'if_this_happens':
            return mdiShapeOutline;
        case 'wait_for':
            return mdiCalendarClock;
        case 'wait_for_time_slot':
            return mdiTimerSandComplete;
        case 'wait_for_event':
            return mdiCalendarFilterOutline;
        case 'wait_for_date':
            return mdiClipboardTextClock;
        case 'split':
            return mdiFormatPageSplit;
    }
};
