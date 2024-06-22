import React, { useState } from 'react';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from './Sidebar/Sidebar';
import './Sidebar/Sidebar.css';
import { getUpdatedElementsAfterNodeAddition } from './Utils/WorkflowElementUtils.jsx';
import { getIncomers, getOutgoers } from 'react-flow-renderer';
import Layout from './Automation.js';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TemporaryDrawer } from './Drawer';
import { useSelector } from 'react-redux';
import { selectGetEdges, selectGetNodes } from 'store/selectors';
import { useEffect } from 'react';

const ReactEmailFlow = () => {
    const initNodes = useSelector(selectGetNodes);
    const initEdges = useSelector(selectGetEdges);
    const [elements, setElements] = React.useState([]);
    const onAddNodeCallback = ({ id, type }) => {
        setElements((elements) =>
            getUpdatedElementsAfterNodeAddition({
                elements,
                targetEdgeId: id,
                type,
                onDeleteNodeCallback,
                onNodeClickCallback,
                onAddNodeCallback
            })
        );
    };

    const onDeleteNodeCallback = (id) => {
        setElements((elements) => {
            const clonedElements = _.cloneDeep(elements);
            const incomingEdges = clonedElements.filter((x) => x.target === id);
            const outgoingEdges = clonedElements.filter((x) => x.source === id);
            const updatedIncomingEdges = incomingEdges.map((x) => ({
                ...x,
                target: outgoingEdges[0].target
            }));
            const filteredElements = clonedElements.filter(
                (x) => x.id !== id && x.target !== incomingEdges[0].target && x.source !== outgoingEdges[0].source
            );
            filteredElements.push(...updatedIncomingEdges);
            return filteredElements;
        });
    };

    const onNodeClickCallback = (id) => {
        setElements((elements) => {
            const currentNode = elements.find((x) => x.id === id);
            const nodes = elements.filter((x) => x.position);
            const edges = elements.filter((x) => !x.position);
            console.error({
                incomers: getIncomers(currentNode, nodes, edges),
                outgoers: getOutgoers(currentNode, nodes, edges)
            });
            return elements;
        });
    };

    React.useEffect(() => {
        const nodes = initNodes
            .filter((x) => !x.target)
            .map((x) => ({
                ...x,
                data: { ...x.data, onDeleteNodeCallback, onNodeClickCallback }
            }));
        const edges = initEdges.filter((x) => x.target).map((x) => ({ ...x, data: { ...x.data, onAddNodeCallback } }));
        setElements([...nodes, ...edges]);
    }, []);
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Are you sure you want to reload the page?';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        const handleUnload = (event) => {
            const confirmationClicked = window.confirm('You clicked on Reload. Are you sure you want to proceed with the reload?');
            if (!confirmationClicked) {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, []);

    return (
        <>
            <Box>
                <Grid className="journney_title" container>
                    <Grid item>
                        <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '18px' }}>
                            Campaign Journey
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box className="journey_title_action">
                            <Button>
                                <AddIcon />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <div className="journey_master">
                <div className="left_container">
                    <Sidebar />
                </div>
                <div className="right_container">
                    {' '}
                    <Layout elements={elements} />
                </div>
                <TemporaryDrawer />
            </div>
        </>
    );
};

export default ReactEmailFlow;
