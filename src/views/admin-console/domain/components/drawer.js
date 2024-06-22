import { Autocomplete, Box, Button, Drawer, TextField, Typography } from '@mui/material';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDomainServicesDetails } from 'services/adminConsole/esp/domain';
import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { enqueueSnackbar } from 'notistack';
import { createdBy, createdByName } from '../../../../helpers/userInfo';

const validationSchema = Yup.object().shape({
    domain: Yup.mixed().required('Please select one Domain'),
    cloudFlareProviderAccount: Yup.string().when(['domain.service_name'], {
        is: 'CloudFlare',
        then: Yup.string()
            .trim()
            .required('Domain provider Account required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    }),
    cloudFareEmail: Yup.string().when(['domain.service_name'], {
        is: 'CloudFlare',
        then: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email format')
            .required('Email Required')
    }),
    cloudFlareApiToken: Yup.string().when(['domain.service_name'], {
        is: 'CloudFlare',
        then: Yup.string()
            .trim()
            .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid CloudFlare API token format')
            .required('API Token Required')
    }),
    cloudnsProviderAccount: Yup.string().when(['domain.service_name'], {
        is: 'Cloudns',
        then: Yup.string()
            .trim()
            .required('Domain provider Account required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    }),
    cloudnsEmail: Yup.string().when(['domain.service_name'], {
        is: 'Cloudns',
        then: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email format')
            .required('Email Required')
    }),
    cloudnsApiKey: Yup.string().when(['domain.service_name'], {
        is: 'Cloudns',
        then: Yup.string()
            .trim()
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words')
            .required('Api Key Required')
    }),
    cloudnsApiSecret: Yup.string().when(['domain.service_name'], {
        is: 'Cloudns',
        then: Yup.string()
            .trim()
            .matches(/^[\w-]*$/, 'Invalid API Secret')
            .min(6, 'API Secret must be at least 6 characters')
            .max(50, 'API Secret must be at most 50 characters')
            .required('Api Secret Required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    }),
    godaddyProviderAccount: Yup.string().when(['domain.service_name'], {
        is: 'Godaddy',
        then: Yup.string().trim().required('Domain provider Account required')
    }),
    godaddyEmail: Yup.string().when(['domain.service_name'], {
        is: 'Godaddy',
        then: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email format')
            .required('Email Required')
    }),
    godaddyApiKey: Yup.string().when(['domain.service_name'], {
        is: 'Godaddy',
        then: Yup.string()
            .trim()
            .required('Api Key Required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    }),
    godaddyApiSecret: Yup.string().when(['domain.service_name'], {
        is: 'Godaddy',
        then: Yup.string()
            .trim()
            .matches(/^[\w-]*$/, 'Invalid API Secret')
            .min(6, 'API Secret must be at least 6 characters')
            .max(50, 'API Secret must be at most 50 characters')
            .required('Api Secret Required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words ')
    }),
    mailChamp1ProviderAccount: Yup.string().when(['domain.service_name'], {
        is: 'MailChmap1',
        then: Yup.string()
            .trim()
            .required('Domain provider Account required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words in the MailChmap1')
    }),
    mailChamp1Email: Yup.string().when(['domain.service_name'], {
        is: 'MailChmap1',
        then: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email format')
            .required('Email Required')
    }),
    namecheapProviderAccount: Yup.string().when(['domain.service_name'], {
        is: 'Namecheap',
        then: Yup.string()
            .trim()
            .required('Domain provider Account required')
            .matches(/^[^\s]+(\s[^\s]+)*$/, 'Only one space is allowed between words in the Namecheap')
    }),
    namecheapEmail: Yup.string().when(['domain.service_name'], {
        is: 'Namecheap',
        then: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Invalid email format')
            .required('Email Required')
    }),
    namecheapApiKey: Yup.string().when(['domain.service_name'], {
        is: 'Namecheap',
        then: Yup.string().trim().required('Api Key Required')
    }),
    namecheapApiUser: Yup.string().when(['domain.service_name'], {
        is: 'Namecheap',
        then: Yup.string().trim().required('Api User Required')
    })
});

const DomainDrawer = ({ defaultValues, setDefaultValues, isDrawerOpen, setIsDrawerOpen, getDataRender }) => {
    const [data, setData] = useState([]);
    const [receivedData, setReceivedData] = useState({});
    const defaultValueslength = Object.keys(defaultValues).length;

    useEffect(() => {
        setReceivedData(defaultValues);
        if (defaultValues && Object.keys(defaultValues).length) {
            setFieldValues(defaultValues);
        } else {
            formik.resetForm();
        }
    }, [defaultValues]);

    const setFieldValues = (values) => {
        const domainValue = data.find((res) => (res.service_name === defaultValues?.service_name ? defaultValues?.service_name : null));
        formik.setFieldValue('domain', domainValue);

        if (values.service_name === 'CloudFlare') {
            formik.setFieldValue('cloudFlareProviderAccount', values?.account_name);
            formik.setFieldValue('cloudFareEmail', values?.account_email);
            formik.setFieldValue('cloudFlareApiToken', values?.api_token);
        }
        if (values.service_name === 'Cloudns') {
            formik.setFieldValue('cloudnsProviderAccount', values?.account_name);
            formik.setFieldValue('cloudnsEmail', values?.account_email);
            formik.setFieldValue('cloudnsApiKey', values?.api_key);
            formik.setFieldValue('cloudnsApiSecret', values?.api_secret);
        }
        if (values.service_name === 'Godaddy') {
            formik.setFieldValue('godaddyProviderAccount', values?.account_name);
            formik.setFieldValue('godaddyEmail', values?.account_email);
            formik.setFieldValue('godaddyApiKey', values?.api_key);
            formik.setFieldValue('godaddyApiSecret', values?.api_secret);
        }
        if (values.service_name === 'Namecheap') {
            formik.setFieldValue('namecheapProviderAccount', values?.account_name);
            formik.setFieldValue('namecheapEmail', values?.account_email);
            formik.setFieldValue('namecheapApiKey', values?.api_key);
            formik.setFieldValue('namecheapApiUser', values?.api_user);
        }
        if (values.service_name === 'MailChmap1') {
            formik.setFieldValue('mailChamp1ProviderAccount', values?.account_name);
            formik.setFieldValue('mailChamp1Email', values?.account_email);
        }

        setTimeout(() => {
            formik.validateField('domain');
        }, 0);
    };

    const getData = async () => {
        const { data } = await getDomainServicesDetails();
        console.log(data.result);
        setData(data?.result);
    };
    useEffect(() => {
        getData();
    }, []);

    const addDomainDetails = async (data) => {
        try {
            const res = await axiosInstance.post(`${apiEndPoints.addDomainAccountsDetails}`, data);
            console.log(res);
            getDataRender();
            setIsDrawerOpen(false);
            setTimeout(() => {
                formik.resetForm();
            }, 1000);
            enqueueSnackbar(`${res?.data?.message}`, {
                variant: 'success'
            });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error?.response?.data?.message}`, {
                variant: 'error'
            });
        }
    };
    const updateDomainDetails = async (data) => {
        try {
            const res = await axiosInstance.put(`${apiEndPoints.updateDomainAccountsDetails}/${receivedData?.account_id}`, data);
            console.log(res);
            getDataRender();
            setIsDrawerOpen(false);
            setTimeout(() => {
                formik.resetForm();
            }, 1000);
            enqueueSnackbar(`${res?.data?.message}`, {
                variant: 'success'
            });
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error?.response?.data?.message}`, {
                variant: 'error'
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            domain: null,
            cloudFlareProviderAccount: '',
            cloudFareEmail: '',
            cloudFlareApiToken: '',
            //// cloudns
            cloudnsProviderAccount: '',
            cloudnsEmail: '',
            cloudnsApiKey: '',
            cloudnsApiSecret: '',
            //// Godaddy
            godaddyProviderAccount: '',
            godaddyEmail: '',
            godaddyApiKey: '',
            godaddyApiSecret: '',
            //// MailChamp1
            mailChamp1ProviderAccount: '',
            mailChamp1Email: '',
            //// namecheap
            namecheapProviderAccount: '',
            namecheapEmail: '',
            namecheapApiKey: '',
            namecheapApiUser: ''
        },
        validationSchema,
        onSubmit: (values) => {
            if (formik.values.domain?.service_name === 'CloudFlare') {
                const data = {
                    service_id: values.domain?.service_id,
                    account_name: values?.cloudFlareProviderAccount.trim(),
                    account_email: values?.cloudFareEmail.trim(),
                    api_token: values?.cloudFlareApiToken.trim(),
                    created_by: createdBy,
                    created_by_name: createdByName
                };

                console.log(data);
                if (defaultValueslength === 0) {
                    addDomainDetails(data);
                } else {
                    updateDomainDetails(data);
                }
            } else if (formik.values.domain?.service_name === 'Cloudns') {
                const data = {
                    service_id: values.domain?.service_id,
                    account_name: values?.cloudnsProviderAccount.trim(),
                    account_email: values?.cloudnsEmail.trim(),
                    api_key: values?.cloudnsApiKey.trim(),
                    api_secret: values?.cloudnsApiSecret.trim(),
                    created_by: createdBy,
                    created_by_name: createdByName
                };
                if (defaultValueslength === 0) {
                    addDomainDetails(data);
                } else {
                    updateDomainDetails(data);
                }
                console.log(data);
            } else if (formik.values.domain?.service_name === 'Godaddy') {
                const data = {
                    service_id: values.domain?.service_id,
                    account_name: values?.godaddyProviderAccount.trim(),
                    account_email: values?.godaddyEmail.trim(),
                    api_key: values?.godaddyApiKey.trim(),
                    api_secret: values?.godaddyApiSecret.trim(),
                    created_by: createdBy,
                    created_by_name: createdByName
                };
                if (defaultValueslength === 0) {
                    addDomainDetails(data);
                } else {
                    updateDomainDetails(data);
                }
                console.log(data);
            } else if (formik.values.domain?.service_name === 'MailChmap1') {
                const data = {
                    service_id: values.domain?.service_id,
                    account_name: values?.mailChamp1ProviderAccount.trim(),
                    account_email: values?.mailChamp1Email.trim(),
                    created_by: createdBy,
                    created_by_name: createdByName
                };
                if (defaultValueslength === 0) {
                    addDomainDetails(data);
                } else {
                    updateDomainDetails(data);
                }
                console.log(data);
            } else if (formik.values.domain?.service_name === 'Namecheap') {
                const data = {
                    service_id: values.domain?.service_id,
                    account_name: values?.namecheapProviderAccount.trim(),
                    account_email: values?.namecheapEmail.trim(),
                    api_key: values?.namecheapApiKey.trim(),
                    api_user: values?.namecheapApiUser.trim(),
                    created_by: createdBy,
                    created_by_name: createdByName
                };
                if (defaultValueslength === 0) {
                    addDomainDetails(data);
                } else {
                    updateDomainDetails(data);
                }
                console.log(data);
            }
        }
    });
    return (
        <Drawer anchor="right" open={isDrawerOpen}>
            <Box sx={{ m: 1, width: '350px', margin: '24px' }} noValidate autoComplete="off">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography
                            sx={{
                                fontWeight: '600',
                                fontSize: '1.3rem',
                                mt: 2,
                                mb: 2
                            }}
                        >
                            {defaultValueslength === 0 ? 'Create new doamin' : 'Update Domain'}
                        </Typography>

                        <Autocomplete
                            fullWidth
                            id="domain"
                            name="domain"
                            options={data}
                            // disabled={defaultValueslength === 0 ? false : true}
                            getOptionLabel={(option) => option.service_name}
                            value={formik.values.domain}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('domain', newValue);
                                // console.log(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    variant="standard"
                                    {...params}
                                    label="Domain Service *"
                                    error={formik.touched.domain && Boolean(formik.errors.domain)}
                                    helperText={formik.touched.domain && formik.errors.domain}
                                />
                            )}
                        />
                        {formik?.values?.domain?.service_name === 'CloudFlare' && (
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudFlareProviderAccount"
                                    name="cloudFlareProviderAccount"
                                    label="Domain Provider Account *"
                                    value={formik.values.cloudFlareProviderAccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudFlareProviderAccount && Boolean(formik.errors.cloudFlareProviderAccount)}
                                    helperText={formik.touched.cloudFlareProviderAccount && formik.errors.cloudFlareProviderAccount}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudFareEmail"
                                    name="cloudFareEmail"
                                    label="Email *"
                                    value={formik.values.cloudFareEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudFareEmail && Boolean(formik.errors.cloudFareEmail)}
                                    helperText={formik.touched.cloudFareEmail && formik.errors.cloudFareEmail}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudFlareApiToken"
                                    name="cloudFlareApiToken"
                                    label="Api Token *"
                                    value={formik.values.cloudFlareApiToken}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudFlareApiToken && Boolean(formik.errors.cloudFlareApiToken)}
                                    helperText={formik.touched.cloudFlareApiToken && formik.errors.cloudFlareApiToken}
                                />
                            </div>
                        )}
                        {formik?.values?.domain?.service_name === 'Cloudns' && (
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudnsProviderAccount"
                                    name="cloudnsProviderAccount"
                                    label="Domain Provider Account *"
                                    value={formik.values.cloudnsProviderAccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudnsProviderAccount && Boolean(formik.errors.cloudnsProviderAccount)}
                                    helperText={formik.touched.cloudnsProviderAccount && formik.errors.cloudnsProviderAccount}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudnsEmail"
                                    name="cloudnsEmail"
                                    label="Email *"
                                    value={formik.values.cloudnsEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudnsEmail && Boolean(formik.errors.cloudnsEmail)}
                                    helperText={formik.touched.cloudnsEmail && formik.errors.cloudnsEmail}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudnsApiKey"
                                    name="cloudnsApiKey"
                                    label="API Key *"
                                    value={formik.values.cloudnsApiKey}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudnsApiKey && Boolean(formik.errors.cloudnsApiKey)}
                                    helperText={formik.touched.cloudnsApiKey && formik.errors.cloudnsApiKey}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="cloudnsApiSecret"
                                    name="cloudnsApiSecret"
                                    label="API Secret *"
                                    value={formik.values.cloudnsApiSecret}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.cloudnsApiSecret && Boolean(formik.errors.cloudnsApiSecret)}
                                    helperText={formik.touched.cloudnsApiSecret && formik.errors.cloudnsApiSecret}
                                />
                            </div>
                        )}
                        {formik?.values?.domain?.service_name === 'Godaddy' && (
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="godaddyProviderAccount"
                                    name="godaddyProviderAccount"
                                    label="Domain Provider Account *"
                                    value={formik.values.godaddyProviderAccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.godaddyProviderAccount && Boolean(formik.errors.godaddyProviderAccount)}
                                    helperText={formik.touched.godaddyProviderAccount && formik.errors.godaddyProviderAccount}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="godaddyEmail"
                                    name="godaddyEmail"
                                    label="Email *"
                                    value={formik.values.godaddyEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.godaddyEmail && Boolean(formik.errors.godaddyEmail)}
                                    helperText={formik.touched.godaddyEmail && formik.errors.godaddyEmail}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="godaddyApiKey"
                                    name="godaddyApiKey"
                                    label="API Key *"
                                    value={formik.values.godaddyApiKey}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.godaddyApiKey && Boolean(formik.errors.godaddyApiKey)}
                                    helperText={formik.touched.godaddyApiKey && formik.errors.godaddyApiKey}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="godaddyApiSecret"
                                    name="godaddyApiSecret"
                                    label="API Secret *"
                                    value={formik.values.godaddyApiSecret}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.godaddyApiSecret && Boolean(formik.errors.godaddyApiSecret)}
                                    helperText={formik.touched.godaddyApiSecret && formik.errors.godaddyApiSecret}
                                />
                            </div>
                        )}
                        {formik?.values?.domain?.service_name === 'MailChmap1' && (
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="mailChamp1ProviderAccount"
                                    name="mailChamp1ProviderAccount"
                                    label="Domain Provider Account *"
                                    value={formik.values.mailChamp1ProviderAccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.mailChamp1ProviderAccount && Boolean(formik.errors.mailChamp1ProviderAccount)}
                                    helperText={formik.touched.mailChamp1ProviderAccount && formik.errors.mailChamp1ProviderAccount}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="mailChamp1Email"
                                    name="mailChamp1Email"
                                    label="Email *"
                                    value={formik.values.mailChamp1Email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.mailChamp1Email && Boolean(formik.errors.mailChamp1Email)}
                                    helperText={formik.touched.mailChamp1Email && formik.errors.mailChamp1Email}
                                />
                            </div>
                        )}
                        {formik?.values?.domain?.service_name === 'Namecheap' && (
                            <div>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="namecheapProviderAccount"
                                    name="namecheapProviderAccount"
                                    label="Domain Provider Account *"
                                    value={formik.values.namecheapProviderAccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.namecheapProviderAccount && Boolean(formik.errors.namecheapProviderAccount)}
                                    helperText={formik.touched.namecheapProviderAccount && formik.errors.namecheapProviderAccount}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="namecheapEmail"
                                    name="namecheapEmail"
                                    label="Email *"
                                    value={formik.values.namecheapEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.namecheapEmail && Boolean(formik.errors.namecheapEmail)}
                                    helperText={formik.touched.namecheapEmail && formik.errors.namecheapEmail}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="namecheapApiKey"
                                    name="namecheapApiKey"
                                    label="API Key *"
                                    value={formik.values.namecheapApiKey}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.namecheapApiKey && Boolean(formik.errors.namecheapApiKey)}
                                    helperText={formik.touched.namecheapApiKey && formik.errors.namecheapApiKey}
                                />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="namecheapApiUser"
                                    name="namecheapApiUser"
                                    label="API User *"
                                    value={formik.values.namecheapApiUser}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.namecheapApiUser && Boolean(formik.errors.namecheapApiUser)}
                                    helperText={formik.touched.namecheapApiUser && formik.errors.namecheapApiUser}
                                />
                            </div>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                onClick={() => {
                                    setIsDrawerOpen(false);
                                    formik.resetForm();
                                    setDefaultValues({});
                                }}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    // setDefaultValues({});
                                }}
                                variant="contained"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                </div>
            </Box>
        </Drawer>
    );
};

export default DomainDrawer;
