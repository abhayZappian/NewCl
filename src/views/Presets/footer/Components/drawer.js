import { Box, Button, Drawer, Grid, TextField, ToggleButton } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@mui/joy';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import AceEditor from 'react-ace';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-min-noconflict/ext-spellcheck';
import 'ace-builds/webpack-resolver';
import { useRef, useState, useEffect } from 'react';
import { addFooter, updatedFooter } from 'services/presets/footer';
const validationSchema = Yup.object().shape({
    footer_name: Yup.string()
        .trim()
        .required('Footer name  required')
        .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words '),
    htmlCode: Yup.string().required('Footer content is required')
});
const removeNewlines = (inputString) => {
    return inputString?.replace(/\n/g, '');
};

const FooterDrawer = ({ openActive, setDefaultValues, setOpenActive, defaultValues, getDataRender }) => {
    const [receivedData, setReceivedData] = useState({});
    const defaultValueslength = Object.keys(defaultValues).length;
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const aceEditorRef = useRef();

    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues !== undefined && Object.keys(defaultValues).length) {
            setFieldValues(defaultValues);
        } else {
            formik.resetForm();
        }
    }, [defaultValues]);

    const setFieldValues = (values) => {
        formik.setFieldValue('footer_name', defaultValues?.footer_name);
        formik.setFieldValue('htmlCode', defaultValues?.footer_message);
        setTimeout(() => {
            formik.validateField('footer_name');
            formik.validateField('htmlCode');
        }, 0);
    };

    const addFooterDetails = async (values) => {
        try {
            const res = await addFooter(values);
            if (res) {
                setOpenActive({ drawer: false });
                getDataRender();
            }
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
        }
    };

    const updatedFooterDetails = async (values) => {
        try {
            const res = await updatedFooter(values, defaultValues?.id);
            if (res) {
                setOpenActive({ drawer: false });
                getDataRender();
            }
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            htmlCode: '',
            footer_name: '',
            footer_message: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (defaultValueslength === 0) {
                addFooterDetails(values);
                setButtonDisabled(true);
            } else {
                updatedFooterDetails(values);
                setButtonDisabled(true);
            }
        }
    });

    useEffect(() => {
        const cleanedHtmlCode = removeNewlines(formik.values.htmlCode);
        formik.setFieldValue('footer_message', cleanedHtmlCode);
    }, [formik.values.htmlCode]);
    const onEditorChange = (newValue) => {
        formik.setFieldValue('htmlCode', newValue);
    };

    return (
        <>
            <Drawer anchor="right" open={openActive}>
                <Box sx={{ m: 1, width: '90vw', margin: '24px' }} noValidate autoComplete="off">
                    <div>
                        <form onSubmit={formik.handleSubmit}>
                            <Typography
                                sx={{
                                    fontWeight: '600',
                                    fontSize: '1.3rem',
                                    mt: 4
                                }}
                            >
                                Add Email Footer
                            </Typography>
                            <Box>
                                <div style={{ width: '330px' }}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        label="Footer Name"
                                        name="footer_name"
                                        value={formik.values.footer_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.footer_name && formik.errors.footer_name && (
                                        <div style={{ color: 'red' }}>{formik.errors.footer_name}</div>
                                    )}
                                </div>
                            </Box>
                            <Box sx={{ marginTop: '25px', height: '60vh' }}>
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        height: '5vh',
                                        marginTop: '40px'
                                    }}
                                >
                                    <Typography>Footer Text</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8} sx={{}}>
                                            <ToggleButton value="right" aria-label="Small sizes">
                                                <IntegrationInstructionsOutlinedIcon />
                                            </ToggleButton>
                                        </Grid>
                                        <Grid
                                            xs={4}
                                            item
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end'
                                            }}
                                        >
                                            <ToggleButton value="right" aria-label="Small sizes" sx={{ marginLeft: '10px' }}>
                                                <FormatAlignRightIcon />
                                            </ToggleButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={{
                                        backgroundColor: '',
                                        border: '1px solid grey',
                                        height: '55vh',
                                        marginTop: '30px',
                                        width: '90vw'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            height: '100%',
                                            width: '100%',
                                            overflowY: 'scroll',
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '50%'
                                            }}
                                        >
                                            <AceEditor
                                                mode="html"
                                                theme="monokai"
                                                name="footer_message"
                                                height="100%"
                                                width="100%"
                                                ref={aceEditorRef}
                                                onChange={onEditorChange}
                                                fontSize={14}
                                                showPrintMargin={true}
                                                focus={true}
                                                editorProps={{ $blockScrolling: true }}
                                                wrapEnabled={true}
                                                highlightActiveLine={true}
                                                autoScrollEditorIntoView={true}
                                                value={formik.values.htmlCode}
                                                setOptions={{
                                                    enableBasicAutocompletion: true,
                                                    enableLiveAutocompletion: true,
                                                    enableSnippets: true,
                                                    showLineNumbers: true,
                                                    tabSize: 2,
                                                    showGutter: true
                                                }}
                                            />
                                        </Box>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: formik.values.htmlCode
                                            }}
                                        ></div>
                                    </Box>
                                    {formik.touched.htmlCode && formik.errors.htmlCode && (
                                        <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.htmlCode}</div>
                                    )}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: '60px'
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        setOpenActive({ drawer: false });
                                        setFieldValues(defaultValues);
                                        formik.resetForm();
                                        setDefaultValues({});
                                    }}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button disabled={isButtonDisabled} variant="contained" type="submit">
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </div>
                </Box>
            </Drawer>
        </>
    );
};

export default FooterDrawer;
